import '../styles/TransactionList.css'
import TransactionItem from './TransactionItem'

function TransactionList({ transactions = [], onDelete, onEdit }) {
  return (
    <div className="transaction-list">

      <div className="transaction-list__header">
        <h2 className="transaction-list__title">Movimientos</h2>
        <span className="transaction-list__count">
          {transactions.length} {transactions.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <div className="transaction-list__body">
        {transactions.length === 0 ? (
          <div className="transaction-list__empty">
            <span className="transaction-list__empty-icon">📋</span>
            <p>No hay movimientos para mostrar.</p>
            <small>Prueba cambiando los filtros o agrega un nuevo registro.</small>
          </div>
        ) : (
          transactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>

    </div>
  )
}

export default TransactionList