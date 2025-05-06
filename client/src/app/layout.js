import { Inter } from "next/font/google";
import "./globals.css";
import Overlay from "./Overlay";
import { ThemeModeScript } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "@/context/productContext";

export const metadata = {
  title: "Colombia portatiles",
  description: "Colombia portatiles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <ThemeModeScript />
      </head>
      <body className="bg-mainDark-bg" >
        <Overlay>
          <Toaster position="top-right" />
          <ProductProvider>
            {children}
          </ProductProvider>
        </Overlay>
      </body>
    </html>
  );
}
