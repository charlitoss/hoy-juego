import { Info } from 'lucide-react'
import { PHYSICAL_STATES } from '../../utils/constants'

function PlayerCard({ player, registration, onViewInfo, index, compact = false }) {
  const physicalState = PHYSICAL_STATES[registration?.estadoFisico] || PHYSICAL_STATES.normal
  
  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  
  // Compact version - single line, minimal
  if (compact) {
    return (
      <div className="player-card compact">
        <div className="player-card-left">
          {typeof index === 'number' && (
            <span className="player-index">{index + 1}.</span>
          )}
          <span className="player-name-compact">{player?.nombre || 'Jugador'}</span>
          <span className="physical-state-compact" title={physicalState.label}>
            {physicalState.emoji}
          </span>
        </div>
        {onViewInfo && (
          <button 
            className="btn-info-compact" 
            onClick={() => onViewInfo(player)}
            title="Ver información"
          >
            <Info size={14} />
          </button>
        )}
      </div>
    )
  }
  
  // Full version (original)
  return (
    <div className="player-card">
      <div className="player-card-left">
        <div className="player-avatar">
          {getInitials(player?.nombre)}
        </div>
        <div className="player-info">
          <h4>{player?.nombre || 'Jugador'}</h4>
          {player?.perfilPermanente?.posicionPreferida && (
            <span className="player-position">{player.perfilPermanente.posicionPreferida}</span>
          )}
        </div>
      </div>
      <div className="player-card-right">
        <span className="physical-state" title={physicalState.label}>
          {physicalState.emoji}
        </span>
        {onViewInfo && (
          <button className="btn-info" onClick={() => onViewInfo(player)}>
            Ver info
          </button>
        )}
      </div>
    </div>
  )
}

export default PlayerCard
