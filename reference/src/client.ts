// Tiny OpenChart (PDRE) client for the mock hub. Apache-2.0. Experimental.
type Json = Record<string, any>;

export class PdreClient {
  base: string;
  org?: string;
  constructor(base: string, org?: string) {
    this.base = base.replace(/\/$/, '');
    this.org = org;
  }
  async call(method: string, path: string, data?: unknown): Promise<{ status: number; body: Json }> {
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (this.org) headers['x-pdre-org'] = this.org;
    const res = await fetch(this.base + path, { method, headers, body: data === undefined ? undefined : JSON.stringify(data) });
    return { status: res.status, body: await res.json() };
  }
  searchDirectory(name: string) { return this.call('GET', `/directory/Organization?name=${encodeURIComponent(name)}`); }
  requestRecords(input: Json) { return this.call('POST', '/requests', input); }
  getRequest(id: string) { return this.call('GET', `/requests/${id}`); }
  consent(id: string, input: Json) { return this.call('POST', `/requests/${id}/consent`, input); }
  revoke(id: string, input: Json) { return this.call('POST', `/requests/${id}/revoke`, input); }
  release(id: string, input: Json) { return this.call('POST', `/requests/${id}/release`, input); }
  decline(id: string, reason: string) { return this.call('POST', `/requests/${id}/decline`, { reason }); }
  getTransfer(id: string) { return this.call('GET', `/transfers/${id}`); }
  ack(id: string, status: string) { return this.call('POST', `/transfers/${id}/ack`, { status }); }
  audit(requestId: string) { return this.call('GET', `/audit?request=${requestId}`); }
}
