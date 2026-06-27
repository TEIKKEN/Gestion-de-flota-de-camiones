import '../styles/SearchAndFilters.css'
import { CATEGORIES } from '../data/categories'

function SearchAndFilters({ search, onSearch, typeFilter, onTypeFilter, categoryFilter, onCategoryFilter, sortBy, onSort }) {
  return (
    <div className="search-filters">

      {/* Búsqueda */}
      <div className="search-filters__search">
        <span className="search-filters__icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar por vehículo, categoría o descripción…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
        {search && (
          <button className="search-filters__clear" onClick={() => onSearch('')}>✕</button>
        )}
      </div>

      {/* Filtros y ordenamiento */}
      <div className="search-filters__row">

        {/* Tipo */}
        <div className="filter-group">
          <label>Tipo</label>
          <select value={typeFilter} onChange={e => onTypeFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </select>
        </div>

        {/* Categoría */}
        <div className="filter-group">
          <label>Categoría</label>
          <select value={categoryFilter} onChange={e => onCategoryFilter(e.target.value)}>
            <option value="all">Todas</option>
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>

        {/* Ordenar */}
        <div className="filter-group">
          <label>Ordenar por</label>
          <select value={sortBy} onChange={e => onSort(e.target.value)}>
            <option value="date_desc">Más reciente</option>
            <option value="date_asc">Más antiguo</option>
            <option value="amount_desc">Mayor monto</option>
            <option value="amount_asc">Menor monto</option>
          </select>
        </div>

      </div>
    </div>
  )
}

export default SearchAndFilters