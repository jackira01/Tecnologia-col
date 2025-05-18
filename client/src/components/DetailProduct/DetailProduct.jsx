'use client';

import { ProductContext } from '@/context/productContext';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import CarouselComponent from './carousel/CarouselComponent';

const DetailProduct = () => {
  const { currentProduct } = useContext(ProductContext);

  const router = useRouter();

  useEffect(() => {
    if (!currentProduct) {
      router.push('/'); // redirección al home si no hay producto
    }
  }, [currentProduct, router]);

  if (!currentProduct) return null;

  useEffect(() => {
    if (!currentProduct.specification) {
      router.push('/'); // redirección al home si no hay producto
    }
  }, [currentProduct, router]);

  if (!currentProduct.specification) return null; // para evitar que se renderice contenido basura

  return (
    <section className="py-8 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div>
            <CarouselComponent images={currentProduct.image_URL} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Descripcion general
            </h2>
            {currentProduct?.specification.general_description}
          </div>
          <div className="mt-6 sm:mt-8 lg:mt-0">
            <div className="mb-4">
              {currentProduct?.disponibility === 'vendido' ? (
                <span className="text-red-500 font-bold ">Vendido</span>
              ) : (
                <span className="text-green-500 font-bold text-xl">
                  Disponible
                </span>
              )}
            </div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {currentProduct?.name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex" />

            <div className="">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Especificaciones Técnicas
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 dark:text-gray-300 text-sm">
                <li>
                  <span className="font-semibold">Estado del producto:</span>{' '}
                  {currentProduct?.specification.condition}{' '}
                </li>

                <li>
                  <span className="font-semibold">Sistema Operativo:</span>{' '}
                  {currentProduct?.specification.so}
                </li>
                <li>
                  <span className="font-semibold">Marca:</span>{' '}
                  {currentProduct?.specification.brand &&
                    currentProduct?.specification.model}
                </li>

                <li>
                  <span className="font-semibold">Pantalla:</span>{' '}
                  {currentProduct?.specification.screen_size}"
                </li>
                <li>
                  <span className="font-semibold">Batería:</span>{' '}
                  {currentProduct?.specification.battery ? 'Sí' : 'No'}
                </li>
                <li>
                  <span className="font-semibold">Cargador:</span>{' '}
                  {currentProduct?.specification.charger ? 'Sí' : 'No'}
                </li>
                <li>
                  <span className="font-semibold">RAM:</span>{' '}
                  {currentProduct?.specification.ram.ram_size}{' '}
                  {currentProduct?.specification.ram.ram_type}
                </li>
                <li>
                  <span className="font-semibold">Almacenamiento:</span>{' '}
                  {currentProduct?.specification.storage.size}{' '}
                  {currentProduct?.specification.storage.storage_type}
                </li>
                <li>
                  <span className="font-semibold">Procesador:</span>{' '}
                  {currentProduct?.specification.processor.brand}{' '}
                  {currentProduct?.specification.processor.model}
                </li>

                <li>
                  <a
                    href={currentProduct?.specification.specification_URL}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Equipos de referencia
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <Button color="green">
                <FaWhatsapp className="m-auto text-green-600 dark:text-white" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailProduct;
