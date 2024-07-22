"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";

export const NavbarComponent = () => {
	const menuItems = ["catalogo", "Contactanos", "Quienes Somos"];
	return (
		<Navbar className="bg-[#222831]" fluid rounded>
			<Navbar.Brand as={Link} href="/catalogo">
				<img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Logo" />
				<span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
					Tecnologia COL
				</span>
			</Navbar.Brand>
			<Navbar.Toggle />
			<Navbar.Collapse>
				{menuItems.map((item) => (
					<Navbar.Link href={`/${item}`} key={item}>
						{item}
					</Navbar.Link>
				))}
			</Navbar.Collapse>
		</Navbar>
	);
};
