import { getSalesSummary } from '@/services/products';
import { getCapitalTransactions, createCapitalTransaction } from '@/services/capital';
import { formatPrice } from '@/utils';
import { diffDays } from '@formkit/tempo';
import {
  AreaChart,
  BarChart,
  Card,
  DonutChart,
  Grid,
  Metric,
  Text,
  Title,
  Flex,
  BadgeDelta,
  ProgressBar,
} from '@tremor/react';
import { Button, Modal, ModalHeader, ModalBody, Label, TextInput, Select, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const AnalyticsTab = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    netUtility: 0,
    avgSalesSpeed: 0,
    roi: 0,
    marketplaceEfficiency: 0,
    inventoryValue: 0,
    liquidCapital: 0,
    totalPatrimony: 0,
  });
  const [charts, setCharts] = useState({
    barData: [],
    areaData: [],
    donutData: [],
    velocityScores: [],
  });

  // Capital Adjustment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adjustmentForm, setAdjustmentForm] = useState({
    type: 'INJECTION',
    amount: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      const [products, capitalData] = await Promise.all([
        getSalesSummary(),
        getCapitalTransactions(),
      ]);

      if (products && Array.isArray(products)) {
        calculateMetrics(products, capitalData?.totalCapital || 0);
      }
    } catch (error) {
      console.error('Error calculating metrics:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateMetrics = (products, liquidCapital) => {
    const soldProducts = products.filter(
      (p) =>
        p.disponibility === 'vendido' &&
        p.price?.soldOn > 0 &&
        p.timeline?.soldAt
    );

    const availableProducts = products.filter(
        (p) => p.disponibility === 'disponible'
    );

    // Calculate Inventory Value (Patrimonio en Productos)
    const inventoryValue = availableProducts.reduce((sum, p) => sum + (p.price?.buy || 0), 0);
    const totalPatrimony = inventoryValue + liquidCapital;

    // 1. KPI: Utilidad Total Neta
    let totalRevenue = 0;
    let totalCost = 0;
    let totalExpenses = 0;

    const areaChartMap = {};

    soldProducts.forEach((p) => {
      const buyPrice = p.price?.buy || 0;
      const soldPrice = p.price?.soldOn || 0;
      const expenses = p.price?.otherExpenses || 0;

      totalRevenue += soldPrice;
      totalCost += buyPrice;
      totalExpenses += expenses;

      // Area Chart Data Preparation
      const dateKey = new Date(p.timeline.soldAt).toLocaleDateString('en-CA'); // YYYY-MM-DD
      const utility = soldPrice - buyPrice - expenses;

      if (!areaChartMap[dateKey]) {
        areaChartMap[dateKey] = 0;
      }
      areaChartMap[dateKey] += utility;
    });

    const netUtility = totalRevenue - totalCost - totalExpenses;

    // 2. KPI: Velocidad de Venta Promedio
    let totalDays = 0;
    let validSpeedCount = 0;

    soldProducts.forEach((p) => {
      if (p.timeline?.publishedAt && p.timeline?.soldAt) {
        // Usar Math.abs() porque las fechas pueden estar en orden incorrecto
        const days = Math.abs(diffDays(p.timeline.publishedAt, p.timeline.soldAt));
        if (days >= 0) {
          totalDays += days;
          validSpeedCount++;
        }
      }
    });

    const avgSalesSpeed =
      validSpeedCount > 0 ? Math.round(totalDays / validSpeedCount) : 0;

    // 3. KPI: ROI Promedio
    const totalInvestment = totalCost + totalExpenses;
    const roi =
      totalInvestment > 0 ? ((netUtility / totalInvestment) * 100).toFixed(1) : 0;

    // 4. KPI: Eficiencia Marketplace (Global)
    let totalMessages = 0;
    let totalViews = 0;

    products.forEach((p) => {
      totalMessages += p.metrics?.fbMessages || 0;
      totalViews += p.metrics?.fbViews || 0;
    });

    const efficiency =
      totalViews > 0 ? ((totalMessages / totalViews) * 100).toFixed(2) : 0;

    // --- Charts Data ---

    // BarChart: Vistas vs Mensajes (Top 10 Sold Products by interest)
    const barData = soldProducts
      .map((p) => ({
        name: p.name,
        Vistas: p.metrics?.fbViews || 0,
        Mensajes: p.metrics?.fbMessages || 0,
      }))
      .sort((a, b) => b.Vistas - a.Vistas)
      .slice(0, 10);

    // AreaChart: Crecimiento de Utilidad
    const areaData = Object.keys(areaChartMap)
      .sort()
      .map((date) => ({
        date,
        Utilidad: areaChartMap[date],
      }));

    // DonutChart: Distribución por Marca (Available Inventory)
    const brandMap = {};
    availableProducts.forEach((p) => {
      const brand = p.specification?.brand || 'Sin Marca';
      brandMap[brand] = (brandMap[brand] || 0) + 1;
    });

    const donutData = Object.keys(brandMap).map((brand) => ({
      name: brand,
      value: brandMap[brand],
    }));

    // Velocity Scores (Top 5)
    const velocityScores = soldProducts
      .map((p) => {
        const utility =
          (p.price?.soldOn || 0) -
          (p.price?.buy || 0) -
          (p.price?.otherExpenses || 0);
        
        let days = 1;
        if (p.timeline?.publishedAt && p.timeline?.soldAt) {
           // Usar Math.abs() porque las fechas pueden estar en orden incorrecto
           days = Math.abs(diffDays(p.timeline.publishedAt, p.timeline.soldAt));
           if (days <= 0) days = 1; // Avoid division by zero
        }

        return {
          name: p.name,
          score: Math.round(utility / days),
          days,
          utility,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    setKpis({
      netUtility,
      avgSalesSpeed,
      roi,
      marketplaceEfficiency: efficiency,
      inventoryValue,
      liquidCapital,
      totalPatrimony,
    });

    setCharts({
      barData,
      areaData,
      donutData,
      velocityScores,
    });
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    try {
        if (!adjustmentForm.amount || !adjustmentForm.description) {
            toast.error('Completa todos los campos');
            return;
        }

        await createCapitalTransaction({
            ...adjustmentForm,
            amount: Number(adjustmentForm.amount)
        });
        
        toast.success('Transacción registrada');
        setIsModalOpen(false);
        setAdjustmentForm({ type: 'INJECTION', amount: '', description: '' });
        fetchData(); // Refresh data
    } catch (error) {
        console.error(error);
        toast.error('Error al registrar transacción');
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando estadísticas...</div>;

  return (
    <main className="p-4 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
            <Title>Tablero de Control de Inventario</Title>
            <Text>Métricas clave de rendimiento y estado del inventario.</Text>
        </div>
        <Button size="sm" color="dark" onClick={() => setIsModalOpen(true)}>
            Ajustar Capital
        </Button>
      </div>

      {/* Patrimonio Card (Highlight) */}
      <Card decoration="top" decorationColor="indigo">
        <Flex alignItems="start">
          <div>
            <Text>Patrimonio Total Estimado</Text>
            <Metric>{formatPrice(kpis.totalPatrimony)}</Metric>
          </div>
          <div className="text-right">
             <Text>Inventario: <b>{formatPrice(kpis.inventoryValue)}</b></Text>
             <Text>Capital Líquido: <b>{formatPrice(kpis.liquidCapital)}</b></Text>
          </div>
        </Flex>
        <ProgressBar value={(kpis.inventoryValue / (kpis.totalPatrimony || 1)) * 100} color="indigo" className="mt-4" />
        <Flex className="mt-2">
            <Text>{Math.round((kpis.inventoryValue / (kpis.totalPatrimony || 1)) * 100)}% Inventario</Text>
            <Text>{Math.round((kpis.liquidCapital / (kpis.totalPatrimony || 1)) * 100)}% Capital</Text>
        </Flex>
      </Card>

      {/* KPI Cards */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card decoration="top" decorationColor={kpis.netUtility >= 0 ? 'emerald' : 'rose'}>
          <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Utilidad Neta Total</Text>
          <Metric className={kpis.netUtility >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}>
            {formatPrice(kpis.netUtility)}
          </Metric>
        </Card>
        <Card decoration="top" decorationColor={kpis.avgSalesSpeed <= 15 ? 'emerald' : 'amber'}>
          <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Velocidad de Venta Promedio</Text>
          <Metric className={kpis.avgSalesSpeed <= 15 ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}>
            {kpis.avgSalesSpeed} días
          </Metric>
        </Card>
        <Card decoration="top" decorationColor={kpis.roi >= 20 ? 'emerald' : 'blue'}>
          <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">ROI Promedio</Text>
          <Metric className={kpis.roi >= 20 ? 'text-emerald-600 dark:text-emerald-500' : 'text-blue-600 dark:text-blue-500'}>
            {kpis.roi}%
          </Metric>
        </Card>
        <Card decoration="top" decorationColor="fuchsia">
          <Text className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Eficiencia Marketplace</Text>
          <Metric className="text-fuchsia-600 dark:text-fuchsia-500">{kpis.marketplaceEfficiency}%</Metric>
          <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">Conv. Msj / Vistas</Text>
        </Card>
      </Grid>

      {/* Charts Grid */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        {/* Area Chart: Utility Growth */}
        <Card>
          <Title>Crecimiento de Utilidad</Title>
          <AreaChart
            className="h-72 mt-4"
            data={charts.areaData}
            index="date"
            categories={['Utilidad']}
            colors={['emerald']}
            valueFormatter={(number) => formatPrice(number)}
          />
        </Card>

        {/* Bar Chart: Views vs Messages */}
        <Card>
          <Title>Interacción por Producto (Top 10)</Title>
          <BarChart
            className="h-72 mt-4"
            data={charts.barData}
            index="name"
            categories={['Vistas', 'Mensajes']}
            colors={['blue', 'violet']}
          />
        </Card>
      </Grid>

      {/* Bottom Section */}
      <Grid numItems={1} numItemsLg={2} className="gap-6">
        {/* Donut Chart: Inventory Distribution */}
        <Card className="max-w-lg">
          <Title>Inventario por Marca</Title>
          <DonutChart
            className="mt-6"
            data={charts.donutData}
            category="value"
            index="name"
            colors={['slate', 'violet', 'indigo', 'rose', 'cyan', 'amber']}
          />
        </Card>

        {/* Velocity Scores List */}
        <Card>
          <Title>Productos Más Rentables</Title>
          <Text className="mb-4 text-tremor-default text-tremor-content dark:text-dark-tremor-content">Top 5 por velocidad de ganancia (utilidad/día)</Text>
          <div className="space-y-4">
            {charts.velocityScores.map((item) => (
              <div key={item.name} className="flex items-center justify-between border-b pb-2">
                <div className='max-w-[60%]'>
                  <Text className="truncate font-medium text-slate-900 dark:text-slate-50">
                    {item.name}
                  </Text>
                  <Text className="text-xs">
                    {formatPrice(item.utility)} en {item.days} días
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <BadgeDelta deltaType="increase" isIncreasePositive={true} size="xs">
                    {item.score} pts
                  </BadgeDelta>
                </div>
              </div>
            ))}
            {charts.velocityScores.length === 0 && (
                <Text>No hay suficientes datos de ventas aun.</Text>
            )}
          </div>
        </Card>
      </Grid>

      {/* Capital Adjustment Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader>Registrar Movimiento de Capital</ModalHeader>
        <ModalBody>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="type" value="Tipo de Movimiento" />
                    </div>
                    <Select 
                        id="type" 
                        required 
                        value={adjustmentForm.type}
                        onChange={(e) => setAdjustmentForm({...adjustmentForm, type: e.target.value})}
                    >
                        <option value="INJECTION">Inyección de Capital (Sumar)</option>
                        <option value="WITHDRAWAL">Retiro/Gasto (Restar)</option>
                    </Select>
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="amount" value="Monto (COP)" />
                    </div>
                    <TextInput 
                        id="amount" 
                        type="number" 
                        placeholder="0" 
                        required 
                        value={adjustmentForm.amount}
                        onChange={(e) => setAdjustmentForm({...adjustmentForm, amount: e.target.value})}
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="description" value="Descripción / Motivo" />
                    </div>
                    <Textarea 
                        id="description" 
                        placeholder="Ej: Inversión inicial, Retiro de utilidades..." 
                        required 
                        rows={3} 
                        value={adjustmentForm.description}
                        onChange={(e) => setAdjustmentForm({...adjustmentForm, description: e.target.value})}
                    />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <Button color="gray" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button type="submit" color="blue">Registrar</Button>
                </div>
            </form>
        </ModalBody>
      </Modal>
    </main>
  );
};
