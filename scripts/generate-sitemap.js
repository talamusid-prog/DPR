import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mendapatkan __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
function getCurrentDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Fungsi untuk generate sitemap XML
function generateSitemap() {
  const baseUrl = 'https://www.Komunitas Lombok Pasangkayu.com';
  const currentDate = getCurrentDate();
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog', priority: '0.9', changefreq: 'weekly' },
    { url: '/portfolio', priority: '0.9', changefreq: 'weekly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' }
  ];

  // Service pages
  const servicePages = [
    { url: '/services/website-development', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/ecommerce', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/corporate-website', priority: '0.9', changefreq: 'monthly' }
  ];

  // Portfolio categories
  const portfolioCategories = [
    { url: '/portfolio/category/ecommerce', priority: '0.7', changefreq: 'monthly' },
    { url: '/portfolio/category/healthcare', priority: '0.7', changefreq: 'monthly' },
    { url: '/portfolio/category/food-beverage', priority: '0.7', changefreq: 'monthly' },
    { url: '/portfolio/category/construction', priority: '0.7', changefreq: 'monthly' },
    { url: '/portfolio/category/education', priority: '0.7', changefreq: 'monthly' },
    { url: '/portfolio/category/event-planning', priority: '0.7', changefreq: 'monthly' }
  ];

  // Blog posts (static untuk saat ini, bisa diambil dari database nanti)
  const blogPosts = [
    { url: '/blog/jasa-pembuatan-website-makassar-untuk-bisnis-personal-branding', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog/mengapa-website-responsive-penting-era-mobile', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog/perbedaan-website-statis-vs-dinamis', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog/tips-membuat-website-seo-friendly', priority: '0.8', changefreq: 'monthly' }
  ];

  // Portfolio items (static untuk saat ini, bisa diambil dari database nanti)
  const portfolioItems = [
    { url: '/portfolio/e-commerce-website', priority: '0.8', changefreq: 'monthly' },
    { url: '/portfolio/mobile-banking-app', priority: '0.8', changefreq: 'monthly' },
    { url: '/portfolio/company-profile-website', priority: '0.8', changefreq: 'monthly' },
    { url: '/portfolio/restaurant-management-system', priority: '0.8', changefreq: 'monthly' },
    { url: '/portfolio/task-management-app', priority: '0.8', changefreq: 'monthly' }
  ];

  // Gabungkan semua halaman
  const allPages = [
    ...staticPages,
    ...servicePages,
    ...portfolioCategories,
    ...blogPosts,
    ...portfolioItems
  ];

  // Generate XML content
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(page => {
    xmlContent += `  <url>\n`;
    xmlContent += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xmlContent += `    <lastmod>${currentDate}</lastmod>\n`;
    xmlContent += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xmlContent += `    <priority>${page.priority}</priority>\n`;
    xmlContent += `  </url>\n`;
  });

  xmlContent += '</urlset>';

  // Tulis ke file
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
  
  console.log('✅ Sitemap berhasil di-generate!');
  console.log(`📁 Lokasi: ${sitemapPath}`);
  console.log(`📊 Total halaman: ${allPages.length}`);
  console.log(`📅 Tanggal update: ${currentDate}`);
}

// Jalankan fungsi
generateSitemap();
