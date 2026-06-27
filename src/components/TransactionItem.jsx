import '../styles/TransactionItem.css'
import { CATEGORIES } from '../data/categories'

function formatCOP(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function TransactionItem({ transaction, onDelete, onEdit }) {
  const { id, truck, description, amount, type, category, date } = transaction

  const catData = CATEGORIES.find(c => c.value === category)
  const emoji   = catData ? catData.emoji : '📦'
  const color   = catData ? catData.color : '#8891a8'

  return (
    <div className="transaction-item">

      {/* Icono de categoría */}
      <div
        className="transaction-item__icon"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        {emoji}
      </div>

      {/* Info principal */}
      <div className="transaction-item__info">
        <p className="transaction-item__description">{description}</p>
        <div className="transaction-item__meta">
          {/* Placa del camión */}
          <span
            className="transaction-item__truck"
            style={{ color, borderColor: `${color}55`, background: `${color}15` }}
          >
            🚛 {truck}
          </span>
          <span className="transaction-item__dot" />
          <span className="transaction-item__category">{category}</span>
          <span className="transaction-item__dot" />
          <span className="transaction-item__date">{formatDate(date)}</span>
        </div>
      </div>

      {/* Monto */}
      <span className={`transaction-item__amount transaction-item__amount--${type}`}>
        {type === 'income' ? '+' : '-'} {formatCOP(amount)}
      </span>

      {/* Botón eliminar */}
      {/* Acciones */}
      <div className="transaction-item__actions">
        <button
          className="transaction-item__edit"
          type="button"
          title="Editar registro"
          onClick={() => onEdit && onEdit(transaction)}
        >
          ✏️
        </button>
        <button
          className="transaction-item__delete"
          type="button"
          title="Eliminar registro"
          onClick={() => onDelete && onDelete(id)}
        >
          ✕
        </button>
      </div>

    </div>
  )
}

export default TransactionItem