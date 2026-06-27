import '../styles/ProfitabilityTable.css'

function fmt(n) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
  }).format(n)
}

function ProfitabilityTable({ profitByTruck, mostProfitable, highestIncome, highestExpense, onTruckClick }) {
  if (!profitByTruck || profitByTruck.length === 0) return null

  const fleetIncome  = profitByTruck.reduce((s, t) => s + t.income,  0)
  const fleetExpense = profitByTruck.reduce((s, t) => s + t.expense, 0)
  const fleetProfit  = fleetIncome - fleetExpense

  return (
    <div className="profit-table">
      <div className="profit-table__header">
        <h2 className="profit-table__title">Rentabilidad por vehículo</h2>

        {/* Indicadores rápidos */}
        <div className="profit-table__badges">
          {mostProfitable && (
            <span className="profit-badge profit-badge--green">
              🏆 Más rentable: <strong>{mostProfitable.truck}</strong>
            </span>
          )}
          {highestIncome && (
            <span className="profit-badge profit-badge--blue">
              📈 Mayor ingreso: <strong>{highestIncome.truck}</strong>
            </span>
          )}
          {highestExpense && (
            <span className="profit-badge profit-badge--red">
              📉 Mayor gasto: <strong>{highestExpense.truck}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="profit-table__body">
        <table>
          <thead>
            <tr>
              <th>Vehículo</th>
              <th>Ingresos</th>
              <th>Gastos</th>
              <th>Utilidad</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {profitByTruck.map(row => {
              const isPos = row.profit >= 0
              const pct   = row.income > 0
                ? Math.round((row.profit / row.income) * 100)
                : 0
              return (
                <tr key={row.truck}>
                  <td className="col-truck" style={{ cursor: 'pointer' }} onClick={() => onTruckClick?.(row.truck)} title="Ver reporte del vehículo">
                    🚛 {row.truck}
                  </td>
                  <td className="col-income">{fmt(row.income)}</td>
                  <td className="col-expense">{fmt(row.expense)}</td>
                  <td className={`col-profit ${isPos ? 'pos' : 'neg'}`}>
                    {fmt(row.profit)}
                  </td>
                  <td className="col-status">
                    <div className="profit-bar-wrap">
                      <div
                        className={`profit-bar ${isPos ? 'profit-bar--pos' : 'profit-bar--neg'}`}
                        style={{ width: `${Math.min(Math.abs(pct), 100)}%` }}
                      />
                    </div>
                    <span className={`profit-pct ${isPos ? 'pos' : 'neg'}`}>
                      {isPos ? '+' : ''}{pct}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>

          {/* Totales de flota */}
          <tfoot>
            <tr>
              <td><strong>Flota total</strong></td>
              <td className="col-income"><strong>{fmt(fleetIncome)}</strong></td>
              <td className="col-expense"><strong>{fmt(fleetExpense)}</strong></td>
              <td className={`col-profit ${fleetProfit >= 0 ? 'pos' : 'neg'}`}>
                <strong>{fmt(fleetProfit)}</strong>
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default ProfitabilityTable