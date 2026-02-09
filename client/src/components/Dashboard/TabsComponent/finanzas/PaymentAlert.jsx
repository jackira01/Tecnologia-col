'use client';

import { Callout } from '@tremor/react';
import { formatPrice } from '@/utils';

const PaymentAlert = ({ loans }) => {
  const today = new Date();
  const currentDay = today.getDate();

  // Find loans with upcoming payment dates
  const upcomingPayments = loans.filter((loan) => {
    const daysUntilPayment = loan.fechaCorte - currentDay;
    // Alert 5 days before payment date
    return daysUntilPayment > 0 && daysUntilPayment <= 5;
  });

  if (upcomingPayments.length === 0) return null;

  const totalDue = upcomingPayments.reduce((sum, loan) => sum + loan.cuotaMensual, 0);
  const closestPayment = upcomingPayments.reduce((closest, loan) => {
    const daysUntil = loan.fechaCorte - currentDay;
    const closestDays = closest.fechaCorte - currentDay;
    return daysUntil < closestDays ? loan : closest;
  });

  const daysRemaining = closestPayment.fechaCorte - currentDay;

  return (
    <Callout
      title="⚠️ Pago Próximo"
      color="orange"
      className="mb-4"
    >
      <p className="mt-2">
        Tienes <span className="font-bold">{upcomingPayments.length}</span>{' '}
        {upcomingPayments.length === 1 ? 'pago pendiente' : 'pagos pendientes'} en los próximos{' '}
        <span className="font-bold">{daysRemaining}</span>{' '}
        {daysRemaining === 1 ? 'día' : 'días'}.
      </p>
      <p className="mt-1 text-lg font-bold">
        Total a pagar: {formatPrice(totalDue)}
      </p>
      <div className="mt-3 space-y-1">
        {upcomingPayments.map((loan) => (
          <div key={loan._id} className="text-sm">
            • {loan.descripcion}: {formatPrice(loan.cuotaMensual)} (Día {loan.fechaCorte})
          </div>
        ))}
      </div>
    </Callout>
  );
};

export default PaymentAlert;
