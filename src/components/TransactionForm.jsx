import { useState } from 'react'
import '../styles/TransactionForm.css'
import { CATEGORIES } from '../data/categories'

const today = new Date().toISOString().split('T')[0]

const EMPTY_EXPENSE = {
  truck: '', newTruck: '', description: '',
  amount: '', category: '', type: 'expense', date: today,
}

const EMPTY_INCOME = {
  truck: '', newTruck: '', client: '',
  description: '', amount: '', type: 'income', date: today,
}

function TransactionForm({ onAdd, trucks = [] }) {
  const [mode, setMode]           = useState('expense') // 'expense' | 'income'
  const [form, setForm]           = useState(EMPTY_EXPENSE)
  const [error, setError]         = useState('')
  const [addingNew, setAddingNew] = useState(false)

  function switchMode(newMode) {
    setMode(newMode)
    setForm(newMode === 'expense' ? EMPTY_EXPENSE : EMPTY_INCOME)
    setError('')
    setAddingNew(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function handleTruckSelect(e) {
    const value = e.target.value
    if (value === '__new__') {
      setAddingNew(true)
      setForm(prev => ({ ...prev, truck: '' }))
    } else {
      setAddingNew(false)
      setForm(prev => ({ ...prev, truck: value, newTruck: '' }))
    }
  }

  function handleSubmit() {
    const finalTruck = addingNew ? form.newTruck.trim() : form.truck

    if (!finalTruck)              return setError('Selecciona o ingresa un vehículo.')
    if (!form.description.trim()) return setError('La descripción es obligatoria.')
    if (!form.amount || Number(form.amount) <= 0) return setError('Ingresa un monto mayor a 0.')
    if (mode === 'expense' && !form.category) return setError('Selecciona una categoría.')
    if (!form.date)               return setError('Selecciona una fecha.')

    const newTransaction = {
      id: Date.now(),
      truck: finalTruck.toUpperCase(),
      description: form.description.trim(),
      amount: Number(form.amount),
      category: mode === 'income' ? 'Ingreso' : form.category,
      client: form.client?.trim() || '',
      type: mode,
      date: form.date,
    }

    onAdd(newTransaction)
    setForm(mode === 'expense' ? { ...EMPTY_EXPENSE, date: today } : { ...EMPTY_INCOME, date: today })
    setAddingNew(false)
    setError('')
  }

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="transaction-form">

      {/* Selector de modo */}
      <div className="transaction-form__type-toggle">
        <button
          className={`type-btn type-btn--expense ${mode === 'expense' ? 'active' : ''}`}
          type="button"
          onClick={() => switchMode('expense')}
        >
          ↓ Registrar Gasto
        </button>
        <button
          className={`type-btn type-btn--income ${mode === 'income' ? 'active' : ''}`}
          type="button"
          onClick={() => switchMode('income')}
        >
          ↑ Registrar Ingreso
        </button>
      </div>

      <h2 className="transaction-form__title">
        {mode === 'expense' ? 'Nuevo gasto operativo' : 'Nuevo ingreso de viaje'}
      </h2>

      <div className="transaction-form__fields">

        {/* Vehículo — igual en ambos modos */}
        <div className="form-group">
          <label htmlFor="truck">Vehículo</label>
          <select
            id="truck"
            name="truck"
            value={addingNew ? '__new__' : form.truck}
            onChange={handleTruckSelect}
          >
            <option value="">Selecciona un vehículo</option>
            {trucks.map(t => <option key={t} value={t}>{t}</option>)}
            <option value="__new__">+ Agregar nuevo vehículo</option>
          </select>
        </div>

        {addingNew && (
          <div className="form-group">
            <label htmlFor="newTruck">Placa o nombre</label>
            <input
              id="newTruck" name="newTruck" type="text"
              placeholder="Ej: ABC123, Camión 01"
              value={form.newTruck} onChange={handleChange}
            />
          </div>
        )}

        {/* Campos exclusivos de INGRESO */}
        {mode === 'income' && (
          <div className="form-group">
            <label htmlFor="client">Cliente <span className="optional">(opcional)</span></label>
            <input
              id="client" name="client" type="text"
              placeholder="Ej: Empresa XYZ"
              value={form.client} onChange={handleChange}
            />
          </div>
        )}

        {/* Categoría — solo en GASTO */}
        {mode === 'expense' && (
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="description">
            {mode === 'income' ? 'Descripción del viaje' : 'Descripción'}
          </label>
          <input
            id="description" name="description" type="text"
            placeholder={mode === 'income' ? 'Ej: Transporte Medellín - Bogotá' : 'Ej: Tanqueo Medellín'}
            value={form.description} onChange={handleChange}
          />
        </div>

        {/* Monto */}
        <div className="form-group">
          <label htmlFor="amount">
            {mode === 'income' ? 'Valor del ingreso (COP)' : 'Monto (COP)'}
          </label>
          <input
            id="amount" name="amount" type="number"
            placeholder="0" min="0"
            value={form.amount} onChange={handleChange}
          />
        </div>

        {/* Fecha */}
        <div className="form-group">
          <label htmlFor="date">Fecha</label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
        </div>

      </div>

      {error && <p className="transaction-form__error">{error}</p>}

      <button
        className={`transaction-form__submit ${mode === 'income' ? 'transaction-form__submit--income' : ''}`}
        type="button"
        onClick={handleSubmit}
      >
        {mode === 'expense' ? '+ Registrar gasto' : '+ Registrar ingreso'}
      </button>
    </div>
  )
}

export default TransactionForm