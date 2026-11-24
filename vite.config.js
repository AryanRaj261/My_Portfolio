import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const DEFAULT_SITE_URL = "https://my-portfolio-jade-nine-22.vercel.app";

function normalizeSiteUrl(url) {
  return (url || DEFAULT_SITE_URL).replace(/\/$/, "");
}

function createSeoPlugin(siteUrl) {
  const canonicalUrl = `${siteUrl}/`;
  const socialImage = `${siteUrl}/og-cover.png`;
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Aryan Raj",
    url: canonicalUrl,
    email: "mailto:aryanraj9011@gmail.com",
    jobTitle: "Frontend Developer",
    sameAs: ["https://github.com/AryanRaj261", "https://www.linkedin.com/in/aryan-raj-087a852aa/"],
    knowsAbout: ["React", "JavaScript", "Responsive Web Design", "Frontend Development"],
  });

  return {
    name: "portfolio-site-metadata",
    transformIndexHtml(html) {
      const metadata = [
        `<link rel="canonical" href="${canonicalUrl}" />`,
        `<meta property="og:url" content="${canonicalUrl}" />`,
        `<meta property="og:image" content="${socialImage}" />`,
        `<meta name="twitter:image" content="${socialImage}" />`,
      ].join("\n    ");
      return html
        .replace("<!-- site-url -->", metadata)
        .replace("<!-- site-schema -->", `<script type="application/ld+json">${schema}</script>`);
    },
    closeBundle() {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${canonicalUrl}</loc>\n  </url>\n</urlset>\n`;
      const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
      writeFileSync(resolve("dist", "sitemap.xml"), sitemap);
      writeFileSync(resolve("dist", "robots.txt"), robots);
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const configuredUrl = loadEnv(mode, process.cwd(), "VITE_").VITE_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";
  const siteUrl = normalizeSiteUrl(configuredUrl || vercelUrl);

  return {
    plugins: [react(), createSeoPlugin(siteUrl)],
  };
});
