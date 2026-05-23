import crypto from "crypto";
import { getMongoClient } from "../../../lib/mongodb";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ message: "username/password required" });

  const client = await getMongoClient();
  if (!client) return res.status(500).json({ message: "MongoDB is not configured" });
  const users = client.db().collection("admin_users");
  const count = await users.countDocuments();
  if (count > 0) return res.status(400).json({ message: "Admin already exists" });

  await users.insertOne({ username, passwordHash: hashPassword(password), createdAt: new Date() });
  return res.status(201).json({ ok: true });
}
