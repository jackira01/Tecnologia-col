'use client';

import { useState } from 'react';
import { Title, Card as TremorCard } from '@tremor/react';
import { Card, Button, TextInput, Label, Select } from 'flowbite-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createLoan, getAllLoans, updateLoan, deleteLoan } from '@/services/loans';
import toast from 'react-hot-toast';
import DebtThermometer from './DebtThermometer';
import PaymentAlert from './PaymentAlert';
import { formatPrice } from '@/utils';
import { CurrencyField } from '../../Forms/CustomComponents/CustomInputs';

const DebtManagement = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    montoInicial: '',
    saldoActual: '',
    tasaInteresMensual: '',
    fechaCorte: 23,
    cuotaMensual: '',
    fechaInicio: '',
    descripcion: '',
  });

  const { data: loansData, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: () => getAllLoans(true),
  });

  const createMutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries(['loans']);
      toast.success('Préstamo creado exitosamente');
      setShowForm(false);
      resetForm();
    },
    onError: () => {
      toast.error('Error al crear el préstamo');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries(['loans']);
      toast.success('Préstamo desactivado');
    },
    onError: () => {
      toast.error('Error al desactivar el préstamo');
    },
  });

  const resetForm = () => {
    setFormData({
      montoInicial: '',
      saldoActual: '',
      tasaInteresMensual: '',
      fechaCorte: 23,
      cuotaMensual: '',
      fechaInicio: '',
      descripcion: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const loans = loansData?.data || [];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Gestión de Deuda - "El Banco"</Title>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Agregar Préstamo'}
        </Button>
      </div>

      {/* Payment Alert */}
      {loans.length > 0 && <PaymentAlert loans={loans} />}

      {/* Add Loan Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg dark:border-gray-600">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <TextInput
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </div>
            <div>
              <CurrencyField
                keyValue="montoInicial"
                valueForm={formData.montoInicial}
                setFieldValue={(key, value) => setFormData({ ...formData, montoInicial: value })}
                labelName="Monto Inicial"
              />
            </div>
            <div>
              <CurrencyField
                keyValue="saldoActual"
                valueForm={formData.saldoActual}
                setFieldValue={(key, value) => setFormData({ ...formData, saldoActual: value })}
                labelName="Saldo Actual"
              />
            </div>
            <div>
              <Label htmlFor="tasaInteresMensual">Tasa Interés Mensual (%)</Label>
              <TextInput
                id="tasaInteresMensual"
                type="number"
                step="0.1"
                value={formData.tasaInteresMensual}
                onChange={(e) => setFormData({ ...formData, tasaInteresMensual: e.target.value })}
                required
              />
            </div>
            <div>
              <CurrencyField
                keyValue="cuotaMensual"
                valueForm={formData.cuotaMensual}
                setFieldValue={(key, value) => setFormData({ ...formData, cuotaMensual: value })}
                labelName="Cuota Mensual"
              />
            </div>
            <div>
              <Label htmlFor="fechaCorte">Día de Corte</Label>
              <TextInput
                id="fechaCorte"
                type="number"
                min="1"
                max="31"
                value={formData.fechaCorte}
                onChange={(e) => setFormData({ ...formData, fechaCorte: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <TextInput
                id="fechaInicio"
                type="date"
                value={formData.fechaInicio}
                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={createMutation.isLoading}>
            {createMutation.isLoading ? 'Creando...' : 'Crear Préstamo'}
          </Button>
        </form>
      )}

      {/* Loans List */}
      {isLoading ? (
        <p>Cargando préstamos...</p>
      ) : loans.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay préstamos activos</p>
      ) : (
        <div className="space-y-4">
          {loans.map((loan) => (
            <div key={loan._id} className="border rounded-lg p-4 dark:border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{loan.descripcion}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tasa: {loan.tasaInteresMensual}% mensual | Corte: Día {loan.fechaCorte}
                  </p>
                </div>
                <Button
                  size="xs"
                  color="failure"
                  onClick={() => deleteMutation.mutate(loan._id)}
                >
                  Desactivar
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Monto Inicial</p>
                  <p className="font-semibold">{formatPrice(loan.montoInicial)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Saldo Actual</p>
                  <p className="font-semibold text-red-600">{formatPrice(loan.saldoActual)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cuota Mensual</p>
                  <p className="font-semibold">{formatPrice(loan.cuotaMensual)}</p>
                </div>
              </div>
              
              {/* Debt Thermometer */}
              <DebtThermometer loan={loan} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default DebtManagement;
