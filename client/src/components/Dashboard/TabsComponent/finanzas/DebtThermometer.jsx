'use client';

import { useState } from 'react';
import { ProgressBar, Text, Metric } from '@tremor/react';
import { TextInput, Label, Button } from 'flowbite-react';
import { useMutation } from '@tanstack/react-query';
import { simulatePayment } from '@/services/loans';
import { formatPrice } from '@/utils';
import toast from 'react-hot-toast';
import { CurrencyField } from '../../Forms/CustomComponents/CustomInputs';

const DebtThermometer = ({ loan }) => {
  const [extraPayment, setExtraPayment] = useState('');
  const [simulation, setSimulation] = useState(null);

  const simulateMutation = useMutation({
    mutationFn: ({ loanId, extraPayment }) => simulatePayment(loanId, extraPayment),
    onSuccess: (response) => {
      setSimulation(response.data);
    },
    onError: () => {
      toast.error('Error al simular el pago');
    },
  });

  const handleSimulate = () => {
    const amount = parseFloat(extraPayment);
    if (!amount || amount <= 0) {
      toast.error('Ingresa un monto válido');
      return;
    }
    if (amount > loan.saldoActual) {
      toast.error('El abono no puede ser mayor al saldo actual');
      return;
    }
    simulateMutation.mutate({ loanId: loan._id, extraPayment: amount });
  };

  const percentagePaid = ((loan.montoInicial - loan.saldoActual) / loan.montoInicial) * 100;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 className="font-semibold mb-3">Termómetro de Abonos</h4>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <Text>Progreso de Pago</Text>
          <Text>{percentagePaid.toFixed(1)}%</Text>
        </div>
        <ProgressBar value={percentagePaid} color="emerald" className="mt-2" />
      </div>

      {/* Simulation Input */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="col-span-2">
          <CurrencyField
            keyValue={`extra-payment-${loan._id}`}
            valueForm={extraPayment}
            setFieldValue={(key, value) => setExtraPayment(value)}
            labelName="Abono Extra"
          />
        </div>
        <div className="flex items-end">
          <Button
            size="sm"
            onClick={handleSimulate}
            disabled={simulateMutation.isLoading}
            className="w-full"
          >
            {simulateMutation.isLoading ? 'Calculando...' : 'Simular'}
          </Button>
        </div>
      </div>

      {/* Simulation Results */}
      {simulation && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h5 className="font-semibold text-green-800 dark:text-green-300 mb-2">
            💰 Resultados de la Simulación
          </h5>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Ahorro en Intereses</p>
              <p className="font-bold text-green-600 dark:text-green-400">
                {formatPrice(simulation.interestSaved)}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Meses Reducidos</p>
              <p className="font-bold text-green-600 dark:text-green-400">
                {simulation.monthsReduced} {simulation.monthsReduced === 1 ? 'mes' : 'meses'}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Nuevo Saldo</p>
              <p className="font-semibold">{formatPrice(simulation.newBalance)}</p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Nueva Fecha de Pago Final</p>
              <p className="font-semibold">
                {new Date(simulation.newPayoffDate).toLocaleDateString('es-CO')}
              </p>
            </div>
          </div>
          {simulation.message && (
            <p className="mt-2 text-sm font-semibold text-green-700 dark:text-green-300">
              {simulation.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DebtThermometer;
