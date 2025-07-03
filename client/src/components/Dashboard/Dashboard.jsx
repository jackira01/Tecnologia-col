'use client';

import { TabItem, Tabs } from 'flowbite-react';

import { FaClipboardList } from 'react-icons/fa';
import { IoAnalytics } from 'react-icons/io5';
import { AnalyticsTab } from './TabsComponent/analitycs/AnalyticsTab';
import ProductsTab from './TabsComponent/products/ProductsTab';

export const Dashboard = () => {
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
