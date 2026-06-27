import '../styles/ExpenseChart.css'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { CATEGORIES, CATEGORY_COLORS } from '../data/categories'

const fmtCOP = v => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', minimumFractionDigits: 0,
}).format(v)

const fmtShort = v => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(0)}K`
  return `$${v}`
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0].payload
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '8px 14px',
      fontSize: '0.82rem', color: 'var(--text-primary)',
    }}>
      <strong>{name}</strong><br />{fmtCOP(value)}
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '10px', padding: '10px 14px', fontSize: '0.82rem',
    }}>
      <p style={{ color: 'var(--text-primary)', marginBottom: 4 }}><strong>🚛 {label}</strong></p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {fmtCOP(p.value)}
        </p>
      ))}
    </div>
  )
}

function ExpenseChart({ transactions = [] }) {
  // ── Dona: gastos por categoría ──────────────────────────────────────────
  const expenses      = transactions.filter(t => t.type === 'expense')
  const totalExpense  = expenses.reduce((s, t) => s + t.amount, 0)

  const byCat = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

  const pieData = Object.entries(byCat).map(([name, value]) => ({
    name, value,
    pct: totalExpense > 0 ? Math.round((value / totalExpense) * 100) : 0,
    color: CATEGORY_COLORS[name] || '#8891a8',
  })).sort((a, b) => b.value - a.value)

  // ── Barras: ingresos vs gastos por camión ───────────────────────────────
  const trucks = [...new Set(transactions.map(t => t.truck).filter(Boolean))]

  const barData = trucks.map(truck => {
    const tx = transactions.filter(t => t.truck === truck)
    return {
      truck,
      Ingresos: tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
      Gastos:   tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    }
  })

  const hasExpenses = pieData.length > 0
  const hasTrucks   = barData.length > 0

  if (!hasExpenses && !hasTrucks) return null

  return (
    <div className="expense-chart">

      {/* ── Gráfica 1: dona de gastos ── */}
      {hasExpenses && (
        <div className="chart-section">
          <div className="chart-section__header">
            <h2 className="expense-chart__title">Gastos por categoría</h2>
            <span className="expense-chart__subtitle">Distribución operativa</span>
          </div>
          <div className="expense-chart__body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%"
                  innerRadius={60} outerRadius={95}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map(e => (
                    <Cell key={e.name} fill={e.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="expense-chart__legend">
              {pieData.map(item => (
                <div key={item.name} className="legend-item">
                  <div className="legend-item__left">
                    <span className="legend-item__dot" style={{ background: item.color }} />
                    <span className="legend-item__name">{item.name}</span>
                  </div>
                  <span className="legend-item__pct">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Gráfica 2: barras ingresos vs gastos por camión ── */}
      {hasTrucks && (
        <div className="chart-section chart-section--bar">
          <div className="chart-section__header">
            <h2 className="expense-chart__title">Ingresos vs Gastos por vehículo</h2>
            <span className="expense-chart__subtitle">Comparativo de rentabilidad</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="truck" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtShort} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Legend
                formatter={name => (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{name}</span>
                )}
              />
              <Bar dataKey="Ingresos" fill="var(--accent-green)" radius={[4,4,0,0]} maxBarSize={48} />
              <Bar dataKey="Gastos"   fill="var(--accent-red)"   radius={[4,4,0,0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  )
}

export default ExpenseChart