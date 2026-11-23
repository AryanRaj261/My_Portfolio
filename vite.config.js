import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const configuredUrl = loadEnv(mode, process.cwd(), "VITE_").VITE_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "";
  const siteUrl = (configuredUrl || vercelUrl).replace(/\/$/, "");

  return {
    plugins: [
      react(),
      {
        name: "portfolio-site-metadata",
        transformIndexHtml(html) {
          if (!siteUrl) return html;
          const metadata = [
            '<link rel="canonical" href="' + siteUrl + '/" />',
            '<meta property="og:url" content="' + siteUrl + '/" />',
            '<meta property="og:image" content="' + siteUrl + '/og-cover.png" />',
            '<meta name="twitter:image" content="' + siteUrl + '/og-cover.png" />',
          ].join("\n    ");
          return html.replace("<!-- site-url -->", metadata);
        },
      },
    ],
  };
});
