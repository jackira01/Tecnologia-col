'use client';

import { Card, Title, Metric, Text } from '@tremor/react';
import { useQuery } from '@tanstack/react-query';
import { getMonthlyExpenses } from '@/services/expenses';
import { getAllLoans } from '@/services/loans';
import { formatPrice } from '@/utils';

const MonthlyCashFlow = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const { data: expensesData } = useQuery({
    queryKey: ['monthlyExpenses', currentMonth, currentYear],
    queryFn: () => getMonthlyExpenses(currentMonth, currentYear),
  });

  const { data: loansData } = useQuery({
    queryKey: ['loans'],
    queryFn: () => getAllLoans(true),
  });

  // TODO: Get actual sales data from your existing insights/analytics
  // For now, this is a placeholder
  const grossProfit = 0; // Replace with actual gross profit from sales

  const totalExpenses = expensesData?.data?.total || 0;
  const loans = loansData?.data || [];
  const totalDebtPayments = loans.reduce((sum, loan) => sum + loan.cuotaMensual, 0);

  const netProfit = grossProfit - totalExpenses - totalDebtPayments;

  return (
    <Card>
      <Title>Caja Mensual</Title>
      <Text className="mb-4">
        {new Date(currentYear, currentMonth - 1).toLocaleDateString('es-CO', {
          month: 'long',
          year: 'numeric',
        })}
      </Text>

      <div className="space-y-4">
        {/* Gross Profit */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Utilidad Bruta (Ventas)</Text>
          <Metric className="text-green-600 dark:text-green-400">
            {formatPrice(grossProfit)}
          </Metric>
        </div>

        {/* Expenses */}
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Gastos Operativos</Text>
          <Metric className="text-orange-600 dark:text-orange-400">
            - {formatPrice(totalExpenses)}
          </Metric>
        </div>

        {/* Debt Payments */}
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Pagos de Deuda</Text>
          <Metric className="text-red-600 dark:text-red-400">
            - {formatPrice(totalDebtPayments)}
          </Metric>
        </div>

        {/* Net Profit */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <Text className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
            Utilidad Real (Neta)
          </Text>
          <Metric className={netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}>
            {formatPrice(netProfit)}
          </Metric>
        </div>

        {/* Breakdown */}
        {expensesData?.data?.byCategory && (
          <div className="pt-3 border-t dark:border-gray-600">
            <Text className="text-xs font-semibold mb-2">Desglose de Gastos</Text>
            <div className="space-y-1">
              {expensesData.data.byCategory.map((category) => (
                <div key={category._id} className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{category._id}:</span>
                  <span className="font-semibold">{formatPrice(category.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MonthlyCashFlow;
