import React from 'react';
import CurrencyInput from 'react-currency-input-field';

export const CustomCurrencyInput = (props) => {
  const commonConfig = {
    defaultValue: 0,
    decimalsLimit: 2,
    decimalSeparator: '.',
    groupSeparator: ',',
    prefix: '$',
    intlConfig: { locale: 'en-US', currency: 'USD' },
  };

  return (
    <CurrencyInput
      className="bg-inherit text-gray-900 dark:text-white h-[42px] rounded-lg md:w-[175px] border-gray-600 "
      {...commonConfig}
      {...props}
    />
  );
};
