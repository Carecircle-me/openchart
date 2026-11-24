// OpenChart mock hub HTTP server (PDRE protocol). Sandbox only, synthetic data only.
// Sandbox auth: the X-PDRE-Org header stands in for SMART Backend Services tokens. Never use this in production.
import { createServer, type IncomingMessage, type ServerResponse, type Server } from 'node:http';
import { MockHub, HubError } from './hub.ts';

async function body(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 1_000_000) throw new HubError(413, 'payload too large');
    chunks.push(c);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new HubError(400, 'invalid JSON'); }
}

function send(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'content-type': 'application/fhir+json; charset=utf-8', 'x-pdre-sandbox': 'synthetic-data-only' });
  res.end(JSON.stringify(data, null, 2));
}

function outcome(status: number, msg: string) {
  return { resourceType: 'OperationOutcome', issue: [{ severity: 'error', code: status === 404 ? 'not-found' : status === 403 || status === 401 ? 'security' : 'processing', diagnostics: msg }] };
}

export function createHubServer(hub: MockHub = MockHub.fromExamples()): Server {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://localhost');
      const org = req.headers['x-pdre-org'] as string | undefined;
      const p = url.pathname.split('/').filter(Boolean);
      const m = req.method ?? 'GET';
      if (m === 'GET' && url.pathname === '/health') return send(res, 200, { status: 'ok', mode: 'sandbox', data: 'synthetic only' });
      if (m === 'GET' && url.pathname === '/directory/Organization') return send(res, 200, hub.searchDirectory(url.searchParams.get('name') ?? ''));
      if (m === 'GET' && url.pathname === '/sandbox/outbox') return send(res, 200, hub.outbox);
      if (m === 'POST' && url.pathname === '/requests') return send(res, 201, hub.createRequest(org, await body(req)));
      if (p[0] === 'requests' && p[1]) {
        if (m === 'GET' && p.length === 2) return send(res, 200, hub.getRequest(org, p[1]));
        if (m === 'POST' && p[2] === 'consent') return send(res, 201, hub.consent(p[1], await body(req)));
        if (m === 'POST' && p[2] === 'revoke') return send(res, 200, hub.revoke(p[1], await body(req)));
        if (m === 'POST' && p[2] === 'release') return send(res, 200, hub.release(org, p[1], await body(req)));
        if (m === 'POST' && p[2] === 'decline') return send(res, 200, hub.decline(org, p[1], (await body(req)).reason));
      }
      if (p[0] === 'transfers' && p[1]) {
        if (m === 'GET' && p.length === 2) return send(res, 200, hub.getTransfer(org, p[1]));
        if (m === 'POST' && p[2] === 'ack') return send(res, 200, hub.ack(org, p[1], (await body(req)).status));
      }
      if (m === 'GET' && url.pathname === '/audit') return send(res, 200, hub.auditFor(org, url.searchParams.get('request') ?? ''));
      return send(res, 404, outcome(404, 'no such route'));
    } catch (e) {
      const status = e instanceof HubError ? e.status : 500;
      return send(res, status, outcome(status, e instanceof HubError ? e.message : 'internal error'));
    }
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 8787);
  createHubServer().listen(port, '127.0.0.1', () => {
    console.log(`OpenChart mock hub (PDRE protocol, SANDBOX, synthetic data only) on http://127.0.0.1:${port}`);
  });
}
