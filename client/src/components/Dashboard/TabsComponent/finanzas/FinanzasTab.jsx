'use client';

import { Grid, Col, Card, Title } from '@tremor/react';
import DebtManagement from './DebtManagement';
import ExpenseTracking from './ExpenseTracking';
import FinancialHealthDashboard from './FinancialHealthDashboard';
import MonthlyCashFlow from './MonthlyCashFlow';

const FinanzasTab = () => {
  return (
    <div className="space-y-6 p-4">
      <Title>Control Financiero Total</Title>
      
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        {/* Gestión de Deuda */}
        <Col numColSpanMd={2} numColSpanLg={2}>
          <DebtManagement />
        </Col>

        {/* Caja Mensual */}
        <Col numColSpanMd={2} numColSpanLg={1}>
          <MonthlyCashFlow />
        </Col>

        {/* Gastos Operativos */}
        <Col numColSpanMd={2} numColSpanLg={2}>
          <ExpenseTracking />
        </Col>

        {/* Dashboard de Salud Financiera */}
        <Col numColSpanMd={2} numColSpanLg={3}>
          <FinancialHealthDashboard />
        </Col>
      </Grid>
    </div>
  );
};

export default FinanzasTab;
