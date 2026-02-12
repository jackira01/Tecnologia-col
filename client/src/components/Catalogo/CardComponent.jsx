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

  // Validar que data existe y tiene las propiedades necesarias
  if (!data) {
    return null;
  }

  const handleClickDetails = async () => {
    await setCurrentProduct(data);
  };

  // Valores por defecto seguros
  const imageUrl = data.image_URL?.[0] || '/placeholder-laptop.svg';
  const productName = data.name || 'Producto sin nombre';
  const disponibility = data.disponibility || 'disponible';
  const condition = data.specification?.condition || 'usado';
  const salePrice = data.price?.sale || 0;
  const ramSize = data.specification?.ram?.size || 'N/A';
  const ramType = data.specification?.ram?.ram_type || '';
  const processorBrand = data.specification?.processor?.brand || 'N/A';
  const processorModel = data.specification?.processor?.model || '';

  const SpecItem = ({ icon, text }) => (
    <div className="flex items-center">
      <span className="mr-2 text-gray-600 dark:text-gray-400">{icon}</span>
      <span className="text-sm text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );

  return (
    <Card
      className="transition-colors duration-500 h-full w-full min-w-[250px] max-w-[300px] border-none text-mainLight-text dark:bg-mainDark-card dark:text-mainDark-text shadow-md"
    >
      <Image
        src={imageUrl}
        alt={productName}
        width={500}
        height={200}
        className="w-full h-[200px] object-cover rounded-t-lg"
        onError={(e) => {
          e.target.src = '/placeholder-laptop.svg';
        }}
      />
      <div className="flex h-full flex-col justify-between gap-0">
        <>
          {disponibility === 'vendido' ? (
            <span className="text-red-500 font-bold">Vendido</span>
          ) : (
            <span className="text-green-500 font-bold">Disponible</span>
          )}
          <br />
          {condition === 'nuevo' ? (
            <span className="text-blue-500 font-bold">Nuevo</span>
          ) : (
            <span className="text-blue-500 font-bold">Usado</span>
          )}
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white ">
            {productName}
          </h5>
          <p className="mb-3 font-bold text-gray-700 dark:text-gray-300">
            {formatPrice(salePrice)}
          </p>

          {/* Tus especificaciones (iconos + texto) */}
          <div className="space-y-2">
            <SpecItem
              icon={<RiRam2Line />}
              text={`RAM ${ramSize} ${ramType}`}
            />
            <SpecItem
              icon={<BsDeviceHdd />}
              text={
                Array.isArray(data.specification?.storage)
                  ? data.specification.storage.map((s, i) => 
                      `${s?.size || 'N/A'} ${s?.storage_type || ''}`
                    ).join(' + ')
                  : `Almacenamiento ${data.specification?.storage?.size || 'N/A'} ${data.specification?.storage?.storage_type || ''}`
              }
            />
            <SpecItem
              icon={<HiMiniCpuChip />}
              text={`${processorBrand} ${processorModel}`}
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
