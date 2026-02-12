import { useState, useRef } from 'react'
import { PHYSICAL_STATES } from '../../utils/constants'

function SoccerField({ 
  teamConfig, 
  players, 
  registrations, 
  onPositionChange,
  onPlayerClick 
}) {
  const [dragging, setDragging] = useState(null)
  const fieldRef = useRef(null)
  
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
  
  // Drag and drop handlers
  const handleDragStart = (e, playerId) => {
    setDragging(playerId)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    if (!dragging || !fieldRef.current) return
    
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    // Clamp values
    const clampedX = Math.max(5, Math.min(95, x))
    const clampedY = Math.max(5, Math.min(95, y))
    
    onPositionChange(dragging, clampedX, clampedY)
    setDragging(null)
  }
  
  const handleDragEnd = () => {
    setDragging(null)
  }
  
  // Touch handlers for mobile
  const handleTouchStart = (e, playerId) => {
    setDragging(playerId)
  }
  
  const handleTouchMove = (e) => {
    if (!dragging || !fieldRef.current) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const rect = fieldRef.current.getBoundingClientRect()
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    const y = ((touch.clientY - rect.top) / rect.height) * 100
    
    const clampedX = Math.max(5, Math.min(95, x))
    const clampedY = Math.max(5, Math.min(95, y))
    
    onPositionChange(dragging, clampedX, clampedY)
  }
  
  const handleTouchEnd = () => {
    setDragging(null)
  }
  
  // Render player marker
  const renderPlayer = (assignment) => {
    const player = players[assignment.jugadorId]
    if (!player) return null
    
    const registration = registrations.find(r => r.jugadorId === assignment.jugadorId)
    const physicalState = PHYSICAL_STATES[registration?.estadoFisico] || PHYSICAL_STATES.normal
    const isBlanco = assignment.equipo === 'blanco'
    const isDragging = dragging === assignment.jugadorId
    
    return (
      <div
        key={assignment.jugadorId}
        className={`field-player ${isBlanco ? 'team-blanco' : 'team-oscuro'} ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${assignment.coordenadaX}%`,
          top: `${assignment.coordenadaY}%`,
        }}
        draggable
        onDragStart={(e) => handleDragStart(e, assignment.jugadorId)}
        onDragEnd={handleDragEnd}
        onTouchStart={(e) => handleTouchStart(e, assignment.jugadorId)}
        onClick={() => onPlayerClick(player)}
      >
        <div className="field-player-avatar">
          {getInitials(player.nombre)}
        </div>
        <div className="field-player-role">{getRoleAbbr(assignment.rol)}</div>
        <div className="field-player-state">{physicalState.emoji}</div>
        <div className="field-player-name">{player.nombre.split(' ')[0]}</div>
      </div>
    )
  }
  
  return (
    <div className="soccer-field-container">
      {/* Soccer Field SVG */}
      <div 
        ref={fieldRef}
        className="soccer-field"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg viewBox="0 0 100 150" className="field-svg" preserveAspectRatio="xMidYMid slice">
          {/* Field background */}
          <rect x="0" y="0" width="100" height="75" className="field-half field-half-light" />
          <rect x="0" y="75" width="100" height="75" className="field-half field-half-dark" />
          
          {/* Field lines */}
          <rect x="2" y="2" width="96" height="146" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5" />
          
          {/* Center line */}
          <line x1="2" y1="75" x2="98" y2="75" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" strokeDasharray="2,2" />
          
          {/* Center circle */}
          <circle cx="50" cy="75" r="12" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <circle cx="50" cy="75" r="1" fill="rgba(255,255,255,0.5)" />
          
          {/* Top goal area (Blanco) */}
          <rect x="30" y="2" width="40" height="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <rect x="38" y="2" width="24" height="9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          
          {/* Bottom goal area (Oscuro) */}
          <rect x="30" y="130" width="40" height="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          <rect x="38" y="139" width="24" height="9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
          
          {/* Corner arcs */}
          <path d="M 2 5 A 3 3 0 0 0 5 2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <path d="M 95 2 A 3 3 0 0 0 98 5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <path d="M 2 145 A 3 3 0 0 1 5 148" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
          <path d="M 95 148 A 3 3 0 0 1 98 145" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        </svg>
        
        {/* Player markers */}
        <div className="field-players">
          {teamConfig.asignaciones.map(renderPlayer)}
        </div>
        
        {/* Empty state */}
        {teamConfig.asignaciones.length === 0 && (
          <div className="field-empty">
            <p>Asigna jugadores a los equipos</p>
            <p>desde el panel lateral</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SoccerField
