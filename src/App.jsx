import './App.css'
import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { useToast } from './hooks/useToast'
import {
  filterByPeriod,
  calcMetrics,
  calcProfitByTruck,
  generateAlerts,
} from './assets/utils/calculations'
import Header from './components/Header'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import ExpenseChart from './components/ExpenseChart'
import FleetFilter from './components/FleetFilter'
import ProfitabilityTable from './components/ProfitabilityTable'
import SearchAndFilters from './components/SearchAndFilters'
import EditModal from './components/EditModal'
import ConfirmModal from './components/ConfirmModal'
import VehicleManager from './components/VehicleManager'
import TruckReportModal from './components/TruckReportModal'
import Toast from './components/Toast'
import ExportButton from './components/ExportButton'
import PeriodFilter from './components/PeriodFilter'
import FinancialReport from './components/FinancialReport'
import AlertsPanel from './components/AlertsPanel'
import CategoryAnalysis from './components/CategoryAnalysis'

function App() {
  const [transactions, setTransactions] = useLocalStorage('fleet_transactions', [])
  const [trucks, setTrucks]             = useLocalStorage('fleet_trucks', [])
  const [activeFilter, setActiveFilter] = useLocalStorage('fleet_filter', 'all')
  
  // ── Toast notifications ────────────────────────────────────────────────
  const { toasts, addToast, removeToast } = useToast()
  
  // ── Modal and UI states ────────────────────────────────────────────────
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [showVehicleManager, setShowVehicleManager] = useState(false)
  const [showTruckReport, setShowTruckReport] = useState(false)
  const [selectedTruck, setSelectedTruck] = useState(null)
  
  // ── Search and filter states ───────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')

  // ── Period filter states (Día 5) ─────────────────────────────────────────
  const [period, setPeriod] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  // ── Agregar transacción ─────────────────────────────────────────────────
  function handleAddTransaction(newTransaction) {
    setTransactions(prev => [newTransaction, ...prev])
    if (newTransaction.truck && !trucks.includes(newTransaction.truck)) {
      setTrucks(prev => [...prev, newTransaction.truck])
    }
    addToast('✅ Movimiento agregado correctamente', 'success')
  }

  // ── Eliminar transacción ────────────────────────────────────────────────
  function handleDeleteTransaction(id) {
    setPendingDeleteId(id)
    setShowConfirmModal(true)
  }
  
  function handleConfirmDelete() {
    if (pendingDeleteId) {
      setTransactions(prev => prev.filter(t => t.id !== pendingDeleteId))
      addToast('✅ Movimiento eliminado correctamente', 'success')
    }
    setShowConfirmModal(false)
    setPendingDeleteId(null)
  }

  // ── Editar transacción ─────────────────────────────────────────────────
  function handleEditClick(transaction) {
    setEditingTransaction(transaction)
  }
  
  function handleEditSave(updatedTransaction) {
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    )
    addToast('✅ Movimiento actualizado correctamente', 'success')
    setEditingTransaction(null)
  }
  
  // ── Agregar vehículo ──────────────────────────────────────────────────
  function handleAddTruck(truck) {
    setTrucks(prev => [...prev, truck])
    addToast(`✅ Vehículo "${truck}" agregado correctamente`, 'success')
  }
  
  function handleEditTruck(oldName, newName) {
    setTrucks(prev => prev.map(t => t === oldName ? newName : t))
    setTransactions(prev => 
      prev.map(t => t.truck === oldName ? { ...t, truck: newName } : t)
    )
    addToast(`✅ Vehículo renombrado a "${newName}"`, 'success')
  }
  
  function handleDeleteTruck(truck) {
    setTrucks(prev => prev.filter(t => t !== truck))
    setTransactions(prev => prev.filter(t => t.truck !== truck))
    addToast(`✅ Vehículo "${truck}" eliminado correctamente`, 'success')
  }
  
  function handleTruckClick(truck) {
    setSelectedTruck(truck)
    setShowTruckReport(true)
  }

  function handleCustomChange(which, value) {
    if (which === 'start') setCustomStart(value)
    else setCustomEnd(value)
  }

  // ══════════════════════════════════════════════════════════════
  // PIPELINE DE DATOS — Con período (Día 5)
  // ══════════════════════════════════════════════════════════════

  // 1. Filtrar por camión seleccionado
  const byTruck = activeFilter === 'all'
    ? transactions
    : transactions.filter(t => t.truck === activeFilter)

  // 2. Filtrar por período → BASE para métricas y alertas
  const byPeriod = filterByPeriod(byTruck, period, customStart, customEnd)

  // 3. Aplicar filtros adicionales para la lista de movimientos
  let filtered = byPeriod

  if (typeFilter !== 'all')
    filtered = filtered.filter(t => t.type === typeFilter)

  if (categoryFilter !== 'all')
    filtered = filtered.filter(t => t.category === categoryFilter)

  if (search.trim()) {
    const q = search.toLowerCase()
    filtered = filtered.filter(t =>
      t.truck?.toLowerCase().includes(q)       ||
      t.category?.toLowerCase().includes(q)   ||
      t.description?.toLowerCase().includes(q)||
      t.client?.toLowerCase().includes(q)
    )
  }

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date_desc')   return new Date(b.date) - new Date(a.date)
    if (sortBy === 'date_asc')    return new Date(a.date) - new Date(b.date)
    if (sortBy === 'amount_desc') return b.amount - a.amount
    if (sortBy === 'amount_asc')  return a.amount - b.amount
    return 0
  })

  const filteredTransactions = filtered

  // ── Cálculos desde byPeriod ──────────────────────────────────
  const metrics       = calcMetrics(byPeriod)
  const profitByTruck = calcProfitByTruck(byPeriod, trucks)
  const alerts        = generateAlerts(byPeriod, trucks)

  const mostProfitable  = profitByTruck.reduce((a, b) => b.profit  > a.profit  ? b : a, profitByTruck[0] || null)
  const highestIncome   = profitByTruck.reduce((a, b) => b.income  > a.income  ? b : a, profitByTruck[0] || null)
  const highestExpense  = profitByTruck.reduce((a, b) => b.expense > a.expense ? b : a, profitByTruck[0] || null)

  // Desglose operativo para SummaryCards (siempre sobre filtrado actual)
  const expenses = filteredTransactions.filter(t => t.type === 'expense')
  const incomes  = filteredTransactions.filter(t => t.type === 'income')

  const totalExpense      = expenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome       = incomes.reduce((s, t) => s + t.amount, 0)
  const netProfit         = totalIncome - totalExpense
  const totalCombustible  = expenses.filter(t => t.category === 'Combustible').reduce((s, t) => s + t.amount, 0)
  const totalMantenimiento = expenses.filter(t => ['Mantenimiento','Repuestos'].includes(t.category)).reduce((s, t) => s + t.amount, 0)
  const totalSalarios     = expenses.filter(t => t.category === 'Salarios').reduce((s, t) => s + t.amount, 0)

  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear  = now.getFullYear()
  const thisWeek  = getWeekNumber(now)

  const incomeMonth = incomes.filter(t => {
    const d = new Date(t.date + 'T00:00:00')
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear
  }).reduce((s, t) => s + t.amount, 0)

  const incomeWeek = incomes.filter(t => {
    const d = new Date(t.date + 'T00:00:00')
    return getWeekNumber(d) === thisWeek && d.getFullYear() === thisYear
  }).reduce((s, t) => s + t.amount, 0)

  return (
    <div className="app">
      <Header />

      <main className="app__content">
        <div className="dashboard">

          <div className="dashboard__top-controls">
            <FleetFilter
              trucks={trucks}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <button 
              className="btn-vehicle-manager"
              onClick={() => setShowVehicleManager(true)}
              title="Gestionar vehículos"
            >
              🚛 Gestionar vehículos
            </button>
            <ExportButton transactions={transactions} trucks={trucks} />
          </div>

          {/* Filtro por período — Día 5 */}
          <PeriodFilter
            period={period}
            onPeriodChange={setPeriod}
            customStart={customStart}
            customEnd={customEnd}
            onCustomChange={handleCustomChange}
          />

          {/* Alertas financieras — Día 5 */}
          <AlertsPanel alerts={alerts} />

          {/* Reporte del período — Día 5 */}
          <FinancialReport metrics={metrics} period={period} />

          <SummaryCards
            totalExpense={totalExpense}
            totalIncome={totalIncome}
            netProfit={netProfit}
            totalCombustible={totalCombustible}
            totalMantenimiento={totalMantenimiento}
            totalSalarios={totalSalarios}
            incomeMonth={incomeMonth}
            incomeWeek={incomeWeek}
          />

          {trucks.length > 0 && (
            <ProfitabilityTable
              profitByTruck={profitByTruck}
              mostProfitable={mostProfitable}
              highestIncome={highestIncome}
              highestExpense={highestExpense}
              onTruckClick={handleTruckClick}
            />
          )}

          <ExpenseChart transactions={filteredTransactions} />

          {/* Análisis de categorías — Día 5 */}
          <CategoryAnalysis metrics={metrics} />

          <SearchAndFilters
            search={search}
            onSearch={setSearch}
            typeFilter={typeFilter}
            onTypeFilter={setTypeFilter}
            categoryFilter={categoryFilter}
            onCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            onSort={setSortBy}
          />

          <div className="dashboard__bottom">
            <TransactionForm onAdd={handleAddTransaction} trucks={trucks} />
            <TransactionList
              transactions={filteredTransactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditClick}
            />
          </div>

        </div>
      </main>

      <footer className="app__footer">
        <div className="app__footer-inner">
          <div className="app__footer-brand">AJ Trucks</div>
          <div className="app__footer-copy">
            <span>Versión 1.0</span>
            <span>{thisYear}</span>
            <span>Desarrollado por Camilo Botero</span>
          </div>
        </div>
      </footer>

      {/* Modales y notificaciones */}
      <EditModal
        isOpen={editingTransaction !== null}
        transaction={editingTransaction}
        trucks={trucks}
        onSave={handleEditSave}
        onCancel={() => setEditingTransaction(null)}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        message="Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowConfirmModal(false)
          setPendingDeleteId(null)
        }}
      />

      {showVehicleManager && (
        <div className="modal-overlay" onClick={() => setShowVehicleManager(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowVehicleManager(false)}>✕</button>
            <VehicleManager
              trucks={trucks}
              transactions={transactions}
              onAddTruck={handleAddTruck}
              onEditTruck={handleEditTruck}
              onDeleteTruck={handleDeleteTruck}
              onTruckClick={handleTruckClick}
            />
          </div>
        </div>
      )}

      <TruckReportModal
        isOpen={showTruckReport}
        truck={selectedTruck}
        transactions={transactions}
        onClose={() => {
          setShowTruckReport(false)
          setSelectedTruck(null)
        }}
      />

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

// Utilidad: número de semana del año
function getWeekNumber(date) {
  const d   = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export default App