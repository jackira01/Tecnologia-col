import { Field } from "formik";
import { CustomCurrencyInput } from "./CustomCurrencyInput";
import { Label, TextInput } from "flowbite-react";

export const CurrencyField = ({
	keyValue,
	valueForm,
	setFieldValue,
	labelName,
}) => (
	<div className="mb-2 block">
		<Label htmlFor={keyValue} value={labelName} className="text-base" />
		<CustomCurrencyInput
			onValueChange={(value, name, values) => {
				setFieldValue(keyValue, {
					value: value,
					formattedValue: values.formatted,
				});
			}}
			value={valueForm}
		/>
	</div>
);

export const TextInputField = ({
	keyValue,
	valueForm,
	setFieldValue,
	labelName,
}) => (
	<div className="mb-2 block">
		<Label htmlFor={keyValue} value={labelName} className="text-base" />
		<TextInput
			id={labelName}
			type="text"
			name={keyValue}
			onChange={(e) => setFieldValue(keyValue, e.target.value)}
			value={valueForm}
		/>
	</div>
);
