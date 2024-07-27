"use client";

import {
	Button,
	FileInput,
	HR,
	Label,
	Modal,
	Select,
	TextInput,
} from "flowbite-react";
import { useForm } from "react-hook-form";

export const ModalForm = ({ openModal, setOpenModal }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data) => console.log(data);
	return (
		<>
			<Modal
				show={openModal}
				size="md"
				popup
				onClose={() => setOpenModal(false)}
			>
				<Modal.Header />
				<Modal.Body >
					<form
						className="grid grid-cols-2 gap-4"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="mb-2 block">
							<Label htmlFor="name" value="Nombre" />
							<TextInput
								id="name"
								type="text"
								placeholder="coloca un nombre..."
								required
								{...register("name", { required: true })}
							/>
						</div>
						<div className="mb-2 block">
							<Label htmlFor="price_buy" value="Precio de Compra" />
							<TextInput
								id="price_buy"
								type="text"
								placeholder="Precio de compra..."
								required
								{...register("price_buy", { required: true })}
							/>
						</div>
						<div className="mb-2 block">
							<Label htmlFor="price_minimun" value="Precio Minimo" />
							<TextInput
								id="price_minimun"
								type="text"
								placeholder="Precio Minimo..."
								required
								{...register("price_minimun", { required: true })}
							/>
						</div>
						<div className="mb-2 block">
							<Label htmlFor="price_sale" value="Precio de Venta" />
							<TextInput
								id="price_sale"
								type="text"
								placeholder="Precio de Venta..."
								required
								{...register("price_sale", { required: true })}
							/>
						</div>
						<div className="mb-2 block lg:col-span-2">
							<Label htmlFor="file" value="Upload file" />
							<FileInput id="file" helperText="Coloca imagenes sin fondo" />
						</div>

						{/* DIVISOR */}
						<div className="col-span-2 text-lg text-white font-bold font-sans">
							<h2>Especificaciones</h2>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="pruduct_status" value="Estado" />
							<Select
								id="pruduct_status"
								required
								{...register("pruduct_status", { required: true })}
							>
								<option value="nuevo">Nuevo</option>
								<option value="usado">Usado</option>
							</Select>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="so" value="Sistema Operativo" />
							<Select required id="so" {...register("so", { required: true })}>
								<option value="Windows 7">Windows 7</option>
								<option value="Windows 8">Windows 8</option>
								<option value="Windows 10">Windows 10</option>
								<option value="Windows 11">Windows 11</option>
							</Select>
						</div>

						{/* PARSEARLO A MAYUSCULAS EN EL BACK */}
						<div className="mb-2 block">
							<Label htmlFor="brand" value="Marca" />
							<TextInput
								id="brand"
								type="text"
								placeholder="SAMSUNG..."
								required
								{...register("brand", { required: true })}
							/>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="ram_size" value="Tamaño de Ram" />
							<Select
								required
								id="ram_size"
								{...register("ram_size", { required: true })}
							>
								<option value="2RAM">2 RAM</option>
								<option value="4RAM">4 RAM</option>
								<option value="6RAM">6 RAM</option>
								<option value="8RAM">8 RAM</option>
								<option value="10RAM">10 RAM</option>
								<option value="12RAM">12 RAM</option>
								<option value="14RAM">14 RAM</option>
								<option value="16RAM">16 RAM</option>
							</Select>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="ram_type" value="Tipo de Ram" />
							<Select
								required
								id="ram_type"
								{...register("ram_type", { required: true })}
							>
								<option>DDR2</option>
								<option>DDR3</option>
								<option>DDR4</option>
							</Select>
						</div>

						<div className="mb-2 block">
							<Label
								required
								htmlFor="storage_size"
								value="Tamaño de almacen"
							/>
							<Select
								id="storage_size"
								{...register("storage_size", { required: true })}
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
							<Label htmlFor="cpu_brand" value="Marca de CPU" />
							<TextInput
								id="cpu_brand"
								type="text"
								placeholder="Intel..."
								required
								{...register("cpu_brand", { required: true })}
							/>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="cpu_model" value="Modelo de CPU" />
							<TextInput
								id="processor_model"
								type="text"
								placeholder="Celeron..."
								required
								{...register("cpu_model", { required: true })}
							/>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="charger" value="Cargador" />
							<Select
								required
								id="charger"
								{...register("charger", { required: true })}
							>
								<option value={true}>Con Cargador</option>
								<option value={false}>Sin Cargador</option>
							</Select>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="battery" value="Bateria" />
							<Select
								required
								id="battery"
								{...register("battery", { required: true })}
							>
								<option value={true}>Con Bateria</option>
								<option value={false}>Sin Bateria</option>
							</Select>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="screen_size" value="Pulgadas de Pantalla" />
							<TextInput
								id="screen_size"
								type="number"
								{...register("screen_size")}
							/>
						</div>

						<div className="mb-2 block">
							<Label htmlFor="specification_URL" value="Link del producto" />
							<TextInput
								id="specification_URL"
								type="text"
								placeholder="mercadolibre.com..."
								{...register("specification_URL")}
							/>
						</div>

						<div className="mb-2 block col-span-2">
							<Label htmlFor="description" value="Descripcion" />
							<TextInput
								id="description"
								type="text"
								sizing="lg"
								{...register("description")}
							/>
						</div>

						<Button type="submit">Crear Producto</Button>
					</form>
				</Modal.Body>
			</Modal>
		</>
	);
};
