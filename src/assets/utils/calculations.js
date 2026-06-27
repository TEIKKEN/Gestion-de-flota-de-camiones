// ============================================================
// CALCULATIONS — toda la lógica financiera centralizada
// ============================================================

// Formateador de pesos colombianos
export const fmt = n =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(n)

// ── Número de semana ISO ─────────────────────────────────────
export function getWeekNumber(date) {
  const d   = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

// ── Filtrar transacciones por período ────────────────────────
export function filterByPeriod(transactions, period, customStart = null, customEnd = null) {
  if (period === 'all') return transactions

  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return transactions.filter(t => {
    const date = new Date(t.date + 'T00:00:00')

    switch (period) {
      case 'today':
        return date >= today

      case 'week': {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7))
        return date >= weekStart
      }

      case 'month':
        return (
          date.getMonth()    === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        )

      case 'year':
        return date.getFullYear() === now.getFullYear()

      case 'custom': {
        if (!customStart || !customEnd) return true
        const start = new Date(customStart + 'T00:00:00')
        const end   = new Date(customEnd   + 'T23:59:59')
        return date >= start && date <= end
      }

      default:
        return true
    }
  })
}

// ── Métricas completas de un conjunto de transacciones ───────
export function calcMetrics(transactions) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const incomes  = transactions.filter(t => t.type === 'income')

  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome  = incomes.reduce((s, t)  => s + t.amount, 0)

  const byCat = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {})

  const catEntries     = Object.entries(byCat).sort((a, b) => b[1] - a[1])
  const topCategory    = catEntries[0]                          || null
  const bottomCategory = catEntries[catEntries.length - 1]     || null

  return {
    totalExpense,
    totalIncome,
    netProfit:     totalIncome - totalExpense,
    expenseCount:  expenses.length,
    incomeCount:   incomes.length,
    totalCount:    transactions.length,
    avgExpense:    expenses.length ? totalExpense / expenses.length : 0,
    avgIncome:     incomes.length  ? totalIncome  / incomes.length  : 0,
    topCategory,
    bottomCategory,
    byCat,
    catEntries,
  }
}

// ── Rentabilidad por camión ──────────────────────────────────
export function calcProfitByTruck(transactions, trucks) {
  return trucks.map(truck => {
    const tx      = transactions.filter(t => t.truck === truck)
    const income  = tx.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
    const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { truck, income, expense, profit: income - expense, count: tx.length }
  })
}

// ── Alertas financieras automáticas ─────────────────────────
export function generateAlerts(transactions, trucks) {
  if (transactions.length === 0) return []

  const alerts   = []
  const expenses = transactions.filter(t => t.type === 'expense')
  const incomes  = transactions.filter(t => t.type === 'income')
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0)
  const totalIncome  = incomes.reduce((s, t)  => s + t.amount, 0)

  // 1 — Gastos globales > ingresos
  if (totalExpense > totalIncome) {
    alerts.push({
      id:      'global-loss',
      type:    'danger',
      icon:    '🚨',
      title:   'Gastos superiores a ingresos',
      message: `Los gastos (${fmt(totalExpense)}) superan los ingresos (${fmt(totalIncome)}) en el período seleccionado.`,
    })
  }

  // 2 — Camión individual en pérdida
  trucks.forEach(truck => {
    const tx      = transactions.filter(t => t.truck === truck)
    if (!tx.length) return
    const income  = tx.filter(t => t.type === 'income').reduce((s, t)  => s + t.amount, 0)
    const expense = tx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    if (expense > income) {
      alerts.push({
        id:      `loss-${truck}`,
        type:    'warning',
        icon:    '⚠️',
        title:   `${truck} en pérdida`,
        message: `Gastos ${fmt(expense)} vs ingresos ${fmt(income)}. Déficit de ${fmt(expense - income)}.`,
      })
    }
  })

  // 3 — Categoría supera el 60% del gasto total
  if (totalExpense > 0) {
    const byCat = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})
    Object.entries(byCat).forEach(([cat, amount]) => {
      const pct = (amount / totalExpense) * 100
      if (pct > 60) {
        alerts.push({
          id:      `cat-${cat}`,
          type:    'warning',
          icon:    '📊',
          title:   `Alta concentración en ${cat}`,
          message: `${cat} representa el ${Math.round(pct)}% del gasto total (${fmt(amount)}). Considera diversificar.`,
        })
      }
    })
  }

  // 4 — Camión inactivo más de 30 días
  const today = new Date()
  trucks.forEach(truck => {
    const tx = transactions.filter(t => t.truck === truck)
    if (!tx.length) return
    const lastDate = tx
      .map(t => new Date(t.date + 'T00:00:00'))
      .sort((a, b) => b - a)[0]
    const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
    if (diffDays > 30) {
      alerts.push({
        id:      `inactive-${truck}`,
        type:    'info',
        icon:    '💤',
        title:   `${truck} inactivo`,
        message: `Sin movimientos desde hace ${diffDays} días.`,
      })
    }
  })

  return alerts
}