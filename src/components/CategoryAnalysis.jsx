import '../styles/CategoryAnalysis.css'
import { fmt } from '../assets/utils/calculations'
import { CATEGORY_COLORS } from '../data/categories'

function CategoryAnalysis({ metrics }) {
  const { catEntries, totalExpense, topCategory, bottomCategory } = metrics

  if (!catEntries || catEntries.length === 0) return null

  return (
    <div className="category-analysis">
      <div className="category-analysis__header">
        <h2 className="category-analysis__title">Análisis de categorías</h2>
      </div>

      {/* Indicadores rápidos */}
      <div className="category-analysis__highlights">
        {topCategory && (
          <div className="cat-highlight cat-highlight--top">
            <span className="cat-highlight__label">Mayor inversión</span>
            <span className="cat-highlight__name">{topCategory[0]}</span>
            <span className="cat-highlight__value">{fmt(topCategory[1])}</span>
          </div>
        )}
        {bottomCategory && bottomCategory[0] !== topCategory?.[0] && (
          <div className="cat-highlight cat-highlight--bottom">
            <span className="cat-highlight__label">Menor inversión</span>
            <span className="cat-highlight__name">{bottomCategory[0]}</span>
            <span className="cat-highlight__value">{fmt(bottomCategory[1])}</span>
          </div>
        )}
      </div>

      {/* Barra por categoría */}
      <div className="category-analysis__bars">
        {catEntries.map(([cat, amount]) => {
          const pct   = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
          const color = CATEGORY_COLORS[cat] || '#8891a8'
          return (
            <div key={cat} className="cat-bar-row">
              <div className="cat-bar-row__info">
                <span className="cat-bar-row__name">{cat}</span>
                <span className="cat-bar-row__pct">{Math.round(pct)}%</span>
              </div>
              <div className="cat-bar-row__track">
                <div
                  className="cat-bar-row__fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              <span className="cat-bar-row__value">{fmt(amount)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryAnalysis