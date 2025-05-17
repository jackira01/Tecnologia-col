// app/not-found.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        // Redirige a home después de 3 segundos (opcional)
        const timeout = setTimeout(() => {
            router.push('/');
        }, 3000); // 3000 ms = 3 seconds

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center h-screen text-mainLight-text dark:text-mainDark-text ">
            <h1 className="text-3xl font-bold ">Página no encontrada</h1>
            <p className="mt-4">Redireccionando al inicio...</p>
        </main>
    );
}
