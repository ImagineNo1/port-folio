import clientPromise from "../../../lib/mongodb";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  const session = requireAdmin(req);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  if (req.method !== "GET") return res.status(405).end();

  const client = await clientPromise;
  const items = await client.db().collection("contacts").find({}).sort({ createdAt: -1 }).toArray();
  return res.status(200).json(items);
}
