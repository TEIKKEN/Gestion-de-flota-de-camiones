import '../styles/FinancialReport.css'
import { fmt } from '../assets/utils/calculations'

const PERIOD_LABELS = {
  all:    'Todo el tiempo',
  today:  'Hoy',
  week:   'Esta semana',
  month:  'Este mes',
  year:   'Este año',
  custom: 'Período personalizado',
}

function FinancialReport({ metrics, period }) {
  const {
    totalIncome, totalExpense, netProfit,
    incomeCount, expenseCount, totalCount,
    avgIncome, avgExpense,
  } = metrics

  // No mostrar si no hay datos
  if (totalCount === 0) return null

  const isProfit  = netProfit >= 0
  const margin    = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0

  return (
    <div className="financial-report">
      <div className="financial-report__header">
        <h2 className="financial-report__title">Reporte financiero</h2>
        <span className="financial-report__badge">
          {PERIOD_LABELS[period] || period}
        </span>
      </div>

      <div className="financial-report__grid">

        <div className="report-stat report-stat--income">
          <span className="report-stat__label">Total ingresos</span>
          <span className="report-stat__value">{fmt(totalIncome)}</span>
          <span className="report-stat__sub">
            {incomeCount} operaciones · Promedio {fmt(avgIncome)}
          </span>
        </div>

        <div className="report-stat report-stat--expense">
          <span className="report-stat__label">Total gastos</span>
          <span className="report-stat__value">{fmt(totalExpense)}</span>
          <span className="report-stat__sub">
            {expenseCount} operaciones · Promedio {fmt(avgExpense)}
          </span>
        </div>

        <div className={`report-stat ${isProfit ? 'report-stat--profit' : 'report-stat--loss'}`}>
          <span className="report-stat__label">Utilidad neta</span>
          <span className="report-stat__value">{fmt(netProfit)}</span>
          <span className="report-stat__sub">
            {isProfit
              ? `Margen del ${margin}% sobre ingresos`
              : 'Operación con pérdidas'}
          </span>
        </div>

        <div className="report-stat">
          <span className="report-stat__label">Total operaciones</span>
          <span className="report-stat__value report-stat__value--count">
            {totalCount}
          </span>
          <span className="report-stat__sub">
            {incomeCount} ingresos · {expenseCount} gastos
          </span>
        </div>

      </div>
    </div>
  )
}

export default FinancialReport