export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://muhammad-umer-portfolio-phi.vercel.app';

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '#about', priority: 0.9, changeFrequency: 'monthly' },
    { path: '#experience', priority: 0.9, changeFrequency: 'monthly' },
    { path: '#skills', priority: 0.8, changeFrequency: 'monthly' },
    { path: '#projects', priority: 0.9, changeFrequency: 'monthly' },
    { path: '#education', priority: 0.8, changeFrequency: 'monthly' },
    { path: '#contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.path.startsWith('/') ? route.path : `/${route.path}`}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
