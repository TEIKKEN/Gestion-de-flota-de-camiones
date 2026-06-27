import '../styles/TruckReportModal.css'

function fmt(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
  }).format(n)
}

function TruckReportModal({ isOpen, truck, transactions, onClose }) {
  if (!isOpen || !truck) return null

  const tx       = transactions.filter(t => t.truck === truck)
  const incomes  = tx.filter(t => t.type === 'income')
  const expenses = tx.filter(t => t.type === 'expense')

  const totalIncome  = incomes.reduce((s, t) => s + t.amount, 0)
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const netProfit    = totalIncome - totalExpense

  // Categoría con mayor gasto
  const byCat = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})
  const topCategory = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]

  const isProfit = netProfit >= 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="truck-report" onClick={e => e.stopPropagation()}>

        <div className="truck-report__header">
          <div>
            <p className="truck-report__label">Reporte de vehículo</p>
            <h3 className="truck-report__name">🚛 {truck}</h3>
          </div>
          <button className="edit-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="truck-report__grid">

          <div className="report-card report-card--income">
            <span className="report-card__label">Total Ingresos</span>
            <span className="report-card__value">{fmt(totalIncome)}</span>
            <span className="report-card__sub">{incomes.length} registros</span>
          </div>

          <div className="report-card report-card--expense">
            <span className="report-card__label">Total Gastos</span>
            <span className="report-card__value">{fmt(totalExpense)}</span>
            <span className="report-card__sub">{expenses.length} registros</span>
          </div>

          <div className={`report-card ${isProfit ? 'report-card--profit' : 'report-card--loss'}`}>
            <span className="report-card__label">Utilidad Neta</span>
            <span className="report-card__value">{fmt(netProfit)}</span>
            <span className="report-card__sub">{isProfit ? '✅ Rentable' : '⚠️ En pérdida'}</span>
          </div>

          <div className="report-card">
            <span className="report-card__label">Total registros</span>
            <span className="report-card__value" style={{fontSize:'1.5rem'}}>{tx.length}</span>
            <span className="report-card__sub">movimientos</span>
          </div>

        </div>

        {topCategory && (
          <div className="truck-report__top-cat">
            <span>📊 Mayor categoría de gasto:</span>
            <strong>{topCategory[0]} — {fmt(topCategory[1])}</strong>
          </div>
        )}

        {tx.length === 0 && (
          <p className="truck-report__empty">Este vehículo no tiene movimientos registrados.</p>
        )}

      </div>
    </div>
  )
}

export default TruckReportModal