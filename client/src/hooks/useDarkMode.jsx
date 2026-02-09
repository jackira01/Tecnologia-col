'use client';

import { useEffect, useState } from 'react';

const useDarkMode = () => {
  // Inicializar siempre con 'dark' para evitar errores de hidratación
  // El valor real se establecerá en el useEffect
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      if (storedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      setTheme(storedTheme);
    } else {
      // Si no hay tema guardado, usar 'dark' por defecto
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return [theme, toggleTheme];
};

export default useDarkMode;
