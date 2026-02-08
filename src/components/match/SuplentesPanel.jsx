import { Clock, ArrowUp } from 'lucide-react'
import { PHYSICAL_STATES } from '../../utils/constants'

function SuplentesPanel({ suplentes, players, registrations, onPromote }) {
  // Get physical state for a player
  const getPhysicalState = (playerId) => {
    const reg = registrations.find(r => r.jugadorId === playerId)
    return PHYSICAL_STATES[reg?.estadoFisico] || PHYSICAL_STATES.normal
  }
  
  if (suplentes.length === 0) {
    return null
  }
  
  // Sort by timestamp (oldest first = higher priority)
  const sortedSuplentes = [...suplentes].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  )
  
  return (
    <div className="suplentes-panel">
      <div className="suplentes-header">
        <Clock size={14} />
        <span>Suplentes ({suplentes.length})</span>
      </div>
      <div className="suplentes-list">
        {sortedSuplentes.map((reg, index) => {
          const player = players[reg.jugadorId]
          if (!player) return null
          
          const state = getPhysicalState(player.id)
          
          return (
            <div key={player.id} className="suplente-item">
              <span className="suplente-priority">{index + 1}</span>
              <span className="suplente-name">{player.nombre}</span>
              <span className="suplente-state">{state.emoji}</span>
              {onPromote && (
                <button 
                  className="btn-promote"
                  onClick={() => onPromote(player.id)}
                  title="Promover a jugador"
                >
                  <ArrowUp size={12} />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SuplentesPanel
