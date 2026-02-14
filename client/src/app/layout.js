import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { ProductProvider } from '@/context/productContext';
import { UserProvider } from '@/context/userContext';
import { ThemeModeScript } from 'flowbite-react';
import { Toaster } from 'react-hot-toast';
import Overlay from './Overlay';
import { Providers } from './providers'; // Asegúrate que este sea correcto

export const metadata = {
  title: {
    template: '%s | Tecnologia Col',
    default: 'Tecnologia Col - Tu tienda de tecnología',
  },
  description: 'Encuentra los mejores equipos tecnológicos en Colombia. Laptops, celulares y accesorios al mejor precio.',
  icons: {
    icon: '/mini_icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://tecnologiacol.com',
    siteName: 'Tecnologia Col',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body className="transition-colors duration-500 bg-mainLight-bg text-mainLight-text dark:bg-mainDark-bg dark:text-mainDark-text font-body">
        <Providers>
          <Overlay>
            <Toaster position="top-right" />
            <ProductProvider>
              <UserProvider>{children}</UserProvider>
            </ProductProvider>
          </Overlay>
        </Providers>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
    </html>
  );
}
