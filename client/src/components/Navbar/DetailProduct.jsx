'use client';

import { ProductContext } from '@/context/productContext';
import { formatPrice } from '@/utils';
import { Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import CarouselComponent from '../DetailProduct/carousel/CarouselComponent';

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

  const handleWhatsAppRedirect = () => {
    window.open('https://wa.me/573126193489', '_blank');
  };

  return (
    <section className="py-8 antialiased">
      <div className="max-w-screen-2xl px-4 mx-auto 2xl:px-0">
        {/* Cambio principal aquí: estructura de grid más limpia */}
        <div className="lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-8 xl:gap-10 w-full">
          {/* Columna izquierda (imágenes) */}
          <div className="lg:row-start-1 ">
            <CarouselComponent images={currentProduct.image_URL} />

            {/* WhatsApp */}
            <div className="flex flex-col items-center mt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Escríbenos al WhatsApp al 312 619 3489
              </h2>
              <span>O</span>
              <Button
                onClick={handleWhatsAppRedirect}
                className="text-green-600 dark:text-white flex justify-center items-center gap-2"
                color="green"
              >
                <FaWhatsapp
                  size={30}
                  className="text-green-600 dark:text-white"
                />
                <p className="text-semibold text-xl">Contactar por WhatsApp</p>
              </Button>
            </div>
          </div>

          {/* Columna derecha (contenido) */}
          <div className="space-y-6 mt-6 lg:mt-0 lg:col-start-2 lg:row-start-1">
            {/* Sección de disponibilidad y nombre */}
            <div>
              {currentProduct?.disponibility === 'vendido' ? (
                <span className="text-red-500 font-bold">Vendido</span>
              ) : (
                <span className="text-green-500 font-bold text-xl">
                  Disponible
                </span>
              )}
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white mt-2">
                {currentProduct?.name}
              </h1>
              <h2 className="text-xl font-semibold text-mainLight-subtext dark:text-white mb-4">
                {formatPrice(currentProduct?.price.sale)}{' '}
              </h2>
            </div>

            {/* Especificaciones técnicas */}
            <div>
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
            {/* Descripción general */}
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Descripción general
            </h2>
            <p>{currentProduct?.specification.general_description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailProduct;
