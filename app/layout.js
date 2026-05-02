import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import AIChat from '@/components/AIChat';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata = {
  title: 'Reflex — Mental Wellness Platform',
  description:
    'Reflex is a data-driven wellness ecosystem designed to help you track and improve your mental health through guided therapy, mindfulness, and professional consultations.',
  keywords: 'mental health, wellness, therapy, mindfulness, depression, psychiatrist, yoga, reading therapy',
  authors: [{ name: 'Dipto Acharjee' }],
  metadataBase: new URL('https://reflex-wellness.vercel.app'), // Placeholder base URL
  openGraph: {
    title: 'Reflex — Your Mental Wellness Partner',
    description: 'Track your wellness journey, consult with experts, and access premium mental health resources.',
    url: '/',
    siteName: 'Reflex',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Reflex Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reflex — Mental Wellness Platform',
    description: 'Transform your mental well-being with data-driven insights and professional support.',
    images: ['/logo.png'],
  },
  icons: {
    icon: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png' },
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-dark-900 text-white font-sans antialiased">
        <AuthProvider>
          {children}
          <AIChat />
        </AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1528',
              color: '#fff',
              border: '1px solid rgba(14,165,233,0.3)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            },
            success: {
              iconTheme: { primary: '#14b8a6', secondary: '#0d1528' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#0d1528' },
            },
          }}
        />
      </body>
    </html>
  );
}
