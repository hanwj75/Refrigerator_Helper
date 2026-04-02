const staticPaths = [
  "/",
  "/result",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

const recipePaths = [
  "/recipe/kimchi-fried-rice",
  "/recipe/tofu-doenjang-jjigae",
  "/recipe/egg-soy-rice",
  "/recipe/tuna-zucchini-jeon",
];

export const onRequestGet: PagesFunction = async ({ request }) => {
  const origin = new URL(request.url).origin;
  const now = new Date().toISOString();
  const allPaths = [...staticPaths, ...recipePaths];

  const urls = allPaths
    .map(
      (path) => `<url><loc>${origin}${path}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${path === "/" ? "1.0" : "0.7"}</priority></url>`,
    )
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=UTF-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
