import '../styles/FleetFilter.css'

function FleetFilter({ trucks = [], activeFilter, onFilterChange }) {
  // No mostrar el filtro si no hay camiones aún
  if (trucks.length === 0) return null

  return (
    <div className="fleet-filter">
      <span className="fleet-filter__label">🚛 Filtrar por vehículo:</span>

      <div className="fleet-filter__buttons">

        <button
          className={`filter-btn ${activeFilter === 'all' ? 'filter-btn--active' : ''}`}
          onClick={() => onFilterChange('all')}
          type="button"
        >
          Todos
        </button>

        {trucks.map(truck => (
          <button
            key={truck}
            className={`filter-btn ${activeFilter === truck ? 'filter-btn--active' : ''}`}
            onClick={() => onFilterChange(truck)}
            type="button"
          >
            {truck}
          </button>
        ))}

      </div>
    </div>
  )
}

export default FleetFilter