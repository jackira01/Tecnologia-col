import { Inter } from "next/font/google";
import "./globals.css";
import Overlay from "./Overlay";
import { ThemeModeScript } from "flowbite-react";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Colombia portatiles",
  description: "Colombia portatiles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        <ThemeModeScript />
      </head>
      <body className={inter.className}>
      <Overlay>
            {children}
          </Overlay>

      </body>
    </html>
  );
}
