import { useState } from 'react'
import { Search, Check, X } from 'lucide-react'
import { PHYSICAL_STATES } from '../../utils/constants'

function PlayerListPanel({
  unassignedPlayers,
  blancoPlayers,
  oscuroPlayers,
  registrations,
  teamConfig,
  onAssignPlayer,
  onViewInfo,
  onUnassign
}) {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Filter players by search term
  const filterPlayers = (players) => {
    if (!searchTerm.trim()) return players
    const term = searchTerm.toLowerCase()
    return players.filter(p => {
      const name = p.player?.nombre || p.nombre || ''
      return name.toLowerCase().includes(term)
    })
  }
  
  // Get physical state for a player
  const getPhysicalState = (playerId) => {
    const reg = registrations.find(r => r.jugadorId === playerId)
    return PHYSICAL_STATES[reg?.estadoFisico] || PHYSICAL_STATES.normal
  }
  
  // Get role label
  const getRoleLabel = (role) => {
    const labels = {
      arquero: 'Arquero',
      defensor: 'Defensor',
      medio: 'Mediocampista',
      delantero: 'Delantero'
    }
    return labels[role] || role
  }
  
  // Render unassigned player item
  const renderUnassignedPlayer = (player) => {
    const state = getPhysicalState(player.id)
    
    return (
      <div 
        key={player.id} 
        className="player-list-item unassigned"
        onClick={() => onAssignPlayer(player)}
      >
        <div className="player-list-item-left">
          <div className="player-checkbox">
            <div className="checkbox-empty" />
          </div>
          <div className="player-list-info">
            <div className="player-list-name">
              {player.nombre}
              <span className="player-state-emoji">{state.emoji}</span>
            </div>
            <div className="player-list-position">
              {player.perfilPermanente?.posicionPreferida || 'Sin posición'}
            </div>
          </div>
        </div>
        <button 
          className="btn-info"
          onClick={(e) => {
            e.stopPropagation()
            onViewInfo(player)
          }}
        >
          Ver info
        </button>
      </div>
    )
  }
  
  // Render assigned player item
  const renderAssignedPlayer = (assignment, team) => {
    const player = assignment.player
    if (!player) return null
    
    const state = getPhysicalState(player.id)
    const teamLabel = team === 'blanco' ? teamConfig.nombreEquipoBlanco : teamConfig.nombreEquipoOscuro
    
    return (
      <div 
        key={player.id} 
        className={`player-list-item assigned team-${team}`}
        onClick={() => onAssignPlayer(player)}
      >
        <div className="player-list-item-left">
          <div className="player-checkbox">
            <div className={`checkbox-checked team-${team}`}>
              <Check size={12} />
            </div>
          </div>
          <div className="player-list-info">
            <div className="player-list-name">
              {player.nombre}
              <span className="player-state-emoji">{state.emoji}</span>
            </div>
            <div className="player-list-assignment">
              <span className={`team-indicator team-${team}`}>→ {teamLabel}</span>
              <span className="role-indicator">{getRoleLabel(assignment.rol)}</span>
            </div>
          </div>
        </div>
        <div className="player-list-actions">
          <button 
            className="btn-info"
            onClick={(e) => {
              e.stopPropagation()
              onViewInfo(player)
            }}
          >
            Ver info
          </button>
          <button 
            className="btn-remove"
            onClick={(e) => {
              e.stopPropagation()
              onUnassign(player.id)
            }}
            title="Quitar del equipo"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }
  
  const filteredUnassigned = filterPlayers(unassignedPlayers)
  const filteredBlanco = filterPlayers(blancoPlayers)
  const filteredOscuro = filterPlayers(oscuroPlayers)
  
  const totalPlayers = unassignedPlayers.length + blancoPlayers.length + oscuroPlayers.length
  
  return (
    <div className="player-list-panel">
      <div className="player-list-header">
        <h3>Jugadores ({totalPlayers})</h3>
      </div>
      
      {/* Search */}
      <div className="player-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="player-list-content">
        {/* Unassigned Players */}
        {filteredUnassigned.length > 0 && (
          <div className="player-list-section">
            <div className="section-header">
              <span>Sin asignar ({filteredUnassigned.length})</span>
            </div>
            <div className="player-list">
              {filteredUnassigned.map(renderUnassignedPlayer)}
            </div>
          </div>
        )}
        
        {/* Team Blanco */}
        {filteredBlanco.length > 0 && (
          <div className="player-list-section">
            <div className="section-header team-blanco">
              <span>{teamConfig.nombreEquipoBlanco} ({filteredBlanco.length})</span>
            </div>
            <div className="player-list">
              {filteredBlanco.map(a => renderAssignedPlayer(a, 'blanco'))}
            </div>
          </div>
        )}
        
        {/* Team Oscuro */}
        {filteredOscuro.length > 0 && (
          <div className="player-list-section">
            <div className="section-header team-oscuro">
              <span>{teamConfig.nombreEquipoOscuro} ({filteredOscuro.length})</span>
            </div>
            <div className="player-list">
              {filteredOscuro.map(a => renderAssignedPlayer(a, 'oscuro'))}
            </div>
          </div>
        )}
        
        {/* Empty state */}
        {totalPlayers === 0 && (
          <div className="player-list-empty">
            <p>No hay jugadores inscriptos</p>
          </div>
        )}
        
        {/* No search results */}
        {totalPlayers > 0 && 
         filteredUnassigned.length === 0 && 
         filteredBlanco.length === 0 && 
         filteredOscuro.length === 0 && (
          <div className="player-list-empty">
            <p>No se encontraron jugadores</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayerListPanel
