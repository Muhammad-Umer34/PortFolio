import { Inter } from 'next/font/google';
import Footer from './components/footer';
import ScrollToTop from './components/helper/scroll-to-top';
import ClientComponents from './components/helper/client-components';
import Navbar from './components/navbar';
import { personalData } from '@/utils/data/personal-data';
import './css/card.scss';
import './css/globals.scss';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://muhammad-umer.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Muhammad Umer | Full-Stack Developer & AI Engineer',
    template: '%s | Muhammad Umer',
  },
  description: 'I am Muhammad Umer, a Full-Stack Developer and AI Engineer specializing in MERN stack, React Native, Python, and Machine Learning solutions.',
  keywords: [
    'Muhammad Umer',
    'Muhammad Umer Portfolio',
    'Muhammad Umer FAST NUCES',
    'Muhammad Umer Developer',
    'Muhammad Umer Software Developer',
    'Full Stack Developer Lahore',
    'MERN Stack Developer',
    'Machine Learning Engineer Pakistan',
    'AI Engineer',
    'React Native Developer',
    'LangChain LLM Developer'
  ],
  authors: [{ name: 'Muhammad Umer', url: siteUrl }],
  creator: 'Muhammad Umer',
  publisher: 'Muhammad Umer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Muhammad Umer | Full-Stack Developer & AI Engineer',
    description: 'Portfolio of Muhammad Umer - Full-Stack Developer & Machine Learning Engineer specializing in MERN stack, React Native, and AI application development.',
    url: siteUrl,
    siteName: 'Muhammad Umer Portfolio',
    images: [
      {
        url: '/image/umer_pf.jpg',
        width: 1200,
        height: 630,
        alt: 'Muhammad Umer - Software Developer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Umer | Full-Stack Developer & AI Engineer',
    description: 'Portfolio of Muhammad Umer - Full-Stack Developer & Machine Learning Engineer.',
    creator: '@Muhamma24871972',
    images: ['/image/umer_pf.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google692b60b6aad55a8b',
  },
  icons: {
    icon: '/image/pic.png',
    shortcut: '/image/pic.png',
    apple: '/image/pic.png',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Muhammad Umer',
    alternateName: ['Muhammad Umer Developer', 'Muhammad Umer FAST NUCES'],
    url: siteUrl,
    image: `${siteUrl}/image/umer_pf.jpg`,
    jobTitle: personalData.designation,
    worksFor: [
      {
        '@type': 'Organization',
        name: 'KICS, UET Lahore',
      },
      {
        '@type': 'Organization',
        name: 'DaFi Labs',
      },
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'FAST NUCES Lahore',
    },
    sameAs: [
      personalData.github,
      personalData.linkedIn,
      personalData.twitter,
      personalData.facebook,
      personalData.leetcode,
      personalData.stackOverflow,
    ],
    knowsAbout: [
      'Full Stack Development',
      'MERN Stack',
      'React',
      'React Native',
      'Next.js',
      'Python',
      'Machine Learning',
      'Artificial Intelligence',
      'Retrieval-Augmented Generation (RAG)',
      'LangChain',
      'LLM Applications',
      'PostgreSQL',
      'FastAPI'
    ],
    description: personalData.description,
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ClientComponents />
        <Navbar />
        <main className="min-h-screen relative mx-auto px-6 sm:px-12 lg:max-w-[70rem] xl:max-w-[76rem] 2xl:max-w-[92rem] text-white">
          {children}
        </main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}