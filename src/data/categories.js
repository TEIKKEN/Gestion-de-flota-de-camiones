// ── Categorías operativas de flota de transporte ─────────────────────────

export const CATEGORIES = [
  { value: 'Combustible',   label: 'Combustible',   emoji: '⛽', color: '#f59e0b' },
  { value: 'Peajes',        label: 'Peajes',         emoji: '🛣️',  color: '#3b82f6' },
  { value: 'Mantenimiento', label: 'Mantenimiento',  emoji: '🔧', color: '#22c987' },
  { value: 'Repuestos',     label: 'Repuestos',      emoji: '⚙️',  color: '#a855f7' },
  { value: 'Salarios',      label: 'Salarios',       emoji: '👷', color: '#06b6d4' },
  { value: 'Seguros',       label: 'Seguros',        emoji: '🛡️',  color: '#ec4899' },
  { value: 'Parqueaderos',  label: 'Parqueaderos',   emoji: '🅿️',  color: '#f97316' },
  { value: 'Imprevistos',   label: 'Imprevistos',    emoji: '⚠️',  color: '#eab308' },
  { value: 'Otros',         label: 'Otros',          emoji: '📦', color: '#8891a8' },
]

export const CATEGORY_COLORS = Object.fromEntries(
  CATEGORIES.map(c => [c.value, c.color])
)