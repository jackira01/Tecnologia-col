'use client';

import { Spinner, TabItem, Tabs } from 'flowbite-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { IoAnalytics } from 'react-icons/io5';
import { AnalyticsTab } from './TabsComponent/analitycs/AnalyticsTab';
import ProductsTab from './TabsComponent/products/ProductsTab';

export const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/');
    }
  }, [session, router, status]);

  // Loading state durante autenticación
  if (status === 'loading') {
    return (
      <div className="flex justify-center p-4">
        <Spinner />
      </div>
    );
  }

  return (
    <Tabs aria-label="Default tabs" variant="default">
      <TabItem active title="Portatiles" icon={FaClipboardList}>
        <ProductsTab />
      </TabItem>
      <TabItem title="Estadisticas" icon={IoAnalytics}>
        <AnalyticsTab />
      </TabItem>
    </Tabs>
  );
};
