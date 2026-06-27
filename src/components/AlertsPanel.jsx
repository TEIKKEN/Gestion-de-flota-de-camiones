import '../styles/AlertsPanel.css'

function AlertsPanel({ alerts }) {
  if (!alerts || alerts.length === 0) return null

  return (
    <div className="alerts-panel">
      <div className="alerts-panel__header">
        <h2 className="alerts-panel__title">Alertas financieras</h2>
        <span className="alerts-panel__count">{alerts.length}</span>
      </div>

      <div className="alerts-panel__list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-item alert-item--${alert.type}`}>
            <span className="alert-item__icon">{alert.icon}</span>
            <div className="alert-item__content">
              <p className="alert-item__title">{alert.title}</p>
              <p className="alert-item__message">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsPanel