import { useState } from 'react'
import { X, Info, Edit2, Check } from 'lucide-react'
import { PHYSICAL_STATES } from '../../utils/constants'

// Empty slot component for team spots
function EmptyTeamSlot({ index, onClick, team }) {
  return (
    <div className="empty-team-slot" onClick={() => onClick(team)}>
      <span className="empty-slot-index">{index + 1}.</span>
      <span className="empty-slot-text">Lugar disponible</span>
    </div>
  )
}

function TeamPanel({
  team, // 'blanco' or 'oscuro'
  teamName,
  players, // Array of { player, ...assignment }
  registrations,
  onViewInfo,
  onUnassign,
  onAddPlayer, // Prop for adding player
  onTeamNameChange, // Callback for name change
  jugadoresPorEquipo // Number of players per team
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  
  const handleStartEdit = () => {
    setEditName(teamName)
    setIsEditing(true)
  }
  
  const handleSave = () => {
    if (editName.trim() && onTeamNameChange) {
      onTeamNameChange(team, editName.trim())
    }
    setIsEditing(false)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }
  // Get physical state for a player
  const getPhysicalState = (playerId) => {
    const reg = registrations.find(r => r.jugadorId === playerId)
    return PHYSICAL_STATES[reg?.estadoFisico] || PHYSICAL_STATES.normal
  }
  
  // Get role abbreviation
  const getRoleAbbr = (role) => {
    const abbrs = {
      arquero: 'ARQ',
      defensor: 'DEF',
      medio: 'MED',
      delantero: 'DEL'
    }
    return abbrs[role] || ''
  }
  
  // Render assigned player with index
  const renderAssignedPlayer = (assignment, index) => {
    const player = assignment.player
    if (!player) return null
    
    const playerId = player._id || player.id
    const state = getPhysicalState(playerId)
    
    return (
      <div 
        key={playerId} 
        className={`team-panel-player team-${team}`}
      >
        <div className="team-panel-player-info">
          <span className="team-panel-player-number">{index + 1}.</span>
          <span className="team-panel-player-name">{player.nombre}</span>
          <span className="team-panel-player-state">{state.emoji}</span>
        </div>
        <div className="team-panel-player-meta">
          <span className="team-panel-player-role">{getRoleAbbr(assignment.rol)}</span>
          <div className="team-panel-player-actions">
            <button 
              className="btn-icon-sm"
              onClick={() => onViewInfo(player)}
              title="Ver información"
            >
              <Info size={14} />
            </button>
            <button 
              className="btn-icon-sm btn-remove-sm"
              onClick={() => onUnassign(playerId)}
              title="Quitar del equipo"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`team-panel team-panel-${team}`}>
      <div className={`team-panel-header team-${team}`}>
        {isEditing ? (
          <div className="team-panel-title-edit">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="team-name-input-inline"
              autoFocus
              maxLength={25}
            />
            <button className="btn-icon-sm btn-save-name" onClick={handleSave}>
              <Check size={14} />
            </button>
          </div>
        ) : (
          <h3 className="team-panel-title" onClick={handleStartEdit} title="Click para editar">
            {teamName}
            <Edit2 size={12} className="edit-icon-inline" />
          </h3>
        )}
        <span className="team-panel-count">{players.length}</span>
      </div>
      
      <div className="team-panel-list">
        {/* Jugadores asignados */}
        {players.map((assignment, index) => renderAssignedPlayer(assignment, index))}
        
        {/* Lugares vacíos */}
        {jugadoresPorEquipo && Array.from({ length: Math.max(0, jugadoresPorEquipo - players.length) }).map((_, index) => (
          <EmptyTeamSlot
            key={`empty-${index}`}
            index={players.length + index}
            onClick={onAddPlayer}
            team={team}
          />
        ))}
      </div>
    </div>
  )
}

export default TeamPanel
