/**
 * Announce every URL in sitemap.xml to the IndexNow engines (Bing, Yandex,
 * Seznam, Naver). Google does not participate — its sitemap goes through
 * Search Console, which has no API path without OAuth as a verified owner.
 *
 * Run after a deploy, never before: submitting a URL that still 404s is how a
 * host earns a reputation for lying to crawlers.
 *
 *   node scripts/ping-indexnow.mjs
 *
 * The key is public by design. It lives in indexnow.key and is served from
 * public/<key>.txt to prove ownership; both are committed so they cannot drift.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const HOST = "sortinghat.ai";

const key = fs.readFileSync(path.join(ROOT, "indexnow.key"), "utf8").trim();
if (!fs.existsSync(path.join(ROOT, "public", `${key}.txt`))) {
  throw new Error(`public/${key}.txt is missing — the engines will reject the key`);
}

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("sitemap.xml returned no URLs");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  }),
  signal: AbortSignal.timeout(30_000),
});

// 200 and 202 both mean accepted; 422 means the key did not verify.
console.log(`indexnow: ${res.status} for ${urlList.length} urls`);
if (res.status >= 400) process.exitCode = 1;
