/**
 * Generates static public/sitemap.xml so the sitemap is always available.
 * Run: npm run generate-sitemap  (or node scripts/generate-sitemap.js)
 *
 * If you get 404 on live for /sitemap.xml, ensure Nginx proxies to Next.js:
 *   location / {
 *     proxy_pass http://127.0.0.1:3000;  # or your next start port
 *     proxy_http_version 1.1;
 *     proxy_set_header Host $host;
 *     proxy_set_header X-Real-IP $remote_addr;
 *     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 *     proxy_set_header X-Forwarded-Proto $scheme;
 *   }
 * Do not serve only static files for / so that /sitemap.xml and /robots.txt reach the app.
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://doriseinfalt.art';
const locales = ['sl', 'en'];

const staticPages = [
  { path: '/stenske-poslikave', priority: '0.9' },
  { path: '/delavnice', priority: '0.9' },
  { path: '/slike', priority: '0.8' },
  { path: '/izposoja', priority: '0.8' },
  { path: '/fotografija', priority: '0.7' },
  { path: '/galerija', priority: '0.7' },
  { path: '/o-meni', priority: '0.6' },
  { path: '/kontakt', priority: '0.8' },
];

const rentalsPath = path.join(__dirname, '..', 'data', 'rentals.json');
const rentalsData = JSON.parse(fs.readFileSync(rentalsPath, 'utf8'));
const activeRentals = (rentalsData.rentals || []).filter((r) => r.active !== false);

const now = new Date().toISOString().split('T')[0];

const urls = [];

// Homepages
locales.forEach((locale) => {
  urls.push({ loc: `${BASE_URL}/${locale}`, priority: '1.0', changefreq: 'weekly' });
});

// Static pages
locales.forEach((locale) => {
  staticPages.forEach((page) => {
    urls.push({
      loc: `${BASE_URL}/${locale}${page.path}`,
      priority: page.priority,
      changefreq: 'monthly',
    });
  });
});

// Rental detail pages
locales.forEach((locale) => {
  activeRentals.forEach((rental) => {
    urls.push({
      loc: `${BASE_URL}/${locale}/izposoja/${rental.id}`,
      priority: '0.7',
      changefreq: 'monthly',
    });
  });
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Written:', outPath);
