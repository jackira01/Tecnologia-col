'use client';

import useDarkMode from '@/hooks/useDarkMode';
import { Button } from 'flowbite-react';
import { GoSun } from 'react-icons/go';
import { MdOutlineDarkMode } from 'react-icons/md';

const DarkModeButton = () => {
  const [theme, toggleTheme] = useDarkMode();
  return (
    <>
      <button
        type="button"
        className="m-1 p-1 rounded-sm text-mainLight-bg dark:text-mainDark-white "
        onClick={toggleTheme}
      >
        {theme === 'light' ? (
          <MdOutlineDarkMode size={35} />
        ) : (
          <GoSun size={35} />
        )}
      </button>
    </>
  );
};

export default DarkModeButton;
