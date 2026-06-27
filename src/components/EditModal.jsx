import { useState, useEffect } from 'react'
import '../styles/EditModal.css'
import { CATEGORIES } from '../data/categories'

function EditModal({ isOpen, transaction, trucks, onSave, onCancel }) {
  const [form, setForm] = useState({})

  // Cargar datos del registro al abrir
  useEffect(() => {
    if (transaction) setForm({ ...transaction })
  }, [transaction])

  if (!isOpen || !transaction) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSave() {
    if (!form.truck || !form.description || !form.amount || !form.date) return
    onSave({ ...form, amount: Number(form.amount) })
  }

  const isIncome = form.type === 'income'

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="edit-modal" onClick={e => e.stopPropagation()}>

        <div className="edit-modal__header">
          <h3 className="edit-modal__title">✏️ Editar movimiento</h3>
          <button className="edit-modal__close" onClick={onCancel}>✕</button>
        </div>

        <div className="edit-modal__body">

          {/* Vehículo */}
          <div className="form-group">
            <label>Vehículo</label>
            <select name="truck" value={form.truck || ''} onChange={handleChange}>
              {trucks.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Categoría — solo gastos */}
          {!isIncome && (
            <div className="form-group">
              <label>Categoría</label>
              <select name="category" value={form.category || ''} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Cliente — solo ingresos */}
          {isIncome && (
            <div className="form-group">
              <label>Cliente <span style={{color:'var(--text-muted)',fontWeight:400}}>(opcional)</span></label>
              <input name="client" type="text" value={form.client || ''} onChange={handleChange} placeholder="Empresa XYZ" />
            </div>
          )}

          {/* Descripción */}
          <div className="form-group">
            <label>Descripción</label>
            <input name="description" type="text" value={form.description || ''} onChange={handleChange} />
          </div>

          {/* Monto */}
          <div className="form-group">
            <label>Monto (COP)</label>
            <input name="amount" type="number" min="0" value={form.amount || ''} onChange={handleChange} />
          </div>

          {/* Fecha */}
          <div className="form-group">
            <label>Fecha</label>
            <input name="date" type="date" value={form.date || ''} onChange={handleChange} />
          </div>

        </div>

        <div className="edit-modal__footer">
          <button className="modal__btn modal__btn--cancel" onClick={onCancel}>Cancelar</button>
          <button className="modal__btn modal__btn--save" onClick={handleSave}>Guardar cambios</button>
        </div>

      </div>
    </div>
  )
}

export default EditModal