import { getCorsHeaders } from "./cors.ts";

export function getRequestId(req: Request): string {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function json(body: unknown, status = 200, req?: Request, extraHeaders?: HeadersInit): Response {
  const headers = new Headers({
    ...getCorsHeaders(req),
    "Content-Type": "application/json",
  });
  if (req) {
    headers.set("x-request-id", getRequestId(req));
  }
  if (extraHeaders) {
    new Headers(extraHeaders).forEach((v, k) => headers.set(k, v));
  }
  return new Response(JSON.stringify(body), { status, headers });
}

export function badRequest(message = "Bad request", req?: Request, details?: unknown): Response {
  return json({ error: message, code: "22023", details }, 400, req);
}

export function unauthorized(message = "Unauthorized", req?: Request): Response {
  return json({ error: message, code: "28000" }, 401, req);
}

export function forbidden(message = "Forbidden", req?: Request): Response {
  return json({ error: message, code: "42501" }, 403, req);
}

export function notFound(message = "Not found", req?: Request): Response {
  return json({ error: message, code: "P0404" }, 404, req);
}

export function serverError(err: unknown, req?: Request): Response {
  const reqId = req ? getRequestId(req) : "unknown";
  console.error(`[Internal Error] [request-id: ${reqId}]`, err);
  return json(
    {
      error: "An internal server error occurred. Please contact support with the request ID.",
      code: "50000",
      requestId: reqId,
    },
    500,
    req
  );
}
