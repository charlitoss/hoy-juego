import { useState, useEffect } from 'react'
import EditableMatchHeader from './EditableMatchHeader'
import InscriptionStep from './InscriptionStep'
import TeamBuilderStep from './TeamBuilderStep'
import JoinMatchModal from '../player/JoinMatchModal'
import { Storage } from '../../utils/storage'

function MatchPage({ matchId, onNavigate }) {
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [teamBuilderAddPlayer, setTeamBuilderAddPlayer] = useState(null)
  
  useEffect(() => {
    setShowJoinModal(false)  // Reset modal state on navigation
    loadMatch()
  }, [matchId])
  
  const loadMatch = () => {
    setLoading(true)
    setError(null)
    
    try {
      const matches = Storage.getMatches()
      const foundMatch = matches[matchId]
      
      if (!foundMatch) {
        setError('Partido no encontrado')
        setMatch(null)
      } else {
        setMatch(foundMatch)
      }
    } catch (err) {
      setError('Error al cargar el partido')
    } finally {
      setLoading(false)
    }
  }
  
  const handleContinueToTeamBuilder = () => {
    // Reload match to get updated state
    loadMatch()
  }
  
  const handleMatchUpdate = (updatedMatch) => {
    setMatch(updatedMatch)
  }
  
  const handleBack = () => {
    onNavigate('#/')
  }
  
  const handleAddPlayer = () => {
    if (match?.pasoActual === 'armado_equipos') {
      // In team builder, only open modal if handler is registered
      if (teamBuilderAddPlayer) {
        teamBuilderAddPlayer()
      }
      // If handler not registered yet, do nothing (wait for TeamBuilderStep to mount)
    } else {
      setShowJoinModal(true)
    }
  }
  
  const handlePlayerJoined = () => {
    loadMatch()
  }
  
  // Handle when players per team is reduced - remove excess players using LIFO
  const handlePlayersPerTeamChange = (newPlayersPerTeam, oldPlayersPerTeam) => {
    if (newPlayersPerTeam >= oldPlayersPerTeam) return
    
    // Get current team config
    const teamConfig = Storage.getTeamConfig(match.id)
    if (!teamConfig || !teamConfig.asignaciones) return
    
    // Get registrations to sort by timestamp
    const registrations = Storage.getRegistrations(match.id)
    
    // Process each team
    const teams = ['blanco', 'oscuro']
    let updatedAssignments = [...teamConfig.asignaciones]
    
    teams.forEach(team => {
      const teamAssignments = updatedAssignments.filter(a => a.equipo === team)
      
      if (teamAssignments.length > newPlayersPerTeam) {
        // Sort by registration timestamp DESCENDING (newest first = to be removed)
        const sortedAssignments = teamAssignments.sort((a, b) => {
          const regA = registrations.find(r => r.jugadorId === a.jugadorId)
          const regB = registrations.find(r => r.jugadorId === b.jugadorId)
          const timeA = regA?.timestamp ? new Date(regA.timestamp) : new Date(0)
          const timeB = regB?.timestamp ? new Date(regB.timestamp) : new Date(0)
          return timeB - timeA // Descending: newest first
        })
        
        // Keep only the first newPlayersPerTeam (oldest registered players)
        const playersToKeep = sortedAssignments.slice(sortedAssignments.length - newPlayersPerTeam)
        const playerIdsToKeep = new Set(playersToKeep.map(a => a.jugadorId))
        
        // Filter out removed players from this team
        updatedAssignments = updatedAssignments.filter(a => 
          a.equipo !== team || playerIdsToKeep.has(a.jugadorId)
        )
      }
    })
    
    // Save updated config
    const updatedConfig = {
      ...teamConfig,
      asignaciones: updatedAssignments
    }
    Storage.saveTeamConfig(updatedConfig)
  }
  
  if (loading) {
    return (
      <div className="match-page">
        <div className="loading">Cargando partido...</div>
      </div>
    )
  }
  
  if (error || !match) {
    return (
      <div className="match-page">
        <div className="error-state">
          <h3>Error</h3>
          <p>{error || 'Partido no encontrado'}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="match-page">
      {/* Editable Header */}
      <EditableMatchHeader 
        match={match}
        onMatchUpdate={handleMatchUpdate}
        onBack={handleBack}
        onAddPlayer={handleAddPlayer}
        onPlayersPerTeamChange={handlePlayersPerTeamChange}
      />
      
      {/* Content based on current step */}
      {match.pasoActual === 'inscripcion' && (
        <InscriptionStep 
          match={match} 
          onContinue={handleContinueToTeamBuilder}
        />
      )}
      
      {match.pasoActual === 'armado_equipos' && (
        <TeamBuilderStep 
          match={match}
          onBack={handleBack}
          onRegisterAddPlayerHandler={setTeamBuilderAddPlayer}
        />
      )}
      
      {match.pasoActual === 'finalizado' && (
        <div className="team-builder-placeholder">
          <h2>Partido Finalizado</h2>
          <p>Este partido ya ha sido completado</p>
        </div>
      )}
      
      {/* Join Match Modal - only render when NOT in inscription step (InscriptionStep has its own modal) */}
      {match.pasoActual !== 'inscripcion' && (
        <JoinMatchModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          matchId={match.id}
          match={match}
          onJoined={handlePlayerJoined}
        />
      )}
    </div>
  )
}

export default MatchPage
