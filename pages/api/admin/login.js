import crypto from "crypto";
import clientPromise from "../../../lib/mongodb";
import { setAuthCookie, signAdminToken } from "../../../lib/auth";

function verifyPassword(password, full) {
  const [salt, original] = full.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(original));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { username, password } = req.body || {};
    const client = await clientPromise;
    const user = await client.db().collection("admin_users").findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "ادمینی ساخته نشده است", code: "NO_ADMIN" });
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "نام کاربری یا رمز عبور اشتباه است" });
    }

    setAuthCookie(res, signAdminToken({ username }));
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ message: "خطا در اتصال به دیتابیس یا سرور" });
  }
}
