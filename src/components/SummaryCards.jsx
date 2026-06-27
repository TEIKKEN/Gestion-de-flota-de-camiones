import '../styles/SummaryCards.css'

function fmt(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
  }).format(amount)
}

function SummaryCards({
  totalExpense, totalIncome, netProfit,
  totalCombustible, totalMantenimiento, totalSalarios,
  incomeMonth, incomeWeek,
}) {
  const profitColor = netProfit >= 0 ? 'summary-card--profit-pos' : 'summary-card--profit-neg'

  return (
    <section className="summary-cards summary-cards--fleet">

      {/* Fila 1: grandes métricas */}
      <div className="summary-card summary-card--income">
        <div className="summary-card__header">
          <span className="summary-card__label">Ingresos Generados</span>
          <div className="summary-card__icon">📈</div>
        </div>
        <span className="summary-card__amount">{fmt(totalIncome)}</span>
        <div className="summary-card__breakdown">
          <span>Esta semana <strong>{fmt(incomeWeek)}</strong></span>
          <span>Este mes <strong>{fmt(incomeMonth)}</strong></span>
        </div>
      </div>

      <div className="summary-card summary-card--expense">
        <div className="summary-card__header">
          <span className="summary-card__label">Gastos Totales</span>
          <div className="summary-card__icon">📉</div>
        </div>
        <span className="summary-card__amount">{fmt(totalExpense)}</span>
        <div className="summary-card__breakdown">
          <span>Combustible <strong>{fmt(totalCombustible)}</strong></span>
          <span>Salarios <strong>{fmt(totalSalarios)}</strong></span>
        </div>
      </div>

      <div className={`summary-card ${profitColor}`}>
        <div className="summary-card__header">
          <span className="summary-card__label">Utilidad Neta</span>
          <div className="summary-card__icon">{netProfit >= 0 ? '✅' : '⚠️'}</div>
        </div>
        <span className="summary-card__amount">{fmt(netProfit)}</span>
        <span className="summary-card__hint">
          {netProfit >= 0 ? 'Operación rentable' : 'Gastos superan ingresos'}
        </span>
      </div>

      {/* Fila 2: desglose operativo */}
      <div className="summary-card summary-card--fuel">
        <div className="summary-card__header">
          <span className="summary-card__label">Combustible</span>
          <div className="summary-card__icon">⛽</div>
        </div>
        <span className="summary-card__amount">{fmt(totalCombustible)}</span>
        <span className="summary-card__hint">Total en combustible</span>
      </div>

      <div className="summary-card summary-card--maintenance">
        <div className="summary-card__header">
          <span className="summary-card__label">Mantenimiento</span>
          <div className="summary-card__icon">🔧</div>
        </div>
        <span className="summary-card__amount">{fmt(totalMantenimiento)}</span>
        <span className="summary-card__hint">Mantenimiento y repuestos</span>
      </div>

      <div className="summary-card summary-card--salary">
        <div className="summary-card__header">
          <span className="summary-card__label">Salarios</span>
          <div className="summary-card__icon">👷</div>
        </div>
        <span className="summary-card__amount">{fmt(totalSalarios)}</span>
        <span className="summary-card__hint">Total a conductores</span>
      </div>

    </section>
  )
}

export default SummaryCards