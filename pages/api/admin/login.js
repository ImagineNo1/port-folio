import crypto from "crypto";
import { getMongoClient } from "../../../lib/mongodb";
import { setAuthCookie, signAdminToken } from "../../../lib/auth";

function verifyPassword(password, full) {
  const [salt, original] = full.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(original));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  const client = await getMongoClient();
  if (!client) return res.status(500).json({ message: "MongoDB is not configured" });
  const user = await client.db().collection("admin_users").findOne({ username });
  if (!user || !verifyPassword(password, user.passwordHash)) return res.status(401).json({ message: "Invalid credentials" });
  setAuthCookie(res, signAdminToken({ username }));
  res.status(200).json({ ok: true });
}
