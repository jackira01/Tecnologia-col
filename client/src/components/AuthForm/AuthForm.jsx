'use client';

import { CreateUserSchema } from '@/Helpers/SchemasValidation';
import { Form, Formik } from 'formik';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

const AuthForm = () => {
  // const { setUser } = useContext(UserContext);
  const initialValues = {
    name: '',
    password: '',
  };

  const onSubmit = async (values) => {
    const response = await signIn('credentials', {
      redirect: false,
      name: values.name,
      password: values.password,
    });

    if (response.error) {
      return toast.error('Revisa tus credenciales');
    }
    toast.success('Sesion iniciada');
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={CreateUserSchema}
    >
      {({ values, errors, handleSubmit, setFieldValue, touched }) => (
        <Form className="max-w-sm mx-auto mt-20" onSubmit={handleSubmit}>
          <h2 className="text-mainLight-text dark:text-mainDark-text my-5 font-bold text-xl">
            Iniciar sesion
          </h2>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Usuario
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Jhon Doe"
              onChange={(e) => setFieldValue('name', e.target.value)}
              value={values.name}
            />
            {errors.name && touched.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tu contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setFieldValue('password', e.target.value)}
              value={values.password}
            />
            {errors.password && touched.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            )}
          </div>

          <button type="button" onClick={() => signIn('google')}>
            GOOGLE
          </button>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Enviar
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
