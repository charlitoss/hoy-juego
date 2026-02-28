function ProgressBar({ current, total, showMessage = true }) {
  const percentage = Math.min((current / total) * 100, 100)
  const isComplete = current >= total
  const remaining = total - current
  
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-title">Jugadores {current}/{total}</span>
        {!isComplete && (
          <span className="progress-remaining">Faltan {remaining}</span>
        )}
      </div>
      <div className="progress-bar">
        <div 
          className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showMessage && isComplete && (
        <p className="progress-message complete">
          ¡Cupo completo! Puedes continuar al armado de equipos
        </p>
      )}
    </div>
  )
}

export default ProgressBar
