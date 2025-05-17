'use client';

import { Navbar } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { GiLaptop } from 'react-icons/gi';
import DarkModeButton from './DarkModeButton/DarkModeButton';
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
    <Navbar
      className="transition-colors duration-500 bg-mainLight-card"
      fluid
      rounded
    >
      <Navbar.Brand as={Link} href="/">
        <Image
          width={150}
          height={50}
          src="/mini_icon.png"
          className=""
          alt="Flowbite Logo"
        />
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
