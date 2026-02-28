import { Eye } from 'lucide-react'

function HinchadaPanel({ hinchada, players }) {
  if (hinchada.length === 0) {
    return null
  }
  
  return (
    <div className="hinchada-panel">
      <div className="hinchada-header">
        <Eye size={14} />
        <span>Hinchada ({hinchada.length})</span>
      </div>
      <div className="hinchada-list">
        {hinchada.map((reg) => {
          const player = players[reg.jugadorId]
          if (!player) return null
          
          const playerId = player._id || player.id
          return (
            <div key={playerId} className="hinchada-item">
              <Eye size={14} className="hinchada-icon" />
              <span className="hinchada-name">{player.nombre}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HinchadaPanel
