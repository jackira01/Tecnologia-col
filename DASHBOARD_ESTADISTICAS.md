# 📊 Dashboard de Estadísticas - Documentación Detallada

## Índice
- [Descripción General](#descripción-general)
- [KPIs Principales](#kpis-principales)
- [Gráficos y Visualizaciones](#gráficos-y-visualizaciones)
- [Cálculos y Fórmulas](#cálculos-y-fórmulas)
- [Fuente de Datos](#fuente-de-datos)
- [Interpretación de Métricas](#interpretación-de-métricas)

---

## Descripción General

El **Dashboard de Estadísticas** es un tablero de control integral que proporciona métricas clave de rendimiento (KPIs) y visualizaciones para analizar el desempeño del inventario de portátiles. Este sistema permite tomar decisiones informadas sobre compras, ventas y estrategias de marketing.

### Ubicación en el Sistema
- **Ruta del componente**: `client/src/components/Dashboard/TabsComponent/analitycs/AnalyticsTab.jsx`
- **Acceso**: Dashboard → Pestaña "Estadísticas"

---

## KPIs Principales

El dashboard muestra **4 indicadores clave de rendimiento** en la parte superior:

### 1. 💰 Utilidad Neta Total

**Descripción**: Ganancia total obtenida de todos los productos vendidos, después de restar costos y gastos.

**Fórmula**:
```
Utilidad Neta = Σ(Precio de Venta) - Σ(Precio de Compra) - Σ(Gastos Adicionales)
```

**Componentes**:
- **Precio de Venta** (`price.soldOn`): Precio al que se vendió el producto
- **Precio de Compra** (`price.buy`): Precio al que se adquirió el producto
- **Gastos Adicionales** (`price.otherExpenses`): Costos adicionales (envío, reparaciones, etc.)

**Indicador Visual**:
- 🟢 **Verde** (emerald): Utilidad positiva (ganancia)
- 🔴 **Rojo** (rose): Utilidad negativa (pérdida)

**Ejemplo**:
```
Producto A: Vendido en $2,000,000 - Comprado en $1,500,000 - Gastos $50,000 = $450,000
Producto B: Vendido en $1,800,000 - Comprado en $1,400,000 - Gastos $30,000 = $370,000
Utilidad Neta Total = $820,000
```

---

### 2. ⚡ Velocidad de Venta Promedio

**Descripción**: Tiempo promedio (en días) que tarda un producto en venderse desde su publicación.

**Fórmula**:
```
Velocidad Promedio = Σ(Días desde publicación hasta venta) / Número de productos vendidos
```

**Componentes**:
- **Fecha de Publicación** (`timeline.publishedAt`): Cuando se publicó el producto
- **Fecha de Venta** (`timeline.soldAt`): Cuando se vendió el producto
- **Días** = Diferencia entre ambas fechas

**Indicador Visual**:
- 🟢 **Verde** (emerald): ≤ 15 días (venta rápida)
- 🟡 **Ámbar** (amber): > 15 días (venta lenta)

**Interpretación**:
- **Menor valor** = Mejor rotación de inventario
- **Mayor valor** = Productos se quedan más tiempo en stock

**Ejemplo**:
```
Producto A: Publicado 01/01/2026 - Vendido 10/01/2026 = 9 días
Producto B: Publicado 05/01/2026 - Vendido 25/01/2026 = 20 días
Producto C: Publicado 10/01/2026 - Vendido 22/01/2026 = 12 días
Velocidad Promedio = (9 + 20 + 12) / 3 = 13.67 ≈ 14 días
```

---

### 3. 📈 ROI Promedio (Return on Investment)

**Descripción**: Retorno sobre la inversión expresado como porcentaje. Indica cuánto se gana por cada peso invertido.

**Fórmula**:
```
ROI = (Utilidad Neta / Inversión Total) × 100
```

**Componentes**:
- **Utilidad Neta**: Ganancia total (ver KPI #1)
- **Inversión Total** = Precio de Compra + Gastos Adicionales

**Indicador Visual**:
- 🟢 **Verde** (emerald): ≥ 20% (excelente retorno)
- 🔵 **Azul** (blue): < 20% (retorno moderado)

**Interpretación**:
- **ROI de 50%** = Por cada $100,000 invertidos, se ganan $50,000
- **ROI de 100%** = Se duplica la inversión

**Ejemplo**:
```
Inversión Total = $10,000,000 (compras) + $500,000 (gastos) = $10,500,000
Utilidad Neta = $3,150,000
ROI = ($3,150,000 / $10,500,000) × 100 = 30%
```

---

### 4. 🎯 Eficiencia Marketplace

**Descripción**: Tasa de conversión de vistas a mensajes en Facebook Marketplace. Mide qué tan efectivas son las publicaciones para generar interés.

**Fórmula**:
```
Eficiencia = (Total de Mensajes / Total de Vistas) × 100
```

**Componentes**:
- **Mensajes** (`metrics.fbMessages`): Número de mensajes recibidos
- **Vistas** (`metrics.fbViews`): Número de vistas del producto

**Indicador Visual**:
- 🟣 **Fucsia** (fuchsia): Color distintivo

**Interpretación**:
- **Mayor porcentaje** = Mejor engagement y publicaciones más atractivas
- **Benchmark típico**: 2-5% es considerado bueno en marketplaces

**Ejemplo**:
```
Total de Vistas = 5,000
Total de Mensajes = 150
Eficiencia = (150 / 5,000) × 100 = 3%
```

---

## Gráficos y Visualizaciones

### 📊 1. Crecimiento de Utilidad (Area Chart)

**Tipo**: Gráfico de área temporal

**Descripción**: Muestra la evolución de la utilidad acumulada a lo largo del tiempo.

**Datos Mostrados**:
- **Eje X**: Fechas de venta (formato YYYY-MM-DD)
- **Eje Y**: Utilidad en pesos colombianos (COP)
- **Color**: Verde esmeralda (emerald)

**Cálculo**:
```javascript
Para cada producto vendido:
  fecha = timeline.soldAt
  utilidad = price.soldOn - price.buy - price.otherExpenses
  
Agrupar por fecha y sumar utilidades del mismo día
```

**Utilidad**:
- Identificar períodos de mayor rentabilidad
- Detectar tendencias estacionales
- Evaluar el impacto de estrategias de venta

---

### 📊 2. Interacción por Producto (Bar Chart)

**Tipo**: Gráfico de barras comparativo

**Descripción**: Muestra los 10 productos vendidos con mayor interacción en Facebook Marketplace.

**Datos Mostrados**:
- **Eje X**: Nombre del producto
- **Eje Y**: Cantidad
- **Categorías**:
  - 🔵 **Vistas** (blue): Número de visualizaciones
  - 🟣 **Mensajes** (violet): Número de mensajes recibidos

**Ordenamiento**: De mayor a menor número de vistas

**Utilidad**:
- Identificar qué productos generan más interés
- Comparar engagement entre productos similares
- Optimizar descripciones y fotos basándose en productos exitosos

---

### 📊 3. Inventario por Marca (Donut Chart)

**Tipo**: Gráfico de dona (donut)

**Descripción**: Distribución del inventario disponible por marca de portátil.

**Datos Mostrados**:
- **Categorías**: Marcas (HP, Dell, Lenovo, etc.)
- **Valores**: Cantidad de productos disponibles por marca
- **Colores**: Paleta variada (slate, violet, indigo, rose, cyan, amber)

**Filtro**: Solo productos con `disponibility === 'disponible'`

**Utilidad**:
- Visualizar diversificación del inventario
- Identificar marcas sobre-representadas o sub-representadas
- Planificar compras futuras para balancear el stock

---

### 📊 4. Top 5 - Velocity Score

**Tipo**: Lista clasificada con badges

**Descripción**: Los 5 productos con mejor "puntuación de velocidad", que mide la rentabilidad por día.

**Fórmula del Velocity Score**:
```
Velocity Score = Utilidad / Días en Vitrina
```

**Componentes**:
- **Utilidad**: `price.soldOn - price.buy - price.otherExpenses`
- **Días en Vitrina**: Diferencia entre `timeline.publishedAt` y `timeline.soldAt`

**Datos Mostrados**:
- Nombre del producto
- Utilidad total generada
- Días que estuvo en venta
- Puntuación (pts) con badge verde

**Interpretación**:
- **Mayor score** = Producto que genera más ganancia por día
- Ideal para identificar qué tipo de productos comprar
- Combina rentabilidad con velocidad de rotación

**Ejemplo**:
```
Producto A: Utilidad $600,000 en 10 días = 60,000 pts
Producto B: Utilidad $800,000 en 20 días = 40,000 pts
Producto C: Utilidad $400,000 en 5 días = 80,000 pts ← Mejor score
```

---

## Cálculos y Fórmulas

### Resumen de Fórmulas Principales

| Métrica | Fórmula | Variables |
|---------|---------|-----------|
| **Utilidad Neta** | `Σ(Venta) - Σ(Compra) - Σ(Gastos)` | `soldOn`, `buy`, `otherExpenses` |
| **Velocidad Promedio** | `Σ(Días) / N` | `publishedAt`, `soldAt` |
| **ROI** | `(Utilidad / Inversión) × 100` | Utilidad, Compra, Gastos |
| **Eficiencia Marketplace** | `(Mensajes / Vistas) × 100` | `fbMessages`, `fbViews` |
| **Velocity Score** | `Utilidad / Días` | Utilidad, Días en vitrina |

### Validaciones Aplicadas

1. **Productos Vendidos**: Solo se consideran productos con:
   - `disponibility === 'vendido'`
   - `price.soldOn > 0`
   - `timeline.soldAt` existe

2. **Días de Venta**: 
   - Si `días <= 0`, se ajusta a `1` para evitar división por cero
   - Solo se cuentan productos con fechas válidas

3. **Eficiencia Marketplace**:
   - Se incluyen todos los productos (vendidos y disponibles)
   - Si `vistas === 0`, eficiencia = 0%

---

## Fuente de Datos

### API Endpoint

**URL**: `GET /sales/summary`

**Descripción**: Retorna un array con todos los productos del sistema, incluyendo información de precios, métricas y timeline.

### Estructura de Datos del Producto

```javascript
{
  _id: "...",
  name: "Portátil HP EliteBook 840 G5",
  disponibility: "vendido" | "disponible" | "reservado",
  
  price: {
    buy: 1500000,           // Precio de compra
    soldOn: 2000000,        // Precio de venta
    otherExpenses: 50000    // Gastos adicionales
  },
  
  timeline: {
    publishedAt: "2026-01-15T10:00:00Z",  // Fecha de publicación
    soldAt: "2026-01-25T15:30:00Z"        // Fecha de venta
  },
  
  metrics: {
    fbViews: 250,      // Vistas en Facebook
    fbMessages: 12     // Mensajes recibidos
  },
  
  specification: {
    brand: "HP",       // Marca del portátil
    processor: "Intel Core i5",
    ram: "16GB"
    // ... otras especificaciones
  }
}
```

### Frecuencia de Actualización

- **Carga Inicial**: Al abrir la pestaña de Estadísticas
- **Recarga Manual**: Al refrescar la página
- **Estado de Carga**: Muestra "Cargando estadísticas..." mientras obtiene los datos

---

## Interpretación de Métricas

### Escenarios de Análisis

#### ✅ Escenario Ideal
```
✓ Utilidad Neta: $5,000,000+ (positiva y creciente)
✓ Velocidad de Venta: 10-15 días (rotación rápida)
✓ ROI: 30%+ (excelente retorno)
✓ Eficiencia Marketplace: 3-5% (buen engagement)
```

**Acción**: Mantener estrategia actual, escalar operaciones.

---

#### ⚠️ Escenario de Alerta
```
⚠ Utilidad Neta: Negativa o muy baja
⚠ Velocidad de Venta: 30+ días (rotación lenta)
⚠ ROI: <10% (bajo retorno)
⚠ Eficiencia Marketplace: <1% (poco engagement)
```

**Acciones Recomendadas**:
1. Revisar estrategia de precios
2. Mejorar calidad de fotos y descripciones
3. Analizar productos con mejor Velocity Score
4. Considerar descuentos en productos lentos

---

#### 📊 Análisis por Gráfico

**Crecimiento de Utilidad**:
- **Línea ascendente**: Negocio saludable y creciente
- **Línea plana**: Estancamiento, necesita nuevas estrategias
- **Línea descendente**: Pérdidas, revisar costos urgentemente

**Interacción por Producto**:
- **Alto ratio Mensajes/Vistas**: Producto bien presentado y con precio atractivo
- **Muchas vistas, pocos mensajes**: Precio alto o descripción poco clara
- **Pocas vistas**: Problema de visibilidad o SEO

**Inventario por Marca**:
- **Distribución equilibrada**: Buena diversificación
- **Concentración en 1-2 marcas**: Riesgo de dependencia
- **Marcas desconocidas dominantes**: Posible dificultad de venta

**Velocity Score**:
- **Usar para decisiones de compra**: Priorizar productos similares a los del Top 5
- **Identificar nichos rentables**: Combinaciones de procesador + RAM exitosas
- **Evitar productos lentos**: No comprar similares a los de bajo score

---

## Casos de Uso Prácticos

### 1. Planificación de Compras

**Pregunta**: ¿Qué tipo de portátiles debo comprar?

**Análisis**:
1. Revisar **Top 5 Velocity Score** → Identificar características comunes
2. Consultar **Inventario por Marca** → Evitar sobre-stock de una marca
3. Verificar **ROI** → Asegurar que la inversión sea rentable

**Ejemplo**:
```
Top 5 muestra: Intel Core i5 + 16GB RAM con score alto
Inventario: Poca presencia de HP
Decisión: Comprar HP con i5 + 16GB
```

---

### 2. Optimización de Publicaciones

**Pregunta**: ¿Cómo mejorar mis publicaciones en Marketplace?

**Análisis**:
1. Revisar **Interacción por Producto** → Ver qué productos tienen mejor engagement
2. Calcular ratio Mensajes/Vistas por producto
3. Comparar fotos, descripciones y precios de productos exitosos

**Acción**:
- Replicar estilo de fotos de productos con alto engagement
- Ajustar descripciones basándose en productos con más mensajes
- Revisar precios de productos con muchas vistas pero pocos mensajes

---

### 3. Evaluación de Rentabilidad

**Pregunta**: ¿Mi negocio es rentable?

**Análisis**:
1. **Utilidad Neta** > 0 ✓
2. **ROI** > 20% ✓
3. **Velocidad de Venta** < 20 días ✓
4. **Gráfico de Crecimiento** ascendente ✓

**Resultado**: Negocio saludable y rentable

---

### 4. Identificación de Problemas

**Síntoma**: Productos no se venden

**Diagnóstico**:
1. **Eficiencia Marketplace baja** → Problema de presentación
2. **Velocidad de Venta alta** → Problema de precio o demanda
3. **ROI bajo** → Comprando muy caro o vendiendo muy barato

**Solución según diagnóstico**:
- Eficiencia baja: Mejorar fotos y descripciones
- Velocidad alta: Ajustar precios o cambiar tipo de productos
- ROI bajo: Negociar mejores precios de compra

---

## Tecnologías Utilizadas

### Frontend
- **React**: Framework principal
- **Tremor**: Librería de gráficos y KPIs
  - `AreaChart`: Gráfico de área
  - `BarChart`: Gráfico de barras
  - `DonutChart`: Gráfico de dona
  - `Card`, `Metric`, `Text`: Componentes de UI
- **@formkit/tempo**: Cálculo de diferencias de fechas

### Componentes de Tremor

```javascript
import {
  AreaChart,    // Crecimiento de Utilidad
  BarChart,     // Interacción por Producto
  DonutChart,   // Inventario por Marca
  Card,         // Tarjetas de KPIs
  Metric,       // Valores numéricos grandes
  Text,         // Textos descriptivos
  Grid,         // Layout responsive
  BadgeDelta,   // Badges de Velocity Score
} from '@tremor/react';
```

---

## Mantenimiento y Actualizaciones

### Agregar Nuevos KPIs

Para agregar un nuevo KPI, seguir estos pasos:

1. **Actualizar estado inicial**:
```javascript
const [kpis, setKpis] = useState({
  netUtility: 0,
  avgSalesSpeed: 0,
  roi: 0,
  marketplaceEfficiency: 0,
  nuevoKPI: 0  // ← Agregar aquí
});
```

2. **Calcular en `calculateMetrics`**:
```javascript
const nuevoKPI = // ... cálculo
setKpis({
  ...existingKPIs,
  nuevoKPI
});
```

3. **Renderizar en el Grid**:
```javascript
<Card decoration="top" decorationColor="blue">
  <Text>Nombre del KPI</Text>
  <Metric>{kpis.nuevoKPI}</Metric>
</Card>
```

---

### Agregar Nuevos Gráficos

1. **Preparar datos en `calculateMetrics`**
2. **Agregar al estado `charts`**
3. **Renderizar con componente de Tremor apropiado**

**Ejemplo**:
```javascript
// 1. Preparar datos
const newChartData = products.map(p => ({
  name: p.name,
  value: p.someMetric
}));

// 2. Actualizar estado
setCharts({
  ...existingCharts,
  newChartData
});

// 3. Renderizar
<Card>
  <Title>Nuevo Gráfico</Title>
  <BarChart
    data={charts.newChartData}
    index="name"
    categories={['value']}
  />
</Card>
```

---

## Preguntas Frecuentes (FAQ)

### ¿Por qué algunos KPIs muestran 0?

**R**: Puede deberse a:
- No hay productos vendidos aún
- Faltan datos en los campos requeridos (`price.soldOn`, `timeline.soldAt`, etc.)
- Los productos no cumplen los filtros (ej: `disponibility !== 'vendido'`)

---

### ¿Cómo se manejan los productos sin fecha de venta?

**R**: Solo se incluyen en cálculos de productos vendidos aquellos que tienen:
- `disponibility === 'vendido'`
- `timeline.soldAt` definido
- `price.soldOn > 0`

Los demás se excluyen automáticamente.

---

### ¿Qué pasa si un producto tiene días negativos?

**R**: El sistema ajusta automáticamente a 1 día mínimo para evitar:
- División por cero en Velocity Score
- Valores negativos en Velocidad de Venta

```javascript
if (days <= 0) days = 1;
```

---

### ¿Se pueden exportar estos datos?

**R**: Actualmente no hay función de exportación. Para implementarla:
1. Agregar botón de exportación
2. Usar librería como `xlsx` o `csv-export`
3. Formatear datos de KPIs y gráficos

---

### ¿Con qué frecuencia se actualizan las estadísticas?

**R**: 
- **Automática**: Al cargar la pestaña de Estadísticas
- **Manual**: Refrescando la página
- **Futura mejora**: Implementar auto-refresh cada X minutos con `setInterval`

---

## Roadmap de Mejoras

### Corto Plazo
- [ ] Filtros por rango de fechas
- [ ] Exportación a Excel/PDF
- [ ] Comparación mes a mes
- [ ] Alertas automáticas (ej: ROI < 10%)

### Mediano Plazo
- [ ] Predicción de ventas con ML
- [ ] Análisis de estacionalidad
- [ ] Benchmarking con competencia
- [ ] Dashboard personalizable

### Largo Plazo
- [ ] Integración con otras plataformas (MercadoLibre, OLX)
- [ ] Análisis de sentimiento de mensajes
- [ ] Recomendaciones automáticas de precios
- [ ] App móvil con notificaciones

---

## Soporte y Contacto

Para dudas o sugerencias sobre el dashboard de estadísticas:

- **Documentación Técnica**: Ver código en `client/src/components/Dashboard/TabsComponent/analitycs/AnalyticsTab.jsx`
- **Issues**: Reportar en el sistema de gestión de proyectos
- **Mejoras**: Proponer nuevas métricas o visualizaciones

---

## Changelog

### Versión Actual
- ✅ 4 KPIs principales implementados
- ✅ 4 visualizaciones (Area, Bar, Donut, List)
- ✅ Cálculo automático de métricas
- ✅ Responsive design con Tremor Grid
- ✅ Manejo de errores y estados de carga

### Próxima Versión
- 🔄 Filtros de fecha
- 🔄 Comparativas temporales
- 🔄 Exportación de datos

---

**Última actualización**: Febrero 2026  
**Versión del documento**: 1.0  
**Autor**: Equipo de Desarrollo Tecnologia-col
