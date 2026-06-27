import '../styles/Header.css'

function Header() {
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="header">
      <div className="header__inner">

        <div className="header__brand">
          <img
            className="header__logo"
            src="/LogoCamiones.png"
            alt="AJ Trucks"
            loading="lazy"
          />
          <div className="header__title-group">
            <span className="header__title">AJ Trucks</span>
            <span className="header__subtitle">Gestión financiera de flota</span>
          </div>
        </div>

        <div className="header__badge">
          <span className="header__badge-dot" />
          Datos sincronizados
        </div>

        <span className="header__date">{today}</span>

      </div>
    </header>
  )
}

export default Header
