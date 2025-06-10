'use client';

import { useContext, useEffect, useState } from 'react';

import { CreateProductSchema } from '@/Helpers/SchemasValidation';
import { ProductContext } from '@/context/productContext';

import { createProducts, updateProducts } from '@/services/products';
import { defaultValuesForm, parseData } from '@/utils';

import { Button, FileInput, Label, Select, Spinner } from 'flowbite-react';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { CurrencyField, TextInputField } from './CustomComponents/CustomInputs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadMultipleImages } from '@/Helpers/tools';

export const FormComponent = () => {
  // Context
  const { currentProduct, isEdit, products, setOpenModal, setCurrentProduct } =
    useContext(ProductContext);

  const queryClient = useQueryClient();

  const {
    mutate: updateMutation,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
  } = useMutation({
    mutationFn: (data) => updateProducts(data),
    onSuccess: () => {
      toast.success('Producto actualizado con éxito');
      queryClient.invalidateQueries(['tableProduct']);
      queryClient.invalidateQueries(['catalogueProducts']);
    },
    onError: () => {
      // console.error('Error al actualizar el producto:', error);
      toast.error('Error al actualizar el producto');
    },
  });

  const {
    mutate: createMutation,
    isLoading: isLoadingCreate,
    isError: isErrorCreate,
  } = useMutation({
    mutationFn: (data) => createProducts(data),
    onSuccess: () => {
      toast.success('Producto creado con éxito');
      queryClient.invalidateQueries(['tableProduct']);
      queryClient.invalidateQueries(['catalogueProducts']);
    },
    onError: () => {
      // console.error('Error al actualizar el producto:', error);
      toast.error('Error al crear el producto');
    },
  });

  const [isSubmiting, setIsSubmiting] = useState(false);
  const [ArrayImages, setArrayImages] = useState([]);

  // Este efecto se ejecutará cada vez que "products" cambie
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Aquí puedes ejecutar cualquier lógica adicional
  }, [products]);

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

    setArrayImages((prev) => [...prev, ...newFiles]);
  };

  const onSubmit = async (data) => {
    setIsSubmiting(true);
    try {
      let imageUrls = currentProduct.image_URL || [];
      if (ArrayImages.length > 0) {
        toast.loading('Comprimiendo y subiendo imágenes...');
        const result = await uploadMultipleImages(ArrayImages);

        imageUrls = [...imageUrls, ...result.filter((url) => url !== null)];
        setArrayImages([]);

        toast.dismiss();
        toast.success('Imágenes subidas con éxito');
      }

      const payload = parseData({
        ...data,
        image_URL: imageUrls, // ahora es un array
      });

      toast.loading(
        isEdit ? 'Actualizando producto...' : 'Creando producto...',
      );

      isEdit
        ? updateMutation({ ...payload, _id: data._id }) // Si es edición, se envía el ID
        : createMutation(payload); // Si es creación, no se envía ID

      setCurrentProduct(defaultValuesForm);
      toast.success(
        isEdit ? 'Producto actualizado con éxito' : 'Producto creado con éxito',
      );
      toast.dismiss();
    } catch (error) {
      setArrayImages([]);
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

          <div className="mb-2 block">
            <Label
              htmlFor="disponibility"
              value="Disponibilidad"
              className="text-base"
            />
            <Select
              id="disponibility"
              name="disponibility"
              onChange={(e) => setFieldValue('disponibility', e.target.value)}
              value={values.disponibility}
            >
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
            </Select>
          </div>

          <div className="mb-2 block">
            <Label htmlFor="status" value="Estado" className="text-base" />
            <Select
              id="status"
              name="status"
              onChange={(e) => setFieldValue('status', e.target.value)}
              value={values.status}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </Select>
          </div>

          <CurrencyField
            keyValue={'price_minimun'}
            valueForm={values.price_minimun}
            setFieldValue={setFieldValue}
            labelName={'Precio Minimo De Venta'}
          />

          <CurrencyField
            keyValue={'price_buy'}
            valueForm={values.price_buy}
            setFieldValue={setFieldValue}
            labelName={'Precio De Compra'}
          />

          <CurrencyField
            keyValue={'price_sale'}
            valueForm={values.price_sale}
            setFieldValue={setFieldValue}
            labelName={'Precio De Venta'}
          />

          <CurrencyField
            keyValue={'price_soldOn'}
            valueForm={values.price_soldOn}
            setFieldValue={setFieldValue}
            labelName={'Vendido En'}
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
              }} /* 
              helperText={
                <span className="font-medium text-yellow-300">
                  {errors.image_URL && touched.image_URL
                    ? errors.image_URL
                    : ''}
                </span>
              } */
            />

            <div className="mt-4 overflow-x-auto scroll-smooth">
              <div className="flex gap-2 w-max">
                {(currentProduct.image_URL?.length > 0
                  ? currentProduct.image_URL
                  : ArrayImages
                ).map((item, index) => {
                  const isURL = typeof item === 'string';
                  const src = isURL ? item : URL.createObjectURL(item);

                  return (
                    <img
                      key={
                        isURL
                          ? `image-url-${index}`
                          : `${item.name}-${item.lastModified}-${index}`
                      }
                      src={src}
                      alt={`preview-${index}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  );
                })}
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
              id="condition"
              name="condition"
              onChange={(e) => setFieldValue('condition', e.target.value)}
              value={values.condition}
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
              <option value="16GB">32 RAM</option>
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

          <TextInputField
            keyValue={'model'}
            valueForm={values.model}
            setFieldValue={setFieldValue}
            labelName={'Modelo De Portatil'}
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

          {isLoadingCreate || isLoadingUpdate ? (
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
