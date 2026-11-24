// Runs the full one-click flow against an in-process mock hub and prints each step.
// Synthetic data only. Prints to the console; writes nothing.
import type { AddressInfo } from 'node:net';
import { createHubServer } from '../src/server.ts';
import { PdreClient } from '../src/client.ts';

const server = createHubServer();
await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()));
const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
const officeB = new PdreClient(base, 'office-b-london');
const officeA = new PdreClient(base, 'office-a-ajax');
const patient = new PdreClient(base);

console.log('SANDBOX DEMO - synthetic data only\n');
const req = await officeB.requestRecords({ holderOrg: 'office-a-ajax', preset: 'dental-full', patient: { family: 'Sample', given: 'Jane', birthDate: '1985-04-12' } });
console.log('1. Office B clicks "Request records":', req.status, req.body.status);
const outbox = await patient.call('GET', '/sandbox/outbox');
console.log('   Simulated text to patient (nothing sent):', outbox.body.at(-1)?.body);
const c = await patient.consent(req.body.id, { otp: '000000', birthDate: '1985-04-12', exclude: ['medications'] });
console.log('2. Patient taps "Sign" (unticks medications):', c.status, c.body.status);
const rel = await officeA.release(req.body.id, { staff: 'front-desk-1' });
console.log('3. Office A taps "Release":', rel.status, rel.body.status);
const t = await officeB.getTransfer(rel.body.output[0].valueString);
const doc = t.body.entry[1].resource;
console.log('4. Office B receives the bundle:', doc.entry.map((e: any) => e.resource.resourceType).join(', '));
console.log('   Sections:', doc.entry[0].resource.section.map((s: any) => s.title).join(' | '));
await officeB.ack(rel.body.output[0].valueString, 'imported');
const audit = await officeA.audit(req.body.id);
console.log('5. Audit trail:', audit.body.entry.map((e: any) => e.resource.type.code).join(' -> '));
server.close();
