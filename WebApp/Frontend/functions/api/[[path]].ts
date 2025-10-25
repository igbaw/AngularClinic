export interface Env { BACKEND_URL: string }

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  const backend = (env.BACKEND_URL || '').replace(/\/$/, '');
  if (!backend) {
    return new Response('Missing BACKEND_URL', { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const target = backend + incomingUrl.pathname + incomingUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-host', incomingUrl.host);
  headers.set('x-forwarded-proto', 'https');

  const init: RequestInit = { method: request.method, headers };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const resp = await fetch(target, init);
  const resHeaders = new Headers(resp.headers);
  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: resHeaders,
  });
}