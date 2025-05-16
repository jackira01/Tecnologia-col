'use client';

import { Navbar } from 'flowbite-react';
import Link from 'next/link';
import { GiLaptop } from 'react-icons/gi';
import DarkModeButton from './DarkModeButton/DarkModeButton';
import Image from 'next/image';
// import DarkModeButton from "./DarkModeButton/DarkModeButton";

export const NavbarComponent = () => {
	const menuItems = [
		{
			key: 1,
			label: 'catalogo',
			href: '',
		},
		{
			key: 2,

			label: 'contactanos',
			href: 'contactanos',
		},
		{
			key: 3,

			label: 'sobre nosotros',
			href: 'sobre-nosotros',
		},
		{
			key: 4,

			label: 'dashboard',
			href: 'dashboard',
		},
	];

	return (
		<Navbar className="transition-colors duration-500 bg-mainLight-card" fluid rounded>
			<Navbar.Brand as={Link} href="/">
				<Image
					width={50}
					height={50}
					src="https://flowbite.com/docs/images/logo.svg"
					className="mr-3 h-6 sm:h-9"
					alt="Flowbite Logo"
				/>
				<span className="self-center whitespace-nowrap text-xl font-semibold">
					Tecnologia COL
				</span>
			</Navbar.Brand>
			<Navbar.Toggle />
			<Navbar.Collapse>
				{menuItems.map((item) => (
					<Link href={`/${item.href}`} key={item.key}>
						<p className="text-lg">{item.label}</p>
					</Link>
				))}
			</Navbar.Collapse>
			<DarkModeButton />
		</Navbar>
	);
};
