"use client";

import { useState } from "react";

import axios from "axios";
import {
	Button,
	FileInput,
	Label,
	Select,
	Spinner,
	TextInput,
} from "flowbite-react";
import { Field, Form, Formik } from "formik";
import { CustomCurrencyInput } from "./CustomComponents/CustomCurrencyInput";
import { defaultValuesForm } from "@/utils";
import { CurrencyField, TextInputField } from "./CustomComponents/CustomInputs";

export const FormComponent = () => {
	const [image, setImage] = useState(null);
	const [cloudLoader, setCloudLoader] = useState(false);

	const handleImageChange = (e) => {
		setImage(e.target.files[0]);
	};

	const uploadImage = async () => {
		setCloudLoader(true);
		const formData = new FormData();
		formData.append("file", image);
		formData.append("upload_preset", "tecnologia col");

		const response = await axios.post(
			"https://api.cloudinary.com/v1_1/di6qf8c06/image/upload",
			formData,
		);

		// Usando setValue para actualizar el valor del input
		setValue("imageUrl", response.data.secure_url);

		console.log("response", response.data.secure_url);

		setCloudLoader(false);
	};

	const onSubmit = async (data) => {
		// await uploadImage();
		console.log(data);
		// createProducts(parseData(data));
	};
	return (
		<Formik
			initialValues={defaultValuesForm}
			className="grid grid-cols-2 gap-4 "
			onSubmit={onSubmit}
		>
			{({ values, errors, handleChange, handleSubmit, setFieldValue }) => (
				<Form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
					<TextInputField
						keyValue={"name"}
						valueForm={values.name.value}
						setFieldValue={setFieldValue}
						labelName={"Nombre de Producto"}
					/>

					<CurrencyField
						keyValue={"price_buy"}
						valueForm={values.price_buy.value}
						setFieldValue={setFieldValue}
						labelName={"Precio De Compra"}
					/>

					<CurrencyField
						keyValue={"price_minimun"}
						valueForm={values.price_minimun.value}
						setFieldValue={setFieldValue}
						labelName={"Precio Minimo"}
					/>

					<CurrencyField
						keyValue={"price_sale"}
						valueForm={values.price_sale.value}
						setFieldValue={setFieldValue}
						labelName={"Precio De Venta"}
					/>

					<div className="mb-2 block lg:col-span-2">
						<Label htmlFor="image" value="Upload file" className="text-base" />
						<FileInput
							id="image"
							name="image_URL"
							helperText="Coloca imagenes sin fondo"
							onChange={handleImageChange}
							value={values.image_URL}
						/>
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
							onChange={(e) => setFieldValue("product_status", e.target.value)}
							value={values.product_status}
						>
							<option selected value="nuevo">Nuevo</option>
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
							onChange={(e) => setFieldValue("so", e.target.value)}
							value={values.so}
						>
							<option value="Windows 7">Windows 7</option>
							<option value="Windows 8">Windows 8</option>
							<option selected value="Windows 10">Windows 10</option>
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
							onChange={(e) => setFieldValue("ram_size", e.target.value)}
							value={values.ram_size}
						>
							<option value="2GB">2 RAM</option>
							<option selected value="4GB">4 RAM</option>
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
							onChange={(e) => setFieldValue("ram_type", e.target.value)}
							value={values.ram_type}
						>
							<option>DDR2</option>
							<option >DDR3</option>
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
							onChange={(e) => setFieldValue("storage_size", e.target.value)}
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
							onChange={(e) => setFieldValue("storage_type", e.target.value)}
							value={values.storage_type}
						>
							<option value="SSD">SSD</option>
							<option value="HDD">HDD</option>
						</Select>
					</div>

					<TextInputField
						keyValue={"cpu_brand"}
						valueForm={values.cpu_brand}
						setFieldValue={setFieldValue}
						labelName={"Marca de CPU"}
					/>

					<TextInputField
						keyValue={"cpu_model"}
						valueForm={values.cpu_model}
						setFieldValue={setFieldValue}
						labelName={"Modelo de CPU"}
					/>

					<TextInputField
						keyValue={"brand"}
						valueForm={values.brand}
						setFieldValue={setFieldValue}
						labelName={"Marca De Portatil"}
					/>

					<div className="mb-2 block">
						<Label htmlFor="charger" value="Cargador" className="text-base" />
						<Select
							required
							id="charger"
							name="charger"
							onChange={(e) => setFieldValue("charger", e.target.value)}
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
							onChange={(e) => setFieldValue("battery", e.target.value)}
							value={values.battery}
						>
							<option value={true}>Con Bateria</option>
							<option value={false}>Sin Bateria</option>
						</Select>
					</div>

					<TextInputField
						keyValue={"screen_size"}
						valueForm={values.screen_size}
						setFieldValue={setFieldValue}
						labelName={"Pulgadas de Pantalla"}
					/>

					<TextInputField
						keyValue={"specification_URL"}
						valueForm={values.specification_URL}
						setFieldValue={setFieldValue}
						labelName={"Referecia del producto"}
					/>

					<TextInputField
						keyValue={"description"}
						valueForm={values.description}
						setFieldValue={setFieldValue}
						labelName={"Descripcion"}
					/>

					{errors && console.log(errors)}
					<Button className="col-span-2" type="submit">
						Crear Producto
					</Button>
				</Form>
			)}
		</Formik>
	);
};
