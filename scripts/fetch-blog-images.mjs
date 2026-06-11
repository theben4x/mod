// One-off: fetch freely-licensed hero images (Wikimedia Commons) for blog posts.
// Self-hosts a width-limited copy under public/blog/<slug>.jpg and prints the
// attribution metadata (author + license + source) to paste into data/blog.ts.
// Network here sits behind a corporate SSL proxy → disable TLS verify for this fetch only.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "blog");
fs.mkdirSync(OUT, { recursive: true });

// slug → the chosen Wikimedia originalimage URL (picked by inspection)
const PICKS = {
  "rtx-5090-vs-rtx-4090": "https://upload.wikimedia.org/wikipedia/commons/d/df/Leistungsanalyse_NVIDIA_GeForce_RTX_4090_%28Geekerwan%29_02_cropped.jpg",
  "how-much-vram-2026": "https://upload.wikimedia.org/wikipedia/commons/a/ae/AMD_RX_6900XT_.jpg",
  "ryzen-x3d-vs-intel-gaming": "https://upload.wikimedia.org/wikipedia/commons/9/99/Ryzen3pro2100ge-ph-gerald.jpg",
  "pcie-5-ssd-worth-it": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Intel_512G_M2_Solid_State_Drive.jpg/3840px-Intel_512G_M2_Solid_State_Drive.jpg",
  "how-many-watts-psu": "https://upload.wikimedia.org/wikipedia/commons/6/62/PSU-Open1.jpg",
};

// derive the Commons File: title from an upload.wikimedia URL (handles /thumb/ form)
function fileTitle(url) {
  const u = decodeURIComponent(url);
  const parts = u.split("/");
  const i = parts.indexOf("thumb");
  // for /thumb/.../<name>/<size>-<name> the real name is the segment before the last
  const name = i >= 0 ? parts[parts.length - 2] : parts[parts.length - 1];
  return "File:" + name;
}

function stripHtml(s) {
  return (s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

// Wikimedia requires a descriptive User-Agent or it returns an error page.
const HEADERS = { "User-Agent": "tested-hardware-site/1.0 (blog hero fetch; contact: gavrielbentouchama@gmail.com)" };
const getJson = async (u) => (await fetch(u, { headers: HEADERS })).json();
async function download(u) {
  const buf = Buffer.from(await (await fetch(u, { headers: HEADERS })).arrayBuffer());
  // validate JPEG magic bytes (FF D8 FF)
  if (!(buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff)) {
    throw new Error(`not a JPEG (${buf.length}B): ${buf.slice(0, 40).toString("utf8")}`);
  }
  return buf;
}

const results = {};
for (const [slug, url] of Object.entries(PICKS)) {
  const title = fileTitle(url);
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo" +
    "&iiprop=url|extmetadata&iiurlwidth=1280&titles=" + encodeURIComponent(title);
  const j = await getJson(api);
  const pages = j.query.pages;
  const page = pages[Object.keys(pages)[0]];
  const ii = page.imageinfo[0];
  const ex = ii.extmetadata || {};
  const thumb = ii.thumburl || url;
  const author = stripHtml(ex.Artist && ex.Artist.value) || "Wikimedia Commons";
  const license = stripHtml(ex.LicenseShortName && ex.LicenseShortName.value) || "";
  const source = ii.descriptionurl || url;

  // download the width-limited copy (validated)
  const buf = await download(thumb);
  const dest = path.join(OUT, slug + ".jpg");
  fs.writeFileSync(dest, buf);

  results[slug] = {
    cover: `/blog/${slug}.jpg`,
    bytes: buf.length,
    credit: license ? `${author} · ${license}` : author,
    source,
  };
  console.log(`✓ ${slug}  (${(buf.length / 1024).toFixed(0)} KB)  ${results[slug].credit}`);
}

fs.writeFileSync(path.join(OUT, "_credits.json"), JSON.stringify(results, null, 2));
console.log("\n--- paste into data/blog.ts (cover + coverCredit) ---");
console.log(JSON.stringify(results, null, 2));
