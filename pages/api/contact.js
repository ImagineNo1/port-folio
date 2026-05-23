import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await clientPromise;
    await client.db().collection("contacts").insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    return res.status(201).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error?.message || "Failed to save contact" });
  }
}
