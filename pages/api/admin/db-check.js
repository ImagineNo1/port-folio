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
      details: {
        hasMongoUri: Boolean(process.env.MONGODB_URI),
        dbName: client.db().databaseName,
        adminUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "اتصال دیتابیس برقرار نیست.",
      error: {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
        cause: error?.cause || null,
      },
      details: {
        hasMongoUri: Boolean(process.env.MONGODB_URI),
      },
    });
  }
}
