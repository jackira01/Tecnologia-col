import { Label, TextInput } from 'flowbite-react';
import { CustomCurrencyInput } from './CustomCurrencyInput';

export const CurrencyField = ({
  keyValue,
  valueForm,
  setFieldValue,
  labelName,
  error_message,
}) => (
  <div className="mb-2 block">
    <Label htmlFor={keyValue} className="text-base">
      {labelName}
    </Label>
    <CustomCurrencyInput
      id={keyValue}
      onValueChange={(value, name, values) => {
        setFieldValue(keyValue, value);
      }}
      value={valueForm}
    />
    {error_message && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        {error_message}
      </p>
    )}
  </div>
);

export const TextInputField = ({
  keyValue,
  valueForm,
  setFieldValue,
  labelName,
  error_message,
  type = 'text',
}) => (
  <div className="mb-2 block">
    <Label htmlFor={keyValue} className="text-base">
      {labelName}
    </Label>
    <TextInput
      id={keyValue}
      placeholder={labelName}
      type={type}
      name={keyValue}
      onChange={(e) => setFieldValue(keyValue, e.target.value)}
      value={valueForm}
      helpertext={
        <span className="font-medium text-yellow-300">{error_message}</span>
      }
    />
  </div>
);
