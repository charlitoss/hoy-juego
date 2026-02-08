function BalanceIndicator({ teamStats, teamConfig }) {
  const { blanco, oscuro } = teamStats
  
  // Calculate divergent bar values
  // Scale: 1-10, center at 5.5 (midpoint)
  const minLevel = 1
  const maxLevel = 10
  const range = maxLevel - minLevel
  
  // Calculate percentage from center (0-50% each side)
  const blancoPercent = ((blanco.avgLevel - minLevel) / range) * 100
  const oscuroPercent = ((oscuro.avgLevel - minLevel) / range) * 100
  
  return (
    <div className="balance-indicator">
      <h4 className="balance-title">Balance de Equipos</h4>
      
      {/* Divergent bar chart */}
      <div className="balance-divergent">
        {/* Team labels with values */}
        <div className="divergent-labels">
          <div className="divergent-label-left">
            <span className="divergent-team-name">{teamConfig.nombreEquipoBlanco}</span>
            <span className="divergent-value team-blanco">{blanco.avgLevel.toFixed(1)}</span>
          </div>
          <div className="divergent-label-right">
            <span className="divergent-value team-oscuro">{oscuro.avgLevel.toFixed(1)}</span>
            <span className="divergent-team-name">{teamConfig.nombreEquipoOscuro}</span>
          </div>
        </div>
        
        {/* Divergent bars */}
        <div className="divergent-bar-container">
          <div className="divergent-bar-side divergent-bar-left">
            <div 
              className="divergent-segment team-blanco"
              style={{ width: `${blancoPercent}%` }}
            />
          </div>
          <div className="divergent-bar-center" />
          <div className="divergent-bar-side divergent-bar-right">
            <div 
              className="divergent-segment team-oscuro"
              style={{ width: `${oscuroPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceIndicator
