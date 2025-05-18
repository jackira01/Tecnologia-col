import * as Yup from 'yup';

export const CreateProductSchema = Yup.object().shape({
  name: Yup.mixed().required('Nombre requerido'),

  /*   image_URL: Yup.array()
    .of(Yup.string().url('URL invalida'))
    .min(1, 'Imagen requerida')
    .max(5, 'Maximo 5 imagenes'), */

  processor_brand: Yup.string()
    .min(2, 'Muy corto!')
    .max(50, 'Muy largo!')
    .required('Marca requerida'),

  processor_model: Yup.string().min(2, 'Muy corto!').max(50, 'Muy largo!'),

  brand: Yup.string()
    .min(2, 'Muy corto!')
    .max(50, 'Muy largo!')
    .required('Marca requerido'),

  screen_size: Yup.number()
    .typeError('Debe ser numero')
    .min(2, 'Muy corto!')
    .max(50, 'Muy largo!'),

  description: Yup.string().min(2, 'Muy corto!').max(800, 'Muy largo!'),
});
