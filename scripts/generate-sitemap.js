// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // npm i node-fetch@2 --save-dev if needed

const BASE_URL = "https://indexithub.com";
const PAGES_DIR = path.join(process.cwd(), 'src/pages');
const OUT_FILE = path.join(process.cwd(), 'public', 'sitemap.xml');

function isPageFile(name) {
  return name.endsWith('.js') || name.endsWith('.jsx') || name.endsWith('.ts') || name.endsWith('.tsx');
}

// ------------- Customize these fetchers for your API -------------
// They should return arrays of slugs/ids for dynamic routes.
async function fetchBlogs() {
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBase}/blogs`); // Adjust endpoint to yours
    if (!res.ok) return [];
    const list = await res.json();
    // adjust mapping to your blog object shape (id or slug)
    return list.map(b => (b.slug || b._id || b.id)).filter(Boolean);
  } catch (e) {
    console.warn('fetchBlogs failed:', e.message);
    return [];
  }
}

async function fetchCareers() {
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBase}/careers`); // Adjust endpoint to yours
    if (!res.ok) return [];
    const list = await res.json();
    return list.map(c => (c.slug || c._id || c.id)).filter(Boolean);
  } catch (e) {
    console.warn('fetchCareers failed:', e.message);
    return [];
  }
}

async function fetchServices() {
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBase}/services`); // Adjust endpoint to yours
    if (!res.ok) return [];
    const list = await res.json();
    return list.map(c => (c.slug || c._id || c.id)).filter(Boolean);
  } catch (e) {
    console.warn('fetchCareers failed:', e.message);
    return [];
  }
}
async function fetchProjects() {
  const apiBase = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${apiBase}/projects`); // Adjust endpoint to yours
    if (!res.ok) return [];
    const list = await res.json();
    return list.map(c => (c.slug || c._id || c.id)).filter(Boolean);
  } catch (e) {
    console.warn('fetchCareers failed:', e.message);
    return [];
  }
}
// -----------------------------------------------------------------

function scanPages(dir, excludeFolders = ['admin']) {
  let routes = [];

  if (!fs.existsSync(dir)) return routes;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (excludeFolders.includes(item)) continue;
      routes = routes.concat(scanPages(full, excludeFolders));
    } else if (stat.isFile() && isPageFile(item)) {
      // skip next.js special files
      if (item.startsWith('_')) continue;
      let rel = path.relative(PAGES_DIR, full).replace(/\\/g, '/');
      // remove extension
      rel = rel.replace(/\.(js|jsx|ts|tsx)$/, '');
      // convert index -> parent path
      rel = rel.replace(/\/index$/, '');
      if (rel === 'index') rel = '';
      const urlPath = '/' + rel;
      routes.push(urlPath === '/' ? '/' : urlPath.replace(/\/+/g, '/'));
    }
  }
  return routes;
}

function buildSitemapXml(urls) {
  const items = urls.map(u => {
    const loc = `${BASE_URL}${u}`;
    const lastmod = new Date().toISOString();
    return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
  </url>`;
  }).join('');
return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

async function generate() {
  // 1. static routes (scanned from src/pages, excluding admin)
  const staticRoutes = scanPages(PAGES_DIR);

  // 2. dynamic routes from API
  const blogs = await fetchBlogs();
  const careers = await fetchCareers();
  const services = await fetchServices();
  const projects = await fetchProjects();

  const dynamicRoutes = [
    ...blogs.map(s => `/blogs/${s}`),
    ...careers.map(s => `/careers/${s}`),
    ...services.map(s => `/services/${s}`),
    ...projects.map(s => `/projects/${s}`)
  ];

  // union, sort
  const all = Array.from(new Set([...staticRoutes, ...dynamicRoutes])).sort();

  // ensure public dir exists
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  // write file
  fs.writeFileSync(OUT_FILE, buildSitemapXml(all), 'utf-8');
  console.log('✅ sitemap written to', OUT_FILE);
  console.log('Total URLs:', all.length);
}

generate().catch(err => {
  console.error('Sitemap generation failed', err);
  process.exit(1);
});
