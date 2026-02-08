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
    // If we're in team builder step and have a handler, use it
    if (match?.pasoActual === 'armado_equipos' && teamBuilderAddPlayer) {
      teamBuilderAddPlayer()
    } else {
      setShowJoinModal(true)
    }
  }
  
  const handlePlayerJoined = () => {
    loadMatch()
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
      
      {/* Join Match Modal */}
      <JoinMatchModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        matchId={match.id}
        match={match}
        onJoined={handlePlayerJoined}
      />
    </div>
  )
}

export default MatchPage
