'use client';

import { useState } from 'react';
import { Title } from '@tremor/react';
import { Card, Button, TextInput, Label, Select } from 'flowbite-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createExpense, getAllExpenses, deleteExpense } from '@/services/expenses';
import toast from 'react-hot-toast';
import { formatPrice } from '@/utils';
import { CurrencyField } from '../../Forms/CustomComponents/CustomInputs';

const CATEGORIES = {
  transporte: 'Transporte/Gasolina',
  servicios: 'Servicios (Internet/Celular)',
  repuestos: 'Repuestos Generales',
  publicidad: 'Publicidad',
  seguros: 'Seguros Nequi',
  otros: 'Otros',
};

const ExpenseTracking = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    categoria: 'transporte',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
  });

  const { data: expensesData, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => getAllExpenses(),
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      toast.success('Gasto registrado exitosamente');
      setShowForm(false);
      resetForm();
    },
    onError: () => {
      toast.error('Error al registrar el gasto');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expenses']);
      toast.success('Gasto eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar el gasto');
    },
  });

  const resetForm = () => {
    setFormData({
      monto: '',
      categoria: 'transporte',
      descripcion: '',
      fecha: new Date().toISOString().split('T')[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const expenses = expensesData?.data || [];

  // Calculate totals by category
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.categoria] = (acc[expense.categoria] || 0) + expense.monto;
    return acc;
  }, {});

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.monto, 0);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title>Gastos de Operación</Title>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Agregar Gasto'}
        </Button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg dark:border-gray-600">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                required
              >
                {Object.entries(CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <CurrencyField
                keyValue="monto"
                valueForm={formData.monto}
                setFieldValue={(key, value) => setFormData({ ...formData, monto: value })}
                labelName="Monto"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <TextInput
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha</Label>
              <TextInput
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>
          </div>
          <Button type="submit" disabled={createMutation.isLoading}>
            {createMutation.isLoading ? 'Registrando...' : 'Registrar Gasto'}
          </Button>
        </form>
      )}

      {/* Category Summary */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-3">Resumen por Categoría</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">{label}:</span>
              <span className="font-semibold">{formatPrice(categoryTotals[key] || 0)}</span>
            </div>
          ))}
          <div className="col-span-2 border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Total:</span>
            <span>{formatPrice(totalExpenses)}</span>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      {isLoading ? (
        <p>Cargando gastos...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay gastos registrados</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="flex justify-between items-center p-3 border rounded dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                    {CATEGORIES[expense.categoria]}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(expense.fecha).toLocaleDateString('es-CO')}
                  </span>
                </div>
                <p className="text-sm mt-1">{expense.descripcion}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatPrice(expense.monto)}</span>
                <Button
                  size="xs"
                  color="failure"
                  onClick={() => deleteMutation.mutate(expense._id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ExpenseTracking;
