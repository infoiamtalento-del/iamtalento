// CORS headers with origin allow-list and Vary: Origin header.
export function getCorsHeaders(req?: Request): Record<string, string> {
  const allowedOriginsEnv = Deno.env.get("ALLOWED_ORIGINS");
  const requestOrigin = req?.headers.get("origin") ?? "";

  let allowedOrigin = "*";
  if (allowedOriginsEnv) {
    const list = allowedOriginsEnv.split(",").map((s) => s.trim().toLowerCase());
    if (requestOrigin && list.includes(requestOrigin.toLowerCase())) {
      allowedOrigin = requestOrigin;
    } else if (list.length > 0) {
      allowedOrigin = list[0];
    }
  }

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type, x-request-id, x-razorpay-signature, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function handleCors(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }
  return null;
}
