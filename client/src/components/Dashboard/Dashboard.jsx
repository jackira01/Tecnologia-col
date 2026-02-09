'use client';

import { TabItem, Tabs, Button } from 'flowbite-react';
import { useContext } from 'react';
import { ProductContext } from '@/context/productContext';
import { IoAddCircleOutline, IoAnalytics, IoSettings, IoPersonAdd } from 'react-icons/io5';
import { FaClipboardList } from 'react-icons/fa';
import { MdAttachMoney } from 'react-icons/md';
import { AnalyticsTab } from './TabsComponent/analitycs/AnalyticsTab';
import ProductsTab from './TabsComponent/products/ProductsTab';
import AttributesTab from './TabsComponent/attributes/AttributesTab';
import FinanzasTab from './TabsComponent/finanzas/FinanzasTab';
import LeadsTab from './TabsComponent/leads/LeadsTab';

export const Dashboard = () => {
  const { setOpenModal } = useContext(ProductContext);

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10 p-2">
        <Button onClick={() => setOpenModal(true)} size="sm">
          <IoAddCircleOutline className="mr-2 h-5 w-5" />
          Crear Producto
        </Button>
      </div>
      <Tabs aria-label="Default tabs" variant="default">
        <TabItem active title="Portátiles" icon={FaClipboardList}>
          <ProductsTab />
        </TabItem>
        <TabItem title="Estadísticas" icon={IoAnalytics}>
          <AnalyticsTab />
        </TabItem>
        <TabItem title="Finanzas" icon={MdAttachMoney}>
          <FinanzasTab />
        </TabItem>
        <TabItem title="Clientes CRM" icon={IoPersonAdd}>
          <LeadsTab />
        </TabItem>
        <TabItem title="Configuración" icon={IoSettings}>
          <AttributesTab />
        </TabItem>
      </Tabs>
    </div>
  );
};
