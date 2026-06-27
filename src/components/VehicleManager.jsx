import { useState } from 'react'
import '../styles/VehicleManager.css'

function VehicleManager({ trucks, transactions, onAddTruck, onEditTruck, onDeleteTruck, onTruckClick }) {
  const [newName, setNewName]       = useState('')
  const [editingId, setEditingId]   = useState(null)
  const [editValue, setEditValue]   = useState('')
  const [error, setError]           = useState('')

  function handleAdd() {
    const name = newName.trim().toUpperCase()
    if (!name)                        return setError('Ingresa un nombre.')
    if (trucks.includes(name))        return setError('Ese vehículo ya existe.')
    onAddTruck(name)
    setNewName('')
    setError('')
  }

  function startEdit(truck) {
    setEditingId(truck)
    setEditValue(truck)
    setError('')
  }

  function handleEdit(oldName) {
    const name = editValue.trim().toUpperCase()
    if (!name)                        return setError('El nombre no puede estar vacío.')
    if (name !== oldName && trucks.includes(name)) return setError('Ese vehículo ya existe.')
    onEditTruck(oldName, name)
    setEditingId(null)
    setError('')
  }

  function handleDelete(truck) {
    const hasMovements = transactions.some(t => t.truck === truck)
    if (hasMovements) return setError(`${truck} tiene movimientos. Elimínalos primero.`)
    onDeleteTruck(truck)
    setError('')
  }

  // Resumen por camión
  function getSummary(truck) {
    const tx      = transactions.filter(t => t.truck === truck)
    const income  = tx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { count: tx.length, income, expense, profit: income - expense }
  }

  const fmt = n => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', minimumFractionDigits: 0,
  }).format(n)

  return (
    <div className="vehicle-manager">

      <div className="vehicle-manager__header">
        <h2 className="vehicle-manager__title">Gestión de vehículos</h2>
        <span className="vehicle-manager__count">{trucks.length} vehículos</span>
      </div>

      {/* Agregar nuevo */}
      <div className="vehicle-manager__add">
        <input
          type="text"
          placeholder="Ej: ABC123, Camión 01"
          value={newName}
          onChange={e => { setNewName(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button onClick={handleAdd}>+ Agregar</button>
      </div>

      {error && <p className="vehicle-manager__error">{error}</p>}

      {/* Lista de camiones */}
      {trucks.length === 0 ? (
        <div className="vehicle-manager__empty">
          🚛 No hay vehículos registrados aún.<br />
          <small>Agrega uno arriba o regístralo desde el formulario.</small>
        </div>
      ) : (
        <div className="vehicle-manager__list">
          {trucks.map(truck => {
            const s = getSummary(truck)
            return (
              <div key={truck} className="vehicle-card">

                {editingId === truck ? (
                  /* Modo edición */
                  <div className="vehicle-card__edit">
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEdit(truck)}
                      autoFocus
                    />
                    <button className="vehicle-card__save" onClick={() => handleEdit(truck)}>✔</button>
                    <button className="vehicle-card__cancel" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  /* Vista normal */
                  <>
                    <div
                      className="vehicle-card__info"
                      onClick={() => onTruckClick(truck)}
                      title="Ver reporte"
                    >
                      <span className="vehicle-card__icon">🚛</span>
                      <div>
                        <p className="vehicle-card__name">{truck}</p>
                        <p className="vehicle-card__meta">{s.count} registros</p>
                      </div>
                      <div className="vehicle-card__profit">
                        <span className={s.profit >= 0 ? 'pos' : 'neg'}>{fmt(s.profit)}</span>
                        <small>utilidad</small>
                      </div>
                    </div>
                    <div className="vehicle-card__actions">
                      <button className="veh-btn veh-btn--edit"   onClick={() => startEdit(truck)}>✏️</button>
                      <button className="veh-btn veh-btn--delete" onClick={() => handleDelete(truck)}>🗑️</button>
                    </div>
                  </>
                )}

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}

export default VehicleManager