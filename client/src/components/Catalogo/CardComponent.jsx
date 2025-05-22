import { ProductContext } from '@/context/productContext';
import { formatPrice } from '@/utils';
import { Button, Card } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { BsDeviceHdd } from 'react-icons/bs';
import { HiMiniCpuChip } from 'react-icons/hi2';
import { RiRam2Line } from 'react-icons/ri';

export const CardComponent = ({ data }) => {
  const { setCurrentProduct } = useContext(ProductContext);

  const handleClickDetails = async () => {
    await setCurrentProduct(data);
  };

  const SpecItem = ({ icon, text }) => (
    <div className="flex items-center">
      <span className="mr-2 text-gray-600 dark:text-gray-400">{icon}</span>
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
  return (
    <Card
      className="transition-colors duration-500 h-full w-full min-w-[250px] max-w-[300px] border-none text-mainLight-text dark:bg-mainDark-card dark:text-mainDark-text shadow-md"
      /* imgSrc={data.image_URL[0]}
      imgAlt={data.name} */
    >
      <Image
        src={data.image_URL[0]}
        alt={data.name}
        width={500}
        height={200}
        className="w-full h-[200px] object-cover rounded-t-lg"
      />
      <div className="flex h-full flex-col justify-between gap-0">
        <>
          {data.disponibility === 'vendido' ? (
            <span className="text-red-500 font-bold">Vendido</span>
          ) : (
            <span className="text-green-500 font-bold">Disponible</span>
          )}
          <br />
          {data.specification.condition === 'nuevo' ? (
            <span className="text-blue-500 font-bold">Nuevo</span>
          ) : (
            <span className="text-blue-500 font-bold">Usado</span>
          )}
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white ">
            {data.name}
          </h5>
          <p className="mb-3 font-bold text-gray-700 dark:text-gray-300">
            {formatPrice(data.price.sale)}
          </p>

          {/* Tus especificaciones (iconos + texto) */}
          <div className="space-y-2">
            <SpecItem
              icon={<RiRam2Line />}
              text={`RAM ${data.specification.ram.size} ${data.specification.ram.ram_type}`}
            />
            <SpecItem
              icon={<BsDeviceHdd />}
              text={`Almacenamiento ${data.specification.storage.size} ${data.specification.storage.storage_type}`}
            />
            <SpecItem
              icon={<HiMiniCpuChip />}
              text={`${data.specification.processor.brand} ${data.specification.processor.model}`}
            />
          </div>
        </>

        <Link
          href={`/${data._id}`}
          onClick={() => {
            handleClickDetails();
          }}
          className="px-3 py-2 text-center text-sm font-medium mt-4 inline-flex items-center justify-center rounded-lg bg-mainLight-primary dark:bg-mainLight-primary text-white dark:text-mainDark-text hover:bg-mainLight-primaryHover dark:hover:bg-mainLight-primary focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Ver detalles
        </Link>
      </div>
    </Card>
  );
};
