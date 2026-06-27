import '../styles/PeriodFilter.css'

const OPTIONS = [
  { value: 'all',    label: 'Todo' },
  { value: 'today',  label: 'Hoy' },
  { value: 'week',   label: 'Esta semana' },
  { value: 'month',  label: 'Este mes' },
  { value: 'year',   label: 'Este año' },
  { value: 'custom', label: '📅 Personalizado' },
]

function PeriodFilter({ period, onPeriodChange, customStart, customEnd, onCustomChange }) {
  return (
    <div className="period-filter">
      <span className="period-filter__label">⏱ Período:</span>

      <div className="period-filter__options">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`period-btn ${period === opt.value ? 'period-btn--active' : ''}`}
            onClick={() => onPeriodChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {period === 'custom' && (
        <div className="period-filter__custom">
          <input
            type="date"
            value={customStart}
            onChange={e => onCustomChange('start', e.target.value)}
          />
          <span className="period-filter__arrow">→</span>
          <input
            type="date"
            value={customEnd}
            onChange={e => onCustomChange('end', e.target.value)}
          />
        </div>
      )}
    </div>
  )
}

export default PeriodFilter