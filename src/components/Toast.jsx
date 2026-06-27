import '../styles/Toast.css'

function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          onClick={() => onRemove(toast.id)}
        >
          <span className="toast__icon">
            {toast.type === 'success' && '✅'}
            {toast.type === 'error'   && '❌'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'info'    && 'ℹ️'}
          </span>
          <span className="toast__message">{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

export default Toast