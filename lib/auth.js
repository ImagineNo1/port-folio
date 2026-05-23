import jwt from "jsonwebtoken";

const COOKIE_NAME = "admin_token";

export function signAdminToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}

export function verifyAdminToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
}

export function parseCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(header.split(";").map((c) => c.trim().split("=")).filter((x) => x[0]));
}

export function setAuthCookie(res, token) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
}

export function clearAuthCookie(res) {
  res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
}

export function requireAdmin(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  try { return verifyAdminToken(token); } catch { return null; }
}
