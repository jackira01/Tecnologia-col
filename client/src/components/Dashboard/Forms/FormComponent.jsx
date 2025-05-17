'use client';

import { useContext, useEffect, useState } from 'react';

import { CreateProductSchema } from '@/Helpers/SchemasValidation';
import { ProductContext } from '@/context/productContext';

import { createProducts, updateProducts } from '@/services/products';
import { defaultValuesForm, parseData } from '@/utils';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Button, FileInput, Label, Select, Spinner } from 'flowbite-react';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { CurrencyField, TextInputField } from './CustomComponents/CustomInputs';

export const FormComponent = () => {
  // Context
  const {
    currentProduct,
    isEdit,
    setProducts,
    products,
    setOpenModal,
    setCurrentProduct,
  } = useContext(ProductContext);

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [ArrayImages, setrrayImages] = useState([]);

  // Este efecto se ejecutará cada vez que "products" cambie
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    console.log('El estado ha cambiado:');
    // Aquí puedes ejecutar cualquier lógica adicional
  }, [products]);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.3, // máximo 300KB
      maxWidthOrHeight: 1024, // redimensiona si es más grande
      useWebWorker: true,
    };
    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      return file; // si falla, sigue con el original
    }
  };

  const uploadMultipleImages = async (filesArray) => {
    const uploadedUrls = [];

    for (const file of filesArray) {
      try {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.append('file', compressed);
        formData.append('upload_preset', 'tecnologia_col');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dikkcrred/image/upload',
          formData,
        );
        uploadedUrls.push(response.data.secure_url);
      } catch (error) {
        console.error(`Error al subir ${file.name}:`, error);
        uploadedUrls.push(null); // O maneja según tu lógica
      }
    }

    return uploadedUrls;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Evita duplicados
    const newFiles = selectedFiles.filter(
      (file) =>
        !ArrayImages.some(
          (existing) =>
            existing.name === file.name &&
            existing.lastModified === file.lastModified,
        ),
    );

    if (newFiles.length < selectedFiles.length) {
      toast.error('Algunas imágenes ya fueron seleccionadas y se omitieron');
    }

    const totalFiles = ArrayImages.length + newFiles.length;

    if (totalFiles > 5) {
      toast.error('Solo puedes subir un máximo de 5 imágenes');
      return;
    }

    setrrayImages((prev) => [...prev, ...newFiles]);
  };

  const onSubmit = async (data) => {
    setIsSubmiting(true);
    try {
      toast.loading('Comprimiendo y subiendo imágenes...');
      const imageUrls = await uploadMultipleImages(ArrayImages);

      toast.dismiss();

      toast.loading('Creando producto...');

      const payload = parseData({
        ...data,
        image_URL: imageUrls, // ahora es un array
      });

      const newProduct = isEdit
        ? await updateProducts({ ...payload, _id: data._id })
        : await createProducts(payload);

      if (isEdit) {
        setProducts((prev) =>
          prev.map((p) => (p._id === newProduct._id ? newProduct : p)),
        );
      } else {
        setProducts((prev) => [...prev, newProduct]);
      }
      setCurrentProduct(defaultValuesForm);
      toast.dismiss();
    } catch (error) {
      setrrayImages([]);
      console.error('Error al subir las imágenes:', error);
      toast.error('Error al subir las imágenes');
      setIsSubmiting(false);
      return;
    }

    setIsSubmiting(false);
    setOpenModal(false);
    toast.success('Producto creado con exito');
    return;
  };

  return (
    <Formik
      initialValues={currentProduct}
      className="grid grid-cols-2 gap-4 "
      onSubmit={onSubmit}
      validationSchema={CreateProductSchema}
    >
      {({ values, errors, handleSubmit, setFieldValue, touched }) => (
        <Form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <TextInputField
            keyValue={'name'}
            valueForm={values.name}
            setFieldValue={setFieldValue}
            labelName={'Nombre de Producto'}
            error_message={errors.name && touched.name ? errors.name : ''}
          />

          <CurrencyField
            keyValue={'price_buy'}
            valueForm={values.price_buy}
            setFieldValue={setFieldValue}
            labelName={'Precio De Compra'}
          />

          <CurrencyField
            keyValue={'price_minimun'}
            valueForm={values.price_minimun}
            setFieldValue={setFieldValue}
            labelName={'Precio Minimo De Venta'}
          />

          <CurrencyField
            keyValue={'price_sale'}
            valueForm={values.price_sale}
            setFieldValue={setFieldValue}
            labelName={'Precio De Venta'}
          />

          <div className="mb-2 block lg:col-span-2">
            <Label
              htmlFor="image_URL"
              value="Subir Imagen"
              className="text-base"
            />

            <FileInput
              id="image_URL"
              multiple
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
            <div className="mt-4 overflow-x-auto scroll-smooth">
              <div className="flex gap-2 w-max">
                {ArrayImages.map((file, index) => (
                  <img
                    key={`${file.name}-${file.lastModified}-${index}`}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${file.name}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
            <div />
          </div>

          <div className="col-span-2 text-lg text-white font-bold font-sans">
            <h2>Especificaciones</h2>
          </div>

          <div className="mb-2 block">
            <Label
              htmlFor="product_status"
              value="Estado"
              className="text-base"
            />
            <Select
              id="product_status"
              name="product_status"
              onChange={(e) => setFieldValue('product_status', e.target.value)}
              value={values.product_status}
            >
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label
              htmlFor="so"
              value="Sistema Operativo"
              className="text-base"
            />
            <Select
              id="so"
              name="so"
              onChange={(e) => setFieldValue('so', e.target.value)}
              value={values.so}
            >
              <option value="Windows 7">Windows 7</option>
              <option value="Windows 8">Windows 8</option>
              <option value="Windows 10">Windows 10</option>
              <option value="Windows 11">Windows 11</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label
              htmlFor="ram_size"
              value="Tamaño de Ram"
              className="text-base"
            />
            <Select
              id="ram_size"
              name="ram_size"
              onChange={(e) => setFieldValue('ram_size', e.target.value)}
              value={values.ram_size}
            >
              <option value="2GB">2 RAM</option>
              <option value="4GB">4 RAM</option>
              <option value="6GB">6 RAM</option>
              <option value="8GB">8 RAM</option>
              <option value="10GB">10 RAM</option>
              <option value="12GB">12 RAM</option>
              <option value="14GB">14 RAM</option>
              <option value="16GB">16 RAM</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label
              htmlFor="ram_type"
              value="Tipo de Ram"
              className="text-base"
            />
            <Select
              id="ram_type"
              name="ram_type"
              onChange={(e) => setFieldValue('ram_type', e.target.value)}
              value={values.ram_type}
            >
              <option>DDR2</option>
              <option>DDR3</option>
              <option>DDR4</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label
              htmlFor="storage_size"
              value="Tamaño de almacen"
              className="text-base"
            />
            <Select
              id="storage_size"
              name="storage_size"
              onChange={(e) => setFieldValue('storage_size', e.target.value)}
              value={values.storage_size}
            >
              <option value="128GB">128 GB</option>
              <option value="256GB">256 GB</option>
              <option value="500GB">500 GB</option>
              <option value="512GB">512 GB</option>
              <option value="1TB">1 TB</option>
              <option value="2TB">2 TB</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label
              htmlFor="storage_type"
              value="Tipo de almacen"
              className="text-base"
            />
            <Select
              id="storage_type"
              name="storage_type"
              onChange={(e) => setFieldValue('storage_type', e.target.value)}
              value={values.storage_type}
            >
              <option value="SSD">SSD</option>
              <option value="HDD">HDD</option>
            </Select>
          </div>

          <TextInputField
            keyValue={'processor_brand'}
            valueForm={values.processor_brand}
            setFieldValue={setFieldValue}
            labelName={'Marca de Procesador'}
            error_message={
              errors.processor_brand && touched.processor_brand
                ? errors.processor_brand
                : ''
            }
          />

          <TextInputField
            keyValue={'processor_model'}
            valueForm={values.processor_model}
            setFieldValue={setFieldValue}
            labelName={'Modelo de CPU'}
            error_message={
              errors.processor_model && touched.processor_model
                ? errors.processor_model
                : ''
            }
          />

          <TextInputField
            keyValue={'brand'}
            valueForm={values.brand}
            setFieldValue={setFieldValue}
            labelName={'Marca De Portatil'}
            error_message={errors.brand && touched.brand ? errors.brand : ''}
          />

          <div className="mb-2 block">
            <Label htmlFor="charger" value="Cargador" className="text-base" />
            <Select
              required
              id="charger"
              name="charger"
              onChange={(e) => setFieldValue('charger', e.target.value)}
              value={values.charger}
            >
              <option value={true}>Con Cargador</option>
              <option value={false}>Sin Cargador</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label htmlFor="battery" value="Bateria" className="text-base" />
            <Select
              required
              id="battery"
              name="battery"
              onChange={(e) => setFieldValue('battery', e.target.value)}
              value={values.battery}
            >
              <option value={true}>Con Bateria</option>
              <option value={false}>Sin Bateria</option>
            </Select>
          </div>

          <TextInputField
            keyValue={'screen_size'}
            valueForm={values.screen_size}
            setFieldValue={setFieldValue}
            labelName={'Pulgadas de Pantalla'}
            error_message={
              errors.screen_size && touched.screen_size
                ? errors.screen_size
                : ''
            }
          />

          <TextInputField
            keyValue={'specification_URL'}
            valueForm={values.specification_URL}
            setFieldValue={setFieldValue}
            labelName={'Referecia del producto'}
          />

          <TextInputField
            keyValue={'description'}
            valueForm={values.description}
            setFieldValue={setFieldValue}
            labelName={'Descripcion'}
            error_message={
              errors.description && touched.description
                ? errors.description
                : ''
            }
          />

          {isSubmiting ? (
            <div className="flex col-span-2 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <Button className="col-span-2" type="submit">
              {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </Button>
          )}
        </Form>
      )}
    </Formik>
  );
};
