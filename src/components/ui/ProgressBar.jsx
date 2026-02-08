function ProgressBar({ current, total, showMessage = true }) {
  const percentage = Math.min((current / total) * 100, 100)
  const isComplete = current >= total
  const remaining = total - current
  
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-text">Progreso</span>
        <span className="progress-count">{current}/{total} jugadores</span>
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showMessage && (
        <p className={`progress-message ${isComplete ? 'complete' : ''}`}>
          {isComplete 
            ? '¡Cupo completo! Puedes continuar al armado de equipos'
            : `Faltan ${remaining} jugador${remaining !== 1 ? 'es' : ''} para continuar`
          }
        </p>
      )}
    </div>
  )
}

export default ProgressBar
