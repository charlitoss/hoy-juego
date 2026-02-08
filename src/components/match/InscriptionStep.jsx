import { useState, useEffect, useCallback, useMemo } from 'react'
import { UserPlus, ArrowRight, Plus } from 'lucide-react'
import ProgressBar from '../ui/ProgressBar'
import PlayerCard from '../player/PlayerCard'
import JoinMatchModal from '../player/JoinMatchModal'
import PlayerInfoModal from '../player/PlayerInfoModal'
import { Storage } from '../../utils/storage'

// Empty slot component for available spots
function EmptySlot({ index, onClick }) {
  return (
    <div className="empty-slot" onClick={onClick}>
      <span className="empty-slot-index">{index + 1}.</span>
      <span className="empty-slot-text">Lugar disponible</span>
      <Plus size={14} className="empty-slot-icon" />
    </div>
  )
}

function InscriptionStep({ match, onContinue }) {
  const [registrations, setRegistrations] = useState([])
  const [players, setPlayers] = useState({})
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showPlayerInfo, setShowPlayerInfo] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  
  // Load registrations and players
  const loadData = useCallback(() => {
    const regs = Storage.getRegistrations(match.id).filter(r => r.asistira)
    setRegistrations(regs)
    
    const allPlayers = Storage.getPlayers()
    setPlayers(allPlayers)
  }, [match.id])
  
  // Reset modal state and load data when component mounts or match changes
  useEffect(() => {
    setShowJoinModal(false)
    loadData()
  }, [match.id, loadData])
  
  // Sort registrations by timestamp (oldest first = order of inscription)
  const sortedRegistrations = useMemo(() => {
    return [...registrations].sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp)
    })
  }, [registrations])
  
  const confirmedCount = registrations.length
  const requiredCount = match.cantidadJugadores
  const isQuotaComplete = confirmedCount >= requiredCount
  
  const handleJoined = () => {
    loadData()
  }
  
  const handleViewPlayerInfo = (player) => {
    const reg = registrations.find(r => r.jugadorId === player.id)
    setSelectedPlayer(player)
    setSelectedRegistration(reg)
    setShowPlayerInfo(true)
  }
  
  const handleContinue = () => {
    if (isQuotaComplete && onContinue) {
      // Update match step
      const updatedMatch = {
        ...match,
        pasoActual: 'armado_equipos',
        updatedAt: new Date().toISOString()
      }
      Storage.saveMatch(updatedMatch)
      onContinue()
    }
  }
  
  return (
    <div className="inscription-step">
      <p className="step-title">Paso 1: Inscripción de Jugadores</p>
      
      <ProgressBar 
        current={confirmedCount} 
        total={requiredCount} 
      />
      
      <div className="player-list-section">
        <div className="player-list-header">
          <h3>Jugadores ({confirmedCount}/{requiredCount})</h3>
        </div>
        
        <div className="player-list compact-list">
          {/* Jugadores confirmados */}
          {sortedRegistrations.map((registration, index) => {
            const player = players[registration.jugadorId]
            if (!player) return null
            
            return (
              <PlayerCard
                key={registration.jugadorId}
                player={player}
                registration={registration}
                onViewInfo={handleViewPlayerInfo}
                index={index}
                compact={true}
              />
            )
          })}
          
          {/* Lugares vacíos */}
          {Array.from({ length: Math.max(0, requiredCount - confirmedCount) }).map((_, index) => (
            <EmptySlot
              key={`empty-${index}`}
              index={confirmedCount + index}
              onClick={() => setShowJoinModal(true)}
            />
          ))}
        </div>
      </div>
      
      <div className="inscription-actions">
        <button 
          className={`btn-continue ${isQuotaComplete ? 'ready' : ''}`}
          onClick={handleContinue}
          disabled={!isQuotaComplete}
        >
          <span>Continuar al Armado de Equipos</span>
          <ArrowRight size={20} />
        </button>
        
        {!isQuotaComplete && (
          <p className="continue-hint">
            Necesitas {requiredCount - confirmedCount} jugador{requiredCount - confirmedCount !== 1 ? 'es' : ''} más para continuar
          </p>
        )}
      </div>
      
      <JoinMatchModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        matchId={match.id}
        onJoined={handleJoined}
        playerOnly={!isQuotaComplete}
      />
      
      <PlayerInfoModal
        isOpen={showPlayerInfo}
        onClose={() => setShowPlayerInfo(false)}
        player={selectedPlayer}
        registration={selectedRegistration}
      />
    </div>
  )
}

export default InscriptionStep
