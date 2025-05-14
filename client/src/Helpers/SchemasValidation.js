import * as Yup from 'yup';

export const CreateProductSchema = Yup.object().shape({
	name: Yup.mixed().required('Nombre requerido'),

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

	description: Yup.string().min(2, 'Muy corto!').max(150, 'Muy largo!'),
});
