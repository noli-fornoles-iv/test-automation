import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";
const RAW = ".cursor/knowledge-base/_mcp-raw";
const OUT = ".cursor/knowledge-base/mcp-tabs";
mkdirSync(OUT, { recursive: true });
function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
for (const f of readdirSync(RAW).filter((x) => x.endsWith(".json"))) {
  const raw = JSON.parse(readFileSync(join(RAW, f), "utf8"));
  let name = raw.name;
  let values = raw.values;
  if (!values && raw.valueRanges?.[0]) {
    name = name || raw.valueRanges[0].range.replace(/!.*$/, "");
    values = raw.valueRanges[0].values || [];
  }
  if (!name || !Array.isArray(values)) throw new Error(f + " bad shape");
  const out = join(OUT, slug(name) + ".json");
  writeFileSync(out, JSON.stringify({ name, values }));
  console.log("Wrote", out, values.length);
}
