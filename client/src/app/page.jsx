import { Catalogo } from '@/components/Catalogo/Catalogo';

export const metadata = {
  title: {
    absolute: 'Tecnologia Col - Equipos de cómputo al mejor precio',
  },
  description: 'Descubre la mejor selección de laptops, computadores y accesorios tecnológicos en Colombia. Calidad garantizada y los precios más bajos del mercado.',
  keywords: ['tecnología', 'colombia', 'laptops', 'computadores', 'venta', 'precio', 'barato', 'ofertas', 'equipos'],
  openGraph: {
    title: 'Tecnologia Col - Equipos de cómputo al mejor precio',
    description: 'Descubre la mejor selección de laptops, computadores y accesorios tecnológicos en Colombia.',
    siteName: 'Tecnologia Col',
    locale: 'es_CO',
    type: 'website',
  },
};

const catalogoPage = () => <Catalogo />;

export default catalogoPage;
