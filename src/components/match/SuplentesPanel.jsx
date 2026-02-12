import { Clock, ArrowUp } from 'lucide-react'
import { PHYSICAL_STATES } from '../../utils/constants'

function SuplentesPanel({ suplentes, players, registrations, onPromote, currentAssignments = [], playersPerTeam = 7 }) {
  // Get physical state for a player
  const getPhysicalState = (playerId) => {
    const reg = registrations.find(r => r.jugadorId === playerId)
    return PHYSICAL_STATES[reg?.estadoFisico] || PHYSICAL_STATES.normal
  }
  
  if (suplentes.length === 0) {
    return null
  }
  
  // Check if teams are full (can't promote if both teams are at capacity)
  const totalAssigned = currentAssignments.length
  const maxPlayers = playersPerTeam * 2
  const canPromote = totalAssigned < maxPlayers
  
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
              {onPromote && canPromote && (
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
      {!canPromote && suplentes.length > 0 && (
        <div className="suplentes-full-notice">
          Equipos completos
        </div>
      )}
    </div>
  )
}

export default SuplentesPanel
