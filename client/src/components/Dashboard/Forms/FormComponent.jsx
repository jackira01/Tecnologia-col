'use client';

import { useContext, useEffect, useState } from 'react';

import { CreateProductSchema } from '@/Helpers/SchemasValidation';
import { ProductContext } from '@/context/productContext';

import { createProducts, updateProducts } from '@/services/products';
import { getAttributesByCategory } from '@/services/attributes';
import { defaultValuesForm, parseData } from '@/utils';

import { uploadMultipleImages } from '@/Helpers/tools';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button, FileInput, Label, Select, Spinner, Textarea, TextInput } from 'flowbite-react';
import { Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { CurrencyField, TextInputField } from './CustomComponents/CustomInputs';


export const FormComponent = () => {
  // Context
  const { currentProduct, isEdit, products, setOpenModal, setCurrentProduct } =
    useContext(ProductContext);

  const [ArrayImages, setArrayImages] = useState([]);

  const queryClient = useQueryClient();

  // Queries para atributos dinámicos
  const { data: soDoc } = useQuery({
    queryKey: ['attributes', 'so'],
    queryFn: () => getAttributesByCategory('so'),
    staleTime: 1000 * 60 * 5,
  });
  const soOptions = soDoc?.data?.versions || [];

  const { data: ramDoc } = useQuery({
    queryKey: ['attributes', 'ram'],
    queryFn: () => getAttributesByCategory('ram'),
  });
  const ramData = ramDoc?.data || {};

  const { data: storageDoc } = useQuery({
    queryKey: ['attributes', 'storage'],
    queryFn: () => getAttributesByCategory('storage'),
  });
  const storageData = storageDoc?.data || {};

  const { data: processorDoc } = useQuery({
    queryKey: ['attributes', 'processors'],
    queryFn: () => getAttributesByCategory('processors'),
  });
  const processorData = processorDoc?.data || {};

  const { data: brandDoc } = useQuery({
    queryKey: ['attributes', 'brands'],
    queryFn: () => getAttributesByCategory('brands'),
  });
  const brandOptions = brandDoc?.data?.names || [];


  const {
    mutate: updateMutation,
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
  } = useMutation({
    mutationFn: (data) => updateProducts(data),
    onSuccess: () => {
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
      queryClient.invalidateQueries(['tableProduct']);
      queryClient.invalidateQueries(['catalogueProducts']);
    },
    onError: () => {
      // console.error('Error al actualizar el producto:', error);
      toast.error('Error al crear el producto');
    },
  });

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
      toast.dismiss();
    } catch (error) {
      setArrayImages([]);
      console.error('Error al subir las imágenes:', error);
      toast.error('Error al subir las imágenes');
      return;
    }

    setOpenModal(false);
    return;
  };

  return (
    <Formik
      initialValues={currentProduct}
      className="grid grid-cols-2 gap-4 "
      onSubmit={onSubmit}
      validationSchema={CreateProductSchema}
    >
      {({ values, errors, handleSubmit, setFieldValue, touched }) => {
        // Auto-cálculo de precio sugerido de venta con rangos dinámicos
        // biome-ignore lint/correctness/useExhaustiveDependencies: Auto-calculation effect
        useEffect(() => {
          const buyPrice = parseFloat(values.price_buy) || 0;
          const otherExpenses = parseFloat(values.price_otherExpenses) || 0;
          
          if (buyPrice > 0) {
            const totalCost = buyPrice + otherExpenses;
            
            // Lógica de rangos de multiplicadores
            let multiplier;
            if (totalCost <= 200000) {
              // Rango Bajo: $0 - $200k → x2.5 (~150% margen)
              multiplier = 2.5;
            } else if (totalCost <= 450000) {
              // Rango Medio: $201k - $450k → x2.2 (~120% margen)
              multiplier = 2.2;
            } else {
              // Rango Alto: $451k+ → x1.8 (~80% margen)
              multiplier = 1.8;
            }
            
            // Calcular precio base y redondear al millar más cercano
            const rawPrice = totalCost * multiplier;
            const roundedPrice = Math.round(rawPrice / 1000) * 1000;
            
            // Solo actualizar si el campo está vacío o es 0
            if (!isEdit || values.price_sale === 0 || values.price_sale === '0' || values.price_sale === '') {
              setFieldValue('price_sale', roundedPrice);
            }
          }
        }, [values.price_buy, values.price_otherExpenses]);

        // Auto-cálculo de Mi Inversión
        useEffect(() => {
          if (values.acquisitionType === 'owned') {
            const buy = parseFloat(values.price_buy) || 0;
            const other = parseFloat(values.price_otherExpenses) || 0;
            setFieldValue('price_myInvestment', buy + other);
          }
        }, [values.acquisitionType, values.price_buy, values.price_otherExpenses, setFieldValue]);

        return (

        <Form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2" onSubmit={handleSubmit}>
          {/* Sección: Información Principal */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <TextInputField
              keyValue={'name'}
              valueForm={values.name}
              setFieldValue={setFieldValue}
              labelName={'Nombre de Producto'}
              error_message={errors.name && touched.name ? errors.name : ''}
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <TextInputField
              keyValue={'specification_URL'}
              valueForm={values.specification_URL}
              setFieldValue={setFieldValue}
              labelName={'Referencia del producto'}
            />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="mb-2 block">
              <Label htmlFor="description" className="text-base">Descripción</Label>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Descripción del producto..."
              rows={4}
              onChange={(e) => setFieldValue('description', e.target.value)}
              value={values.description}
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Sección: Estado y Disponibilidad */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="disponibility" className="text-base">Disponibilidad</Label>
            </div>
            <Select
              id="disponibility"
              name="disponibility"
              onChange={(e) => setFieldValue('disponibility', e.target.value)}
              value={values.disponibility}
            >
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
            </Select>
            {values.disponibility === 'vendido' && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                ⚠️ Debes completar la Fecha de Venta y el Precio Venta Real
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="status" className="text-base">Estado</Label>
            </div>
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

          {/* Sección: Precios y Finanzas */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Finanzas y Métricas
            </h2>
          </div>

          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="acquisitionType" className="text-base">Tipo de Adquisición</Label>
            </div>
            <Select
              id="acquisitionType"
              name="acquisitionType"
              onChange={(e) => setFieldValue('acquisitionType', e.target.value)}
              value={values.acquisitionType}
            >
              <option value="owned">Propio (100%)</option>
              <option value="co_investment">Co-inversión</option>
              <option value="consignment">Consignación</option>
            </Select>
          </div>

          <div className="col-span-1">
            {values.acquisitionType === 'co_investment' ? (
              <>
                <CurrencyField
                  keyValue={'price_myInvestment'}
                  valueForm={values.price_myInvestment}
                  setFieldValue={setFieldValue}
                  labelName={'Mi Inversión Real'}
                />
                {(() => {
                  const myInv = parseFloat(values.price_myInvestment) || 0;
                  const buy = parseFloat(values.price_buy) || 0;
                  const other = parseFloat(values.price_otherExpenses) || 0;
                  const total = buy + other;
                  
                  if (total > 0 && myInv > 0) {
                    const pct = Math.round((myInv / total) * 100);
                    return (
                      <p className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Eres dueño del {pct}% de este equipo
                      </p>
                    );
                  }
                  return null;
                })()}
              </>
            ) : (
               <CurrencyField
                keyValue={'price_buy'}
                valueForm={values.price_buy}
                setFieldValue={setFieldValue}
                labelName={'Costo Adquisición'}
              />
            )}
          </div>

          <div className="col-span-1">
            <CurrencyField
              keyValue={'price_sale'}
              valueForm={values.price_sale}
              setFieldValue={setFieldValue}
              labelName={'Precio Publicado'}
            />
            {/* Indicador de rango de precio */}
            {(() => {
              const buyPrice = parseFloat(values.price_buy) || 0;
              const otherExpenses = parseFloat(values.price_otherExpenses) || 0;
              const totalCost = buyPrice + otherExpenses;
              
              if (totalCost > 0) {
                let rangeInfo = {};
                if (totalCost <= 200000) {
                  rangeInfo = { label: 'Rango Bajo', multiplier: '2.5x', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' };
                } else if (totalCost <= 450000) {
                  rangeInfo = { label: 'Rango Medio', multiplier: '2.2x', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' };
                } else {
                  rangeInfo = { label: 'Rango Alto', multiplier: '1.8x', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' };
                }
                
                return (
                  <div className="mt-1 text-xs">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${rangeInfo.color}`}>
                      {rangeInfo.label} ({rangeInfo.multiplier})
                    </span>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div className="col-span-1">
            <CurrencyField
              keyValue={'price_soldOn'}
              valueForm={values.price_soldOn}
              setFieldValue={setFieldValue}
              labelName={'Precio Venta Real'}
              error_message={errors.price_soldOn && touched.price_soldOn ? errors.price_soldOn : ''}
            />
          </div>

          <div className="col-span-1">
            <CurrencyField
              keyValue={'price_otherExpenses'}
              valueForm={values.price_otherExpenses}
              setFieldValue={setFieldValue}
              labelName={'Otros Gastos'}
            />
          </div>

          <div className="col-span-1">
            <CurrencyField
              keyValue={'price_minimun'}
              valueForm={values.price_minimun}
              setFieldValue={setFieldValue}
              labelName="Precio Mínimo"
            />
          </div>

          {/* Sección: Métricas Facebook */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Métricas Facebook
            </h2>
          </div>

          <div className="col-span-1">
            <TextInputField
              keyValue={'metrics_fbViews'}
              valueForm={values.metrics_fbViews}
              setFieldValue={setFieldValue}
              labelName={'Vistas Facebook'}
              type="number"
            />
          </div>

          <div className="col-span-1">
            <TextInputField
              keyValue={'metrics_fbMessages'}
              valueForm={values.metrics_fbMessages}
              setFieldValue={setFieldValue}
              labelName={'Mensajes Facebook'}
              type="number"
            />
          </div>

          {/* Sección: Cronología */}
          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="timeline_publishedAt" className="text-base">
                Fecha Publicación
              </Label>
            </div>
            <input
              type="date"
              name="timeline_publishedAt"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) =>
                setFieldValue('timeline_publishedAt', e.target.value)
              }
              value={values.timeline_publishedAt}
            />
          </div>

          <div className="col-span-1">
            <div className="mb-2 block">
              <Label htmlFor="timeline_soldAt" className="text-base">
                Fecha Venta
              </Label>
            </div>
            <input
              type="date"
              name="timeline_soldAt"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={(e) => setFieldValue('timeline_soldAt', e.target.value)}
              value={values.timeline_soldAt}
            />
            {errors.timeline_soldAt && touched.timeline_soldAt && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.timeline_soldAt}
              </p>
            )}
          </div>

          {/* Separador: Especificaciones */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Especificaciones Técnicas
            </h2>
          </div>

          {/* Fila 1: Condición y Sistema Operativo */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="condition" className="text-base">Condición</Label>
            </div>
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

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="so" className="text-base">Sistema Operativo</Label>
            </div>
            <Select
              id="so"
              name="so"
              onChange={(e) => setFieldValue('so', e.target.value)}
              value={values.so}
            >
              <option value="">Seleccionar...</option>
              {soOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </Select>
          </div>

          {/* Fila 2: Marca y Modelo Portátil */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="brand" className="text-base">Marca Portátil</Label>
            </div>
            <Select
              id="brand"
              name="brand"
              onChange={(e) => setFieldValue('brand', e.target.value)}
              value={values.brand}
            >
              <option value="">Seleccionar...</option>
              {brandOptions.map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </Select>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <TextInputField
              keyValue={'model'}
              valueForm={values.model}
              setFieldValue={setFieldValue}
              labelName={'Modelo Portátil'}
            />
          </div>

          {/* Fila 3: Pantalla y RAM */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
             <TextInputField
              keyValue={'screen_size'}
              valueForm={values.screen_size}
              setFieldValue={setFieldValue}
              labelName={'Pantalla (Pulgadas)'}
              error_message={errors.screen_size && touched.screen_size ? errors.screen_size : ''}
            />
          </div>

           {/* RAM - Agrupado (Mitad de ancho) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="mb-2 block">
              <Label className="text-base">Memoria RAM</Label>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div>
                <Label htmlFor="ram_size" className="text-xs mb-1 block">Capacidad</Label>
                <Select
                  id="ram_size"
                  name="ram_size"
                  onChange={(e) => setFieldValue('ram_size', e.target.value)}
                  value={values.ram_size}
                  sizing="sm"
                >
                  <option value="">Seleccionar...</option>
                  {(ramData.sizes || []).map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="ram_type" className="text-xs mb-1 block">Tipo</Label>
                <Select
                  id="ram_type"
                  name="ram_type"
                  onChange={(e) => setFieldValue('ram_type', e.target.value)}
                  value={values.ram_type}
                  sizing="sm"
                >
                  <option value="">Seleccionar...</option>
                  {(ramData.types || []).map((opt, idx) => (
                     <option key={idx} value={opt}>{opt}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {/* Fila 4: Procesador (Ancho Completo para evitar huecos por altura) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="mb-2 block">
              <Label className="text-base">Procesador (CPU)</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">


              <div>
                <Label htmlFor="processor_brand" className="text-xs mb-1 block">Marca</Label>
                <Select
                  id="processor_brand"
                  name="processor_brand"
                  onChange={(e) => {
                      setFieldValue('processor_brand', e.target.value);
                      setFieldValue('processor_family', ''); // Reset family
                      setFieldValue('processor_generation', ''); // Reset generation
                  }}
                  value={values.processor_brand}
                  sizing="sm"
                >
                  <option value="">Seleccionar...</option>
                  {(processorData.brands || []).map((opt, idx) => {
                    const val = typeof opt === 'string' ? opt : opt.value;
                    return <option key={idx} value={val}>{val}</option>;
                  })}
                </Select>
              </div>

              <div>
                <Label htmlFor="processor_family" className="text-xs mb-1 block">Familia</Label>
                <Select
                  id="processor_family"
                  name="processor_family"
                  onChange={(e) => {
                      setFieldValue('processor_family', e.target.value);
                      setFieldValue('processor_generation', ''); // Reset generation
                  }}
                  value={values.processor_family || ''}
                  disabled={!values.processor_brand}
                  sizing="sm"
                >
                  <option value="">Seleccionar...</option>
                  {(processorData.families || [])
                    .filter(item => {
                        if (!values.processor_brand) return true;
                        if (typeof item === 'string') return true; // Show legacy strings always? Or hide? 
                        // User wants strictness. But hiding legacy makes them unusable.
                        // Middle ground: Show legacy strings, but enforce parents for new/edited objects.
                        // Actually, if we show legacy strings, "Ryzen" appears under "Intel".
                        // Let's filter strictly for objects, and loosely for strings (or maybe just show strings if we match name? No).
                        // Decision: Show strings. User must migrate data to enforce strictness fully.
                        return item.parent === values.processor_brand; 
                    })
                    .map((opt, idx) => {
                        const val = typeof opt === 'string' ? opt : opt.value;
                        return <option key={idx} value={val}>{val}</option>;
                  })}
                </Select>
              </div>

              <div>
                <Label htmlFor="processor_generation" className="text-xs mb-1 block">Generación</Label>
                <Select
                  id="processor_generation"
                  name="processor_generation"
                  onChange={(e) => setFieldValue('processor_generation', e.target.value)}
                  value={values.processor_generation || ''}
                  disabled={!values.processor_family} // Disable if no family selected
                  sizing="sm"
                >
                  <option value="">Seleccionar...</option>
                  {(processorData.generations || [])
                    .filter(item => {
                        if (!values.processor_family) return true;
                        if (typeof item === 'string') return true; 
                        return item.parent === values.processor_family; 
                    })
                    .map((opt, idx) => {
                        const val = typeof opt === 'string' ? opt : opt.value;
                        return <option key={idx} value={val}>{val}</option>;
                  })}
                </Select>
              </div>

              <div>
                <Label htmlFor="processor_model" className="text-xs mb-1 block">Modelo (Opcional)</Label>
                <TextInput
                  id="processor_model"
                  name="processor_model"
                  onChange={(e) => setFieldValue('processor_model', e.target.value)}
                  value={values.processor_model}
                  sizing="sm"
                  placeholder="Ej: i5-1135G7"
                />
              </div>
            </div>
          </div>


          {/* Fila 5: Almacenamiento (Ancho Completo) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="mb-2 flex justify-between items-center">
              <Label className="text-base">Unidades de Almacenamiento</Label>
              <Button
                type="button"
                size="xs"
                onClick={() => {
                  const newUnits = [...(values.storageUnits || []), { size: '', storage_type: '' }];
                  setFieldValue('storageUnits', newUnits);
                }}
              >
                + Agregar Unidad
              </Button>
            </div>
            
            <div className="space-y-3">
              {(values.storageUnits || [{ size: '', storage_type: '' }]).map((unit, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="col-span-2">
                    <Label htmlFor={`storage_size_${index}`} className="text-xs mb-1 block">Capacidad</Label>
                    <Select
                      id={`storage_size_${index}`}
                      value={unit.size}
                      onChange={(e) => {
                        const newUnits = [...values.storageUnits];
                        newUnits[index].size = e.target.value;
                        setFieldValue('storageUnits', newUnits);
                      }}
                      sizing="sm"
                    >
                      <option value="">Seleccionar...</option>
                       {(storageData.capacities || []).map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                       ))}
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor={`storage_type_${index}`} className="text-xs mb-1 block">Tipo</Label>
                    <Select
                      id={`storage_type_${index}`}
                      value={unit.storage_type}
                      onChange={(e) => {
                        const newUnits = [...values.storageUnits];
                        newUnits[index].storage_type = e.target.value;
                        setFieldValue('storageUnits', newUnits);
                      }}
                      sizing="sm"
                    >
                      <option value="">Seleccionar...</option>
                      {(storageData.types || []).map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                       ))}
                    </Select>
                  </div>

                  <div className="col-span-1 flex items-end">
                    {(values.storageUnits?.length || 0) > 1 && (
                      <Button
                        type="button"
                        color="failure"
                        size="xs"
                        className="w-full"
                        onClick={() => {
                          const newUnits = values.storageUnits.filter((_, i) => i !== index);
                          setFieldValue('storageUnits', newUnits);
                        }}
                      >
                       <span className="sr-only">Eliminar</span> X
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accesorios */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="charger" className="text-base">Cargador</Label>
            </div>
            <Select
              required
              id="charger"
              name="charger"
              onChange={(e) => setFieldValue('charger', e.target.value)}
              value={values.charger}
            >
              <option value={true}>Incluye Cargador</option>
              <option value={false}>No Incluye</option>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="mb-2 block">
              <Label htmlFor="battery" className="text-base">Batería</Label>
            </div>
            <Select
              required
              id="battery"
              name="battery"
              onChange={(e) => setFieldValue('battery', e.target.value)}
              value={values.battery}
            >
              <option value={true}>Incluye Batería</option>
              <option value={false}>No Incluye</option>
            </Select>
          </div>

          {/* Imágenes */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-4 border-t pt-4">
            <div className="mb-2 block">
              <Label htmlFor="image_URL" className="text-base">Galería de Imágenes</Label>
            </div>

            <FileInput
              id="image_URL"
              multiple
              onChange={handleFileChange}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              Formatos soportados: JPG, PNG, WEBP. Máximo 5 imágenes.
            </p>

            <div className="mt-4 flex flex-wrap gap-4">
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
                    className="w-24 h-24 object-cover rounded border border-gray-200"
                  />
                );
              })}
            </div>
          </div>

          {/* Botón Submit */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-6">
            {isLoadingCreate || isLoadingUpdate ? (
              <div className="flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <Button className="w-full" type="submit">
                {isEdit ? 'Actualizar Producto' : 'Crear Producto'}
              </Button>
            )}
          </div>
        </Form>
        );
      }}
    </Formik>
  );
};
