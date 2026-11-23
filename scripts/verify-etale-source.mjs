import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const expected = {
  "src/shaders/aura-weekly-november-2026/EtaleNumeralPlates.tsx": "e42eef6d6f74c65e7d0bab36bc055b91e9310f9897f63919c8db7238767d7ae5",
  "src/shaders/aura-weekly-november-2026/AuraWeeklyDocument.tsx": "7917365ea5b4a0c1fa47cc4908894f94dd538b469215439108f040a4f397d0c7",
  "src/shaders/threeui.css": "efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf",
  "public/sections/etale-numeral-plates.html": "5bd30920a04b9f741cc413b65edf13756c00380de1c34eab9e0a2212cc77578a",
  "public/landing-pages/week-2026-11-03/04c011e251aedd8f07cd4e098c91237e.webp": "04c011e251aedd8f07cd4e098c91237e4d0515d7d1c0fef6ec09bd2fd2672a3d",
  "public/landing-pages/week-2026-11-03/1a8f2d83ba3a6cc02a57d29e83a9cdbc.webm": "1a8f2d83ba3a6cc02a57d29e83a9cdbcba2f915d6b986ec70fafa474ed7c6392",
  "public/landing-pages/week-2026-11-03/23840067d1dda8749b421a47c3e56205.woff2": "23840067d1dda8749b421a47c3e56205fa78c0d58d40baf3cc4d625fbe667f36",
  "public/landing-pages/week-2026-11-03/34da38f3754ce052886ef20e6a41d6c2.webm": "34da38f3754ce052886ef20e6a41d6c258dbf0d75c7c9e65b043f643e4341354",
  "public/landing-pages/week-2026-11-03/3fac62d55a70c44bce64ff97db280b6b.woff2": "3fac62d55a70c44bce64ff97db280b6b1c346575ea4c26c99b40eaf2367511b5",
  "public/landing-pages/week-2026-11-03/71d669c668ad1f01d618dac7dcf574b1.woff2": "71d669c668ad1f01d618dac7dcf574b17bf5f5bd6286a3bbe12766f2943b77af",
  "public/landing-pages/week-2026-11-03/72310fca0f03a2866fe8b7bd6a6b3cfe.webp": "72310fca0f03a2866fe8b7bd6a6b3cfe79185dfb39dc20f36234d962da7ad641",
  "public/landing-pages/week-2026-11-03/8db18268701ed3d6b37b49fb0dde55e1.woff2": "8db18268701ed3d6b37b49fb0dde55e145272c68a339fa0291d2fa2aca901dd6",
  "public/landing-pages/week-2026-11-03/9b6f5ff45b278c744b5f379a2c4ecbaf.woff2": "9b6f5ff45b278c744b5f379a2c4ecbaf858a842b8eaf82ac8d21b699ca16c608",
  "public/landing-pages/week-2026-11-03/a79a4a1704f59173e813129afea162ae.jpg": "a79a4a1704f59173e813129afea162ae6b5c4bba0e64486c02d0c3df41f7562f",
  "public/landing-pages/week-2026-11-03/ee57293b41f7fc57f4013dcc66ca5a1d.webm": "ee57293b41f7fc57f4013dcc66ca5a1dc83d418a0e28072bd5f84e7a0e82a4cd",
  "public/landing-pages/week-2026-11-03/fe710b15e2acd1f30159cec96b10c345.woff2": "fe710b15e2acd1f30159cec96b10c3455a32d27104c29d4027c5465d81fc11fe",
};

const mismatches = Object.entries(expected).flatMap(([file, expectedHash]) => {
  const actualHash = createHash("sha256").update(readFileSync(resolve(file))).digest("hex");
  return actualHash === expectedHash ? [] : [`${file}: expected ${expectedHash}, received ${actualHash}`];
});

if (mismatches.length) {
  console.error(mismatches.join("\n"));
  process.exit(1);
}

console.log(`Verified ${Object.keys(expected).length} Etale source files and assets.`);
