import { getSalesSummary } from '@/services/products';
import { formatPrice } from '@/utils';
import { useEffect, useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { MdPriceChange } from 'react-icons/md';

export const AnalyticsTab = () => {
  const [summary, setSummary] = useState({ totalSoldOn: 0, totalBuy: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getSalesSummary();
      if (data) setSummary(data);
    };
    fetchSummary();
  }, []);

  return (
    <div className="grid grid-cols-2 w-[700px] gap-2 max-[500px]:grid-cols-1 px-3">
      <div className="group w-full rounded-lg bg-[#673ab7] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_#2196f3]">
        <p className="text-white text-2xl">{formatPrice(summary.totalBuy)}</p>
        <p className="text-white text-sm">Suma total de Compra</p>
        <MdPriceChange className="text-white text-3xl absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300" />
      </div>
      <div className="group w-full rounded-lg bg-[rgb(41,49,79)] p-5 transition relative duration-300 cursor-pointer hover:translate-y-[3px] hover:shadow-[0_-8px_0px_0px_rgb(244,67,54)]">
        <p className="text-white text-2xl">
          {formatPrice(summary.totalSoldOn)}
        </p>
        <p className="text-white text-sm">Suma Total de Ventas</p>
        <FaDollarSign className="text-white text-3xl absolute right-[10%] top-[50%] translate-y-[-50%] opacity-20 transition group-hover:scale-110 duration-300" />
      </div>
    </div>
  );
};
