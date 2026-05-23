import crypto from "crypto";
import clientPromise from "../../../lib/mongodb";
import { setAuthCookie, signAdminToken } from "../../../lib/auth";

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, full) {
  const [salt, original] = full.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(original));
}

async function ensureDefaultAdmin(users) {
  const count = await users.countDocuments();
  if (count === 0) {
    await users.insertOne({ username: "admin", passwordHash: hashPassword("admin"), createdAt: new Date() });
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { username, password } = req.body || {};
    const client = await clientPromise;
    const users = client.db().collection("admin_users");

    await ensureDefaultAdmin(users);

    const user = await users.findOne({ username });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است" });
    }

    setAuthCookie(res, signAdminToken({ username }));
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "خطا در اتصال به دیتابیس یا سرور" });
  }
}
