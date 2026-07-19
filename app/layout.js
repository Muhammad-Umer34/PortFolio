// app/layout.js
import { Inter } from 'next/font/google';
import Footer from './components/footer';
import ScrollToTop from './components/helper/scroll-to-top';
import ClientComponents from './components/helper/client-components';
import Navbar from './components/navbar';
import './css/card.scss';
import './css/globals.scss';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Portfolio of Muhammad Umer - Software Developer',
  description: 'I am Muhammad Umer, a Full-Stack Developer specializing in MERN stack and React Native, with expertise in machine learning and AI-powered application development.',
  icons: {
    icon: '/image/pic.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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