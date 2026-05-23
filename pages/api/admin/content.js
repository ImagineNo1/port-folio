import { getSiteContent, saveSiteContent } from "../../../lib/contentService";
import { requireAdmin } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "GET") return res.status(200).json(await getSiteContent());
  const session = requireAdmin(req);
  if (!session) return res.status(401).json({ message: "Unauthorized" });
  if (req.method === "PUT") {
    await saveSiteContent(req.body);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}
