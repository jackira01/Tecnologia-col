'use client';

import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
} from 'flowbite-react';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';
import { IoIosLogOut } from 'react-icons/io';
import DarkModeButton from './DarkModeButton/DarkModeButton';

export const NavbarComponent = () => {
  const router = useRouter();

  const { data: session } = useSession();

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
  ];

  return (
    <Navbar
      className="transition-colors duration-500 bg-[#0f1827] text-mainLight-bg dark:bg-mainDark-card dark:text-mainDark-text"
      fluid
    >
      <NavbarBrand as={Link} href="/">
        <Image
          width={150}
          height={50}
          src="/logo.png"
          alt="Logo"
        />
      </NavbarBrand>
      <div className="flex md:order-2">
        <DarkModeButton />

        {session?.user ? (
          <Button className="m-auto ml-4" onClick={() => signOut()}>
            <IoIosLogOut size={25} />
          </Button>
        ) : (
          <></>
        )}
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        {menuItems.map((item) => (
          <Link href={`/${item.href}`} key={item.key}>
            <p className="text-lg">{item.label}</p>
          </Link>
        ))}
        {session?.user.role === 'admin' && (
          <Link href="/dashboard">
            <p className="text-lg">Dashboard</p>
          </Link>
        )}
      </NavbarCollapse>
    </Navbar>
  );
};
