'use client';

import { Card, Title, DonutChart, Metric, Text, Grid, Col } from '@tremor/react';
import { useQuery } from '@tanstack/react-query';
import { getAllLoans } from '@/services/loans';
import { getMonthlyExpenses } from '@/services/expenses';
import { formatPrice } from '@/utils';

const FinancialHealthDashboard = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { data: loansData } = useQuery({
    queryKey: ['loans'],
    queryFn: () => getAllLoans(true),
  });

  const { data: expensesData } = useQuery({
    queryKey: ['monthlyExpenses', currentMonth, currentYear],
    queryFn: () => getMonthlyExpenses(currentMonth, currentYear),
  });

  const loans = loansData?.data || [];
  const totalDebt = loans.reduce((sum, loan) => sum + loan.saldoActual, 0);
  const totalMonthlyPayments = loans.reduce((sum, loan) => sum + loan.cuotaMensual, 0);
  const totalExpenses = expensesData?.data?.total || 0;

  // TODO: Get actual inventory and sales data
  const inventoryValue = 0; // Replace with actual inventory cost
  const cashOnHand = 0; // Replace with actual cash balance
  const monthlyRevenue = 0; // Replace with actual monthly revenue

  // Calculate daily interest cost
  const dailyInterestCost = loans.reduce((sum, loan) => {
    const dailyCost = (loan.saldoActual * (loan.tasaInteresMensual / 100)) / 30;
    return sum + dailyCost;
  }, 0);

  // Reinvestment donut data
  const totalMonthlyOutflow = totalMonthlyPayments + totalExpenses;
  const reinvestmentAmount = monthlyRevenue - totalMonthlyOutflow;
  
  const donutData = [
    {
      name: 'Pago de Deuda',
      value: totalMonthlyPayments,
      color: 'red',
    },
    {
      name: 'Gastos Operativos',
      value: totalExpenses,
      color: 'orange',
    },
    {
      name: 'Reinversión',
      value: Math.max(0, reinvestmentAmount),
      color: 'green',
    },
  ].filter(item => item.value > 0);

  // Financial health score
  const assets = inventoryValue + cashOnHand;
  const netWorth = assets - totalDebt;
  const healthPercentage = assets > 0 ? ((netWorth / assets) * 100) : 0;

  return (
    <Card>
      <Title>Dashboard de Salud Financiera</Title>
      
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">
        {/* Reinvestment Donut */}
        <Col numColSpanMd={2} numColSpanLg={1}>
          <Card decoration="top" decorationColor="blue">
            <Title>Destino de Utilidad</Title>
            <DonutChart
              data={donutData}
              category="value"
              index="name"
              valueFormatter={(value) => formatPrice(value)}
              colors={['red', 'orange', 'green']}
              className="mt-6"
            />
          </Card>
        </Col>

        {/* Debt Cost Metric */}
        <Col>
          <Card decoration="top" decorationColor="red">
            <Title>Costo de Deuda Hoy</Title>
            <Text className="mt-2 text-xs">Dinero perdido solo en intereses</Text>
            <Metric className="mt-4 text-red-600 dark:text-red-400">
              {formatPrice(dailyInterestCost)}
            </Metric>
            <Text className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Por día
            </Text>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded">
              <Text className="text-xs">Proyección Mensual</Text>
              <Text className="font-semibold text-red-600 dark:text-red-400">
                {formatPrice(dailyInterestCost * 30)}
              </Text>
            </div>
          </Card>
        </Col>

        {/* Inventory vs Debt */}
        <Col>
          <Card decoration="top" decorationColor={healthPercentage >= 0 ? 'green' : 'red'}>
            <Title>Salud Financiera</Title>
            <div className="mt-4 space-y-3">
              <div>
                <Text className="text-xs text-gray-600 dark:text-gray-400">Activos</Text>
                <Text className="font-semibold text-green-600 dark:text-green-400">
                  {formatPrice(assets)}
                </Text>
                <Text className="text-xs mt-1">
                  Inventario: {formatPrice(inventoryValue)} + Efectivo: {formatPrice(cashOnHand)}
                </Text>
              </div>
              <div>
                <Text className="text-xs text-gray-600 dark:text-gray-400">Pasivos</Text>
                <Text className="font-semibold text-red-600 dark:text-red-400">
                  {formatPrice(totalDebt)}
                </Text>
              </div>
              <div className="pt-3 border-t dark:border-gray-600">
                <Text className="text-xs text-gray-600 dark:text-gray-400">Patrimonio Neto</Text>
                <Metric className={netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {formatPrice(netWorth)}
                </Metric>
                <Text className="text-xs mt-2">
                  {healthPercentage >= 0 ? '✅' : '⚠️'} {healthPercentage.toFixed(1)}% de salud
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Debt Summary */}
        <Col numColSpanMd={2} numColSpanLg={3}>
          <Card>
            <Title>Resumen de Deudas Activas</Title>
            {loans.length === 0 ? (
              <Text className="mt-4 text-gray-500">No hay deudas activas</Text>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loans.map((loan) => (
                  <div key={loan._id} className="p-3 border rounded dark:border-gray-600">
                    <Text className="font-semibold">{loan.descripcion}</Text>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Saldo:</span>
                        <span className="font-semibold text-red-600">{formatPrice(loan.saldoActual)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tasa:</span>
                        <span>{loan.tasaInteresMensual}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cuota:</span>
                        <span>{formatPrice(loan.cuotaMensual)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Grid>
    </Card>
  );
};

export default FinancialHealthDashboard;
