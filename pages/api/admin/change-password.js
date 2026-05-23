import crypto from "crypto";
import { getMongoClient } from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/auth";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
function verifyPassword(password, full) {
  const [salt, original] = full.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(original));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const session = requireAdmin(req);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  const { currentPassword, newPassword } = req.body || {};
  const client = await getMongoClient();
  if (!client) return res.status(500).json({ message: "MongoDB is not configured" });
  const users = client.db().collection("admin_users");
  const user = await users.findOne({ username: session.username });
  if (!user || !verifyPassword(currentPassword, user.passwordHash)) return res.status(400).json({ message: "Current password is wrong" });
  await users.updateOne({ _id: user._id }, { $set: { passwordHash: hashPassword(newPassword) } });
  res.status(200).json({ ok: true });
}
