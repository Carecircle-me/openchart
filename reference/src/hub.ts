// OpenChart mock hub (PDRE protocol): in-memory, synthetic data only. NOT for real patient data.
// Licensed under Apache-2.0. Provided AS IS, without warranty. See ../../DISCLAIMER.md.
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

type Json = Record<string, any>;

export interface CreateRequestInput {
  holderOrg: string;
  preset?: string;
  reason?: string;
  patient: { family: string; given: string; birthDate: string };
}

export interface ConsentInput {
  otp: string;
  birthDate: string;
  exclude?: string[]; // section codes the patient unticks
  days?: number; // consent validity, default 30
}

export class HubError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Section codes -> FHIR resource types, per discipline preset.
export const PRESETS: Record<string, Record<string, string>> = {
  'dental-full': {
    allergies: 'AllergyIntolerance',
    medications: 'MedicationStatement',
    conditions: 'Condition',
    procedures: 'Procedure',
    'treatment-plan': 'CarePlan',
    imaging: 'ImagingStudy',
  },
  'medical-summary': {
    allergies: 'AllergyIntolerance',
    medications: 'MedicationStatement',
    conditions: 'Condition',
    procedures: 'Procedure',
  },
  'medication-list': { allergies: 'AllergyIntolerance', medications: 'MedicationStatement' },
  'imaging-only': { imaging: 'ImagingStudy' },
};

const SANDBOX_OTP = '000000'; // fixed sandbox code; a real hub sends a random one-time code
const SYN_TAG = { system: 'https://example.org/pdre/CodeSystem/data-origin', code: 'synthetic' };

interface RequestRecord {
  task: Json;
  requesterOrg: string;
  holderOrg: string;
  preset: string;
  matchedPatientId?: string; // holder-local; never returned to the requester
  consent?: Json;
  transferId?: string;
  patientExcluded: string[];
}

