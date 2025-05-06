"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { GiLaptop } from "react-icons/gi";
import DarkModeButton from "./DarkModeButton/DarkModeButton";
// import DarkModeButton from "./DarkModeButton/DarkModeButton";

export const NavbarComponent = () => {
	const menuItems = [
		{
			key: 1,
			label: "catalogo",
			href: "catalogo",
		},
		{
			key: 2,

			label: "contactanos",
			href: "contactanos",
		},
		{
			key: 3,

			label: "sobre nosotros",
			href: "sobre-nosotros",
		},
		{
			key: 4,

			label: "dashboard",
			href: "dashboard",
		},
	];

	return (
		<Navbar className="bg-[#31363F] text-[#EEEEEE]" fluid rounded>
			<Navbar.Brand as={Link} href="/catalogo">
				<GiLaptop className="mx-2" size={20} />
				<span className="self-center whitespace-nowrap text-xl font-semibold">
					Tecnologia COL
				</span>
			</Navbar.Brand>
			<Navbar.Toggle />
			<Navbar.Collapse>
				{menuItems.map((item) => (
					<Link href={`/${item.href}`} key={item.key}>
						<p className="text-[#EEEEEE] text-lg">{item.label}</p>
					</Link>
				))}
			</Navbar.Collapse>
			<DarkModeButton/>
		</Navbar>
	);
};
