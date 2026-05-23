import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    const adminUsers = await client.db().collection("admin_users").countDocuments();

    return res.status(200).json({
      ok: true,
      message: `اتصال دیتابیس برقرار است. تعداد ادمین‌ها: ${adminUsers}`,
    });
  } catch (error) {
    console.error("DB check error:", error);
    return res.status(500).json({
      ok: false,
      message: "اتصال دیتابیس برقرار نیست. MONGODB_URI و دسترسی شبکه را بررسی کنید.",
    });
  }
}
