import { getMongoClient } from "./mongodb";
import { defaultSiteContent } from "./defaultContent";

export async function getSiteContent() {
  try {
    const client = await getMongoClient();
    if (!client) return defaultSiteContent;
    const doc = await client.db().collection("site_content").findOne({ key: "main" });
    return doc?.data || defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(data) {
  const client = await getMongoClient();
  if (!client) throw new Error("MongoDB is not configured");
  await client.db().collection("site_content").updateOne(
    { key: "main" },
    { $set: { key: "main", data, updatedAt: new Date() } },
    { upsert: true }
  );
}
