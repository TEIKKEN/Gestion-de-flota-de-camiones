import '../styles/ConfirmModal.css'

function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__icon">🗑️</div>
        <h3 className="modal__title">¿Eliminar registro?</h3>
        <p className="modal__message">{message || 'Esta acción no se puede deshacer.'}</p>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onCancel}>
            Cancelar
          </button>
          <button className="modal__btn modal__btn--confirm" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal