// server-side helpers (Node/Web Crypto) — no Math.random
export function hashToken(token: string): string {
  // lightweight server hash placeholder — replace with HMAC-SHA256 with secret in production
  // kept client-safe for fallback
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
}

export function maskEmail(email: string) {
  const [u, d] = email.split("@");
  return `${u.slice(0, 2)}***@${d}`;
}
