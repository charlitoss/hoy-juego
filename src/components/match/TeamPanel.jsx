import { useState } from 'react'
import { X, Info, Edit2, Check, ArrowLeftRight, UserPlus, ChevronUp } from 'lucide-react'
import { PHYSICAL_STATES } from '../../utils/constants'

// Empty slot component for team spots
function EmptyTeamSlot({ index, onClick, team, suplente, onPromote, allPlayers }) {
  const suplentePlayer = suplente ? allPlayers[suplente.jugadorId] : null
  
  return (
    <div className="empty-team-slot">
      <span className="empty-slot-index">{index + 1}.</span>
      {suplente && suplentePlayer ? (
        <button 
          className="empty-slot-promote-btn"
          onClick={() => onPromote(suplente.jugadorId, team)}
          title={`Promover a ${suplentePlayer.nombre}`}
        >
          <ChevronUp size={14} />
          <span className="empty-slot-suplente-name">{suplentePlayer.nombre}</span>
        </button>
      ) : (
        <button 
          className="empty-slot-add-btn"
          onClick={() => onClick(team)}
        >
          <UserPlus size={14} />
          <span>Agregar jugador</span>
        </button>
      )}
    </div>
  )
}

function TeamPanel({
  team, // 'blanco' or 'oscuro'
  teamName,
  players, // Array of { player, ...assignment }
  registrations,
  suplentes, // Array of suplente registrations
  allPlayers, // Object of all players by ID
  onViewInfo,
  onUnassign,
  onSwapTeam, // Callback to swap player to other team
  onAddPlayer, // Prop for adding player
  onPromoteSuplente, // Callback to promote a suplente to this team
  onTeamNameChange, // Callback for name change
  jugadoresPorEquipo // Number of players per team
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggingPlayerId, setDraggingPlayerId] = useState(null)
  
  // Drag handlers for player rows
  const handleDragStart = (e, playerId) => {
    setDraggingPlayerId(playerId)
    e.dataTransfer.setData('text/plain', JSON.stringify({ playerId, fromTeam: team }))
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragEnd = () => {
    setDraggingPlayerId(null)
  }
  
  // Drop zone handlers for the panel
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }
  
  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return
    setIsDragOver(false)
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (data.fromTeam && data.fromTeam !== team && data.playerId) {
        onSwapTeam(data.playerId)
      }
    } catch (err) {
      // Ignore invalid drag data
    }
  }
  
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
  
  // Render assigned player with index
  const renderAssignedPlayer = (assignment, index) => {
    const player = assignment.player
    if (!player) return null
    
    const playerId = player._id || player.id
    const state = getPhysicalState(playerId)
    
    const isDragging = draggingPlayerId === playerId
    
    return (
      <div 
        key={playerId} 
        className={`team-panel-player team-${team} ${isDragging ? 'dragging' : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, playerId)}
        onDragEnd={handleDragEnd}
      >
        <div className="team-panel-player-info">
          <span className="team-panel-player-number">{index + 1}.</span>
          <span className="team-panel-player-name">{player.nombre}</span>
          <span className="team-panel-player-state">{state.emoji}</span>
        </div>
        <div className="team-panel-player-meta">
          <div className="team-panel-player-actions">
            <button 
              className="btn-icon-sm btn-swap-team"
              onClick={() => onSwapTeam(playerId)}
              title="Cambiar al otro equipo"
            >
              <ArrowLeftRight size={14} />
            </button>
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
    <div 
      className={`team-panel team-panel-${team} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
        {jugadoresPorEquipo && Array.from({ length: Math.max(0, jugadoresPorEquipo - players.length) }).map((_, index) => {
          const sortedSuplentes = [...(suplentes || [])].sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          )
          const suplente = sortedSuplentes[index]
          
          return (
            <EmptyTeamSlot
              key={`empty-${index}`}
              index={players.length + index}
              onClick={onAddPlayer}
              team={team}
              suplente={suplente}
              onPromote={onPromoteSuplente}
              allPlayers={allPlayers}
            />
          )
        })}
      </div>
    </div>
  )
}

export default TeamPanel