export function loadJson(path: string | URL): Json {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export class MockHub {
  orgs = new Map<string, Json>();
  charts = new Map<string, Json[]>(); // orgId -> resources
  requests = new Map<string, RequestRecord>();
  transfers = new Map<string, { requestId: string; bundle: Json; to: string; acked?: string }>();
  audit: Json[] = [];
  outbox: Json[] = []; // simulated SMS/email notifications (nothing is ever really sent)
  now: () => Date;

  constructor(opts: { directory: Json; charts: Record<string, Json>; now?: () => Date }) {
    for (const e of opts.directory.entry ?? []) {
      if (e.resource?.resourceType === 'Organization') this.orgs.set(e.resource.id, e.resource);
    }
    for (const [org, bundle] of Object.entries(opts.charts)) {
      this.charts.set(org, (bundle.entry ?? []).map((e: Json) => e.resource));
    }
    this.now = opts.now ?? (() => new Date());
  }

  static fromExamples(dir: URL = new URL('../../examples/', import.meta.url)): MockHub {
    return new MockHub({
      directory: loadJson(new URL('directory.json', dir)),
      charts: { 'office-a-ajax': loadJson(new URL('holder-chart-office-a.json', dir)) },
    });
  }

  private log(action: string, code: string, who: string, requestId?: string, outcome = '0') {
    const ev = {
      resourceType: 'AuditEvent',
      id: randomUUID(),
      meta: { tag: [SYN_TAG] },
      type: { system: 'https://example.org/pdre/CodeSystem/audit', code },
      action,
      recorded: this.now().toISOString(),
      outcome,
      agent: [{ who: { reference: who }, requestor: true }],
      source: { observer: { display: 'OpenChart mock hub (sandbox)' } },
      entity: requestId ? [{ what: { reference: `Task/${requestId}` } }] : [],
    };
    this.audit.push(ev);
  }

  private get(id: string): RequestRecord {
    const r = this.requests.get(id);
    if (!r) throw new HubError(404, 'request not found');
    return r;
  }

  private requireOrg(org: string | undefined): string {
    if (!org || !this.orgs.has(org)) throw new HubError(401, 'unknown or missing organisation');
    return org;
  }

  searchDirectory(name = ''): Json {
    const q = name.toLowerCase();
    const hits = [...this.orgs.values()].filter((o) => o.name.toLowerCase().includes(q));
    return { resourceType: 'Bundle', type: 'searchset', total: hits.length, entry: hits.map((resource) => ({ resource })) };
  }

  createRequest(requesterOrg: string | undefined, input: CreateRequestInput): Json {
    const from = this.requireOrg(requesterOrg);
    if (!input?.holderOrg || !this.orgs.has(input.holderOrg)) throw new HubError(400, 'holderOrg must be a verified directory entry');
    if (input.holderOrg === from) throw new HubError(400, 'cannot request from yourself');
    const p = input.patient;
    if (!p?.family || !p?.given || !/^\d{4}-\d{2}-\d{2}$/.test(p?.birthDate ?? '')) throw new HubError(400, 'patient family, given and birthDate (YYYY-MM-DD) are required');
    if (!input.preset) throw new HubError(400, `preset is required; use one of ${Object.keys(PRESETS).join(', ')}`);
    const preset = input.preset;
    if (!PRESETS[preset]) throw new HubError(400, `unknown preset; use one of ${Object.keys(PRESETS).join(', ')}`);
    const id = randomUUID();
    const task = {
      resourceType: 'Task',
      id,
      meta: { tag: [SYN_TAG] },
      status: 'requested',
      businessStatus: { text: 'awaiting-consent' },
      intent: 'order',
      code: { coding: [{ system: 'https://example.org/pdre/CodeSystem/message', code: 'record-request' }] },
      authoredOn: this.now().toISOString(),
      requester: { reference: `Organization/${from}` },
      owner: { reference: `Organization/${input.holderOrg}` },
      reasonCode: { text: input.reason ?? 'Continuing care' },
      input: [{ type: { text: 'preset' }, valueCode: preset }],
    };
    const rec: RequestRecord = { task, requesterOrg: from, holderOrg: input.holderOrg, preset, patientExcluded: [] };
    // Holder-local match. The result is never returned to the requester.
    const chart = this.charts.get(input.holderOrg) ?? [];
    const match = chart.find(
      (r) => r.resourceType === 'Patient' && r.birthDate === p.birthDate &&
        r.name?.some((n: Json) => n.family?.toLowerCase() === p.family.toLowerCase() && n.given?.some((g: string) => g.toLowerCase() === p.given.toLowerCase())),
    );
    if (match) {
      rec.matchedPatientId = match.id;
      // Simulated notification to the contact the HOLDER has on file (masked; nothing is sent).
      this.outbox.push({ requestId: id, channel: 'sms', to: 'contact on file at holder (masked)', body: `Sandbox: ${this.orgs.get(from)!.name} is asking for your records. Your code is ${SANDBOX_OTP}.` });
    }
    this.requests.set(id, rec);
    this.log('C', 'record-request', `Organization/${from}`, id);
    return task;
  }

  getRequest(org: string | undefined, id: string): Json {
    const who = this.requireOrg(org);
    const r = this.get(id);
    if (who !== r.requesterOrg && who !== r.holderOrg) throw new HubError(403, 'not a party to this request');
    this.log('R', 'read-request', `Organization/${who}`, id);
    return r.task;
  }

  consent(id: string, input: ConsentInput): Json {
    const r = this.get(id);
    if (r.task.status !== 'requested') throw new HubError(409, `request is ${r.task.status}`);
    const patient = (this.charts.get(r.holderOrg) ?? []).find((x) => x.id === r.matchedPatientId);
    // Same generic error for every failure, so the endpoint can't be used to probe for patients.
    if (!patient || input?.otp !== SANDBOX_OTP || input?.birthDate !== patient.birthDate) {
      this.log('E', 'consent-verify', 'Patient/unverified', id, '4');
      throw new HubError(403, 'verification failed');
    }
    const sections = PRESETS[r.preset];
    const exclude = (input.exclude ?? []).filter((s) => s in sections);
    const start = this.now();
    const end = new Date(start.getTime() + (input.days ?? 30) * 86400000);
    const consent = {
      resourceType: 'Consent',
      id: randomUUID(),
      meta: { tag: [SYN_TAG] },
      status: 'active',
      scope: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/consentscope', code: 'patient-privacy' }] },
      category: [{ coding: [{ system: 'http://loinc.org', code: '59284-0' }] }],
      patient: { reference: `Patient/${patient.id}` },
      dateTime: start.toISOString(),
      provision: {
        type: 'permit',
        period: { start: start.toISOString(), end: end.toISOString() },
        actor: [
          { role: { text: 'recipient' }, reference: { reference: `Organization/${r.requesterOrg}` } },
          { role: { text: 'custodian' }, reference: { reference: `Organization/${r.holderOrg}` } },
        ],
        purpose: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ActReason', code: 'TREAT' }],
        provision: exclude.map((code) => ({ type: 'deny', code: [{ text: code }] })),
      },
    };
    r.consent = consent;
    r.patientExcluded = exclude;
    r.task.businessStatus = { text: 'consented-awaiting-release' };
    this.log('C', 'consent-grant', `Patient/${patient.id}`, id);
    // The requester sees the consent minus the holder-local patient id.
    return { ...consent, patient: { display: 'verified patient' } };
  }

  revoke(id: string, input: { otp: string; birthDate: string }): Json {
    const r = this.get(id);
    const patient = (this.charts.get(r.holderOrg) ?? []).find((x) => x.id === r.matchedPatientId);
    if (!patient || input?.otp !== SANDBOX_OTP || input?.birthDate !== patient.birthDate) throw new HubError(403, 'verification failed');
    if (r.transferId) throw new HubError(409, 'already released; revocation does not reach back to delivered data');
    if (r.consent) r.consent.status = 'inactive';
    r.task.status = 'cancelled';
    r.task.businessStatus = { text: 'consent-withdrawn' };
    this.log('U', 'consent-revoke', `Patient/${patient.id}`, id);
    return r.task;
  }

  decline(org: string | undefined, id: string, reason: string): Json {
    const who = this.requireOrg(org);
    const r = this.get(id);
    if (who !== r.holderOrg) throw new HubError(403, 'only the holder can decline');
    if (r.task.status !== 'requested') throw new HubError(409, `request is ${r.task.status}`);
    r.task.status = 'rejected';
    r.task.statusReason = { text: reason || 'other' };
    this.log('U', 'release-decline', `Organization/${who}`, id);
    return r.task;
  }

  release(org: string | undefined, id: string, input: { staff: string; exclude?: string[] }): Json {
    const who = this.requireOrg(org);
    const r = this.get(id);
    if (who !== r.holderOrg) throw new HubError(403, 'only the holder can release');
    if (!input?.staff) throw new HubError(400, 'release is a human decision: staff is required');
    if (r.task.status !== 'requested') throw new HubError(409, `request is ${r.task.status}`);
    if (!r.consent || r.consent.status !== 'active') throw new HubError(409, 'no active patient consent');
    if (new Date(r.consent.provision.period.end) < this.now()) throw new HubError(409, 'consent expired');
    const sections = PRESETS[r.preset];
    const staffExcluded = (input.exclude ?? []).filter((s) => s in sections);
    const excluded = new Set([...r.patientExcluded, ...staffExcluded]);
    const chart = this.charts.get(r.holderOrg) ?? [];
    const patient = chart.find((x) => x.id === r.matchedPatientId)!;
    const included: Json[] = [];
    const compSections: Json[] = [];
    for (const [code, type] of Object.entries(sections)) {
      if (excluded.has(code)) continue;
      const items = chart
        .filter((x) => x.resourceType === type)
        .map((x) => ({ ...x, meta: { ...x.meta, tag: [...(x.meta?.tag ?? []), { system: 'https://example.org/pdre/CodeSystem/verification', code: 'external-unverified' }] } }));
      included.push(...items);
      compSections.push({ title: code, code: { text: code }, entry: items.map((x) => ({ reference: `${x.resourceType}/${x.id}` })) });
    }
    const withheld = r.patientExcluded.length > 0;
    if (withheld) {
      compSections.push({
        title: 'Information withheld',
        code: { coding: [{ system: 'https://example.org/pdre/CodeSystem/section', code: 'withheld' }] },
        text: { status: 'generated', div: '<div xmlns="http://www.w3.org/1999/xhtml">Some information has been withheld at the patient\'s direction.</div>' },
      });
    }
    const transferId = randomUUID();
    const ts = this.now().toISOString();
    const doc = {
      resourceType: 'Bundle',
      id: `doc-${transferId}`,
      type: 'document',
      timestamp: ts,
      entry: [
        { resource: { resourceType: 'Composition', status: 'final', type: { text: `PDRE ${r.preset} transfer` }, title: 'Records transfer (SYNTHETIC)', date: ts, author: [{ reference: `Organization/${r.holderOrg}` }], subject: { reference: `Patient/${patient.id}` }, section: compSections } },
        { resource: patient },
        ...included.map((resource) => ({ resource })),
      ],
    };
    const bundle = {
      resourceType: 'Bundle',
      id: `msg-${transferId}`,
      type: 'message',
      timestamp: ts,
      meta: { tag: [SYN_TAG] },
      entry: [
        {
          resource: {
            resourceType: 'MessageHeader',
            id: `mh-${transferId}`,
            eventCoding: { system: 'https://example.org/pdre/CodeSystem/event', code: 'record-bundle' },
            source: { endpoint: `https://hub.example.org/org/${r.holderOrg}` },
            destination: [{ endpoint: `https://hub.example.org/org/${r.requesterOrg}` }],
            focus: [{ reference: `Bundle/${doc.id}` }],
            extension: [
              { url: 'https://example.org/pdre/StructureDefinition/pdre-task', valueReference: { reference: `Task/${id}` } },
              { url: 'https://example.org/pdre/StructureDefinition/pdre-consent', valueReference: { reference: `Consent/${r.consent.id}` } },
              { url: 'https://example.org/pdre/StructureDefinition/pdre-withheld', valueBoolean: withheld },
            ],
          },
        },
        { resource: doc },
      ],
    };
    r.transferId = transferId;
    this.transfers.set(transferId, { requestId: id, bundle, to: r.requesterOrg });
    r.task.status = 'completed';
    r.task.businessStatus = { text: 'released' };
    r.task.output = [{ type: { text: 'transfer' }, valueString: transferId }];
    r.task.extension = [{ url: 'https://example.org/pdre/StructureDefinition/pdre-approved-by', valueString: input.staff }];
    this.log('E', 'release', `Organization/${who}`, id);
    return r.task;
  }

  getTransfer(org: string | undefined, transferId: string): Json {
    const who = this.requireOrg(org);
    const t = this.transfers.get(transferId);
    if (!t) throw new HubError(404, 'transfer not found');
    if (who !== t.to) throw new HubError(403, 'only the named recipient can fetch this transfer');
    this.log('R', 'transfer-fetch', `Organization/${who}`, t.requestId);
    return t.bundle;
  }

  ack(org: string | undefined, transferId: string, status: string): Json {
    const who = this.requireOrg(org);
    const t = this.transfers.get(transferId);
    if (!t) throw new HubError(404, 'transfer not found');
    if (who !== t.to) throw new HubError(403, 'only the recipient can acknowledge');
    const allowed = ['received', 'imported', 'rejected-wrong-patient'];
    if (!allowed.includes(status)) throw new HubError(400, `status must be one of ${allowed.join(', ')}`);
    t.acked = status;
    const r = this.get(t.requestId);
    r.task.businessStatus = { text: status };
    this.log('U', `ack-${status}`, `Organization/${who}`, t.requestId);
    return { resourceType: 'MessageHeader', eventCoding: { system: 'https://example.org/pdre/CodeSystem/event', code: 'ack' }, response: { identifier: `mh-${transferId}`, code: 'ok' }, extension: [{ url: 'https://example.org/pdre/StructureDefinition/pdre-business-status', valueCode: status }] };
  }

  auditFor(org: string | undefined, requestId: string): Json {
    const who = this.requireOrg(org);
    const r = this.get(requestId);
    if (who !== r.requesterOrg && who !== r.holderOrg) throw new HubError(403, 'not a party to this request');
    const hits = this.audit.filter((e) => e.entity.some((x: Json) => x.what.reference === `Task/${requestId}`));
    return { resourceType: 'Bundle', type: 'searchset', total: hits.length, entry: hits.map((resource) => ({ resource })) };
  }
}
