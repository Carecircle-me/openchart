import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { createHubServer } from '../src/server.ts';
import { MockHub } from '../src/hub.ts';
import { PdreClient } from '../src/client.ts';

let server: ReturnType<typeof createHubServer>;
let base = '';
const JANE = { family: 'Sample', given: 'Jane', birthDate: '1985-04-12' };

before(async () => {
  server = createHubServer(MockHub.fromExamples());
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => server.close());

test('happy path: request -> patient consent -> release -> transfer -> ack -> audit', async () => {
  const b = new PdreClient(base, 'office-b-london');
  const a = new PdreClient(base, 'office-a-ajax');
  const patient = new PdreClient(base);

  const dir = await b.searchDirectory('Sample Family');
  assert.equal(dir.status, 200);
  assert.equal(dir.body.total, 1);

  const req = await b.requestRecords({ holderOrg: 'office-a-ajax', preset: 'dental-full', patient: JANE });
  assert.equal(req.status, 201);
  assert.equal(req.body.status, 'requested');
  assert.ok(!JSON.stringify(req.body).includes('pt-jane-sample'), 'holder match must not leak to requester');
  const id = req.body.id;

  const early = await a.release(id, { staff: 'staff-1' });
  assert.equal(early.status, 409, 'no release before consent');

  const c = await patient.consent(id, { otp: '000000', birthDate: JANE.birthDate, exclude: ['medications'] });
  assert.equal(c.status, 201);
  assert.equal(c.body.status, 'active');

  const rel = await a.release(id, { staff: 'staff-1' });
  assert.equal(rel.status, 200);
  assert.equal(rel.body.status, 'completed');
  const transferId = rel.body.output[0].valueString;

  const wrong = await a.getTransfer(transferId);
  assert.equal(wrong.status, 403, 'only the recipient can fetch');

  const t = await b.getTransfer(transferId);
  assert.equal(t.status, 200);
  assert.equal(t.body.type, 'message');
  const doc = t.body.entry[1].resource;
  const types = doc.entry.map((e: any) => e.resource.resourceType);
  assert.ok(types.includes('AllergyIntolerance'));
  assert.ok(!types.includes('MedicationStatement'), 'patient-excluded section must not be sent');
  const comp = doc.entry[0].resource;
  assert.ok(comp.section.some((s: any) => s.code?.coding?.[0]?.code === 'withheld'), 'withheld notice present');
  assert.ok(!JSON.stringify(comp).includes('medications'), 'withheld notice never says what');

  const ack = await b.ack(transferId, 'imported');
  assert.equal(ack.status, 200);

  const audit = await a.audit(id);
  const codes = audit.body.entry.map((e: any) => e.resource.type.code);
  for (const c2 of ['record-request', 'consent-grant', 'release', 'transfer-fetch', 'ack-imported']) assert.ok(codes.includes(c2), `audit has ${c2}`);
});

test('wrong DOB or code fails with a generic error', async () => {
  const b = new PdreClient(base, 'office-b-london');
  const req = await b.requestRecords({ holderOrg: 'office-a-ajax', preset: 'medical-summary', patient: JANE });
  const bad = await new PdreClient(base).consent(req.body.id, { otp: '000000', birthDate: '1990-01-01' });
  assert.equal(bad.status, 403);
  assert.equal(bad.body.issue[0].diagnostics, 'verification failed');
});

test('unknown patient gives the same generic error (no probing)', async () => {
  const b = new PdreClient(base, 'office-b-london');
  const req = await b.requestRecords({ holderOrg: 'office-a-ajax', preset: 'medical-summary', patient: { family: 'Nobody', given: 'No', birthDate: '2000-01-01' } });
  assert.equal(req.status, 201);
  const bad = await new PdreClient(base).consent(req.body.id, { otp: '000000', birthDate: '2000-01-01' });
  assert.equal(bad.status, 403);
  assert.equal(bad.body.issue[0].diagnostics, 'verification failed');
});

test('patient can withdraw consent before release; release then fails', async () => {
  const b = new PdreClient(base, 'office-b-london');
  const a = new PdreClient(base, 'office-a-ajax');
  const p = new PdreClient(base);
  const { body } = await b.requestRecords({ holderOrg: 'office-a-ajax', preset: 'medical-summary', patient: JANE });
  await p.consent(body.id, { otp: '000000', birthDate: JANE.birthDate });
  const rv = await p.revoke(body.id, { otp: '000000', birthDate: JANE.birthDate });
  assert.equal(rv.status, 200);
  assert.equal(rv.body.status, 'cancelled');
  assert.equal((await a.release(body.id, { staff: 'staff-1' })).status, 409);
});

test('auth: missing org, unverified holder, non-party reads', async () => {
  assert.equal((await new PdreClient(base).requestRecords({ holderOrg: 'office-a-ajax', preset: 'medical-summary', patient: JANE })).status, 401);
  assert.equal((await new PdreClient(base, 'office-b-london').requestRecords({ holderOrg: 'not-in-directory', patient: JANE })).status, 400);
  const b = new PdreClient(base, 'office-b-london');
  const { body } = await b.requestRecords({ holderOrg: 'office-a-ajax', preset: 'medical-summary', patient: JANE });
  assert.equal((await b.release(body.id, { staff: 'x' })).status, 403, 'requester cannot release');
  assert.equal((await new PdreClient(base, 'office-a-ajax').release(body.id, {})).status, 400, 'release needs a named staff member');
});

test('holder can decline', async () => {
  const { body } = await new PdreClient(base, 'office-b-london').requestRecords({ holderOrg: 'office-a-ajax', preset: 'medical-summary', patient: JANE });
  const d = await new PdreClient(base, 'office-a-ajax').decline(body.id, 'no-match');
  assert.equal(d.body.status, 'rejected');
});
