import { diffDays, format } from '@formkit/tempo';
import { formatValue } from 'react-currency-input-field';
const currentDate = new Date();

export const parseData = (data) => ({
  name: data.name,
  disponibility: data.disponibility,
  active: data.status === 'activo',
  price: {
    minimun: data.price_minimun,
    buy: data.price_buy,
    sale: data.price_sale,
    soldOn: data.price_soldOn,
  },
  image_URL: data.image_URL,
  specification: {
    specification_URL: data.specification_URL,
    condition: data.condition,
    charger: data.charger,
    battery: data.battery,
    so: data.so,
    brand: data.brand,
    model: data.model,
    screen_size: data.screen_size,
    ram: {
      size: data.ram_size,
      ram_type: data.ram_type,
    },
    storage: {
      size: data.storage_size,
      storage_type: data.storage_type,
    },
    processor: {
      brand: data.processor_brand,
      model: data.processor_model,
    },
    general_description: data.description,
  },
});

export const parseDataToModal = (data) => ({
  _id: data._id,
  name: data.name || '',
  disponibility: data.disponibility || 'disponible',
  status: data.active ? 'activo' : 'inactivo',
  condition: data.specification.condition || 'nuevo',
  price_soldOn: data.price.soldOn || 0,
  price_minimun: data.price.minimun || '0',
  price_sale: data.price.sale || '0',
  price_buy: data.price.buy || '0',
  image_URL: data.image_URL || [],
  product_status: data.specification.product_status || '',
  so: data.specification.so || '',
  ram_size: data.specification.ram.size || '',
  ram_type: data.specification.ram.ram_type || '',
  storage_size: data.specification.storage.size || '',
  storage_type: data.specification.storage.storage_type || '',
  processor_brand: data.specification.processor.brand || '',
  processor_model: data.specification.processor.model || '',
  brand: data.specification.brand || '',
  model: data.specification.model || '',
  charger: data.specification.charger || true,
  battery: data.specification.battery || true,
  screen_size: data.specification.screen_size || '',
  specification_URL: data.specification.specification_URL || '',
  description: data.specification.general_description || '',
});

export const parseDate = (date) => {
  const parseDate = format(currentDate, 'YYYY-MM-DD', 'es');
  const diff = diffDays(parseDate, date);
  const dia = diff >= 10 ? 'Dias' : 'Dia';
  return `${parseDate} ( ${diff} ${dia} )`;
};

export const defaultValuesForm = {
  name: '',
  disponibility: 'disponible',
  status: 'activo',
  price_minimun: '0',
  price_buy: '0',
  price_sale: '0',
  price_soldOn: '0',
  image_URL: [],
  condition: 'nuevo',
  so: 'windows 7',
  ram_size: '2GB',
  ram_type: 'DDR2',
  storage_size: '128GB',
  storage_type: 'SSD',
  processor_brand: '',
  processor_model: '',
  brand: '',
  model: '',
  charger: true,
  battery: true,
  screen_size: '',
  specification_URL: '',
  description: '',
};

export const formatPrice = (price) => {
  const formattedValue1 = formatValue({
    value: String(price),
    groupSeparator: ',',
    decimalSeparator: '.',
    prefix: '$',
  });
  return formattedValue1;
};
