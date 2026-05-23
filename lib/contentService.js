import clientPromise from "./mongodb";
import { defaultSiteContent } from "./defaultContent";

export async function getSiteContent() {
  try {
    const client = await clientPromise;
    const doc = await client.db().collection("site_content").findOne({ key: "main" });
    return doc?.data || defaultSiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(data) {
  const client = await clientPromise;
  await client.db().collection("site_content").updateOne(
    { key: "main" },
    { $set: { key: "main", data, updatedAt: new Date() } },
    { upsert: true }
  );
}
