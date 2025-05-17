import "./globals.css";
import { ProductProvider } from "@/context/productContext";
import { ThemeModeScript } from "flowbite-react";
import { Toaster } from "react-hot-toast";
import Overlay from "./Overlay";

export const metadata = {
	title: "Tecnologia col",
	description: "Tecnologia col",
	icons: {
		icon: "/mini_icon.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html lang="es">
			<head>
				<ThemeModeScript />
			</head>
			<body className="transition-colors duration-500 bg-mainLight-bg text-mainLight-text dark:bg-mainDark-bg dark:text-mainDark-text font-body">
				<Overlay>
					<Toaster position="top-right" />
					<ProductProvider>{children}</ProductProvider>
				</Overlay>
			</body>
		</html>
	);
}
