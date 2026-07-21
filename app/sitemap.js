export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://muhammad-umer-portfolio-phi.vercel.app';

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
