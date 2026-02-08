import { useState, useEffect } from 'react'
import { X, UserPlus, Users, Clock, Eye } from 'lucide-react'
import Modal from '../ui/Modal'
import { PHYSICAL_STATES } from '../../utils/constants'
import { Storage } from '../../utils/storage'

const REGISTRATION_TYPES = {
  jugador: { label: 'Jugador', icon: Users, description: 'Jugar en el partido' },
  suplente: { label: 'Suplente', icon: Clock, description: 'En lista de espera' },
  hinchada: { label: 'Hinchada', icon: Eye, description: 'Ir a ver el partido' }
}

function JoinMatchModal({ isOpen, onClose, matchId, onJoined, match, playerOnly = false }) {
  // Main player (the person filling the form)
  const [nombre, setNombre] = useState('')
  const [estadoFisico, setEstadoFisico] = useState('normal')
  const [tipoInscripcion, setTipoInscripcion] = useState('jugador')
  
  // Friends to add
  const [friendName, setFriendName] = useState('')
  const [friends, setFriends] = useState([])
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Calculate available spots
  const [spotsInfo, setSpotsInfo] = useState({ jugadores: 0, suplentes: 0, cupoTotal: 0, maxSuplentes: 0 })
  
  useEffect(() => {
    if (isOpen && matchId) {
      const registrations = Storage.getRegistrations(matchId)
      const jugadores = registrations.filter(r => r.tipoInscripcion !== 'suplente' && r.tipoInscripcion !== 'hinchada').length
      const suplentes = registrations.filter(r => r.tipoInscripcion === 'suplente').length
      
      const matches = Storage.getMatches()
      const currentMatch = matches[matchId]
      const cupoTotal = currentMatch ? currentMatch.jugadoresPorEquipo * 2 : 10
      const maxSuplentes = Math.floor(cupoTotal / 2)
      
      setSpotsInfo({ jugadores, suplentes, cupoTotal, maxSuplentes })
      
      // If playerOnly mode, always set to jugador
      if (playerOnly) {
        setTipoInscripcion('jugador')
      } else {
        // Auto-select type based on availability
        if (jugadores >= cupoTotal) {
          if (suplentes >= maxSuplentes) {
            setTipoInscripcion('hinchada')
          } else {
            setTipoInscripcion('suplente')
          }
        } else {
          setTipoInscripcion('jugador')
        }
      }
    }
  }, [isOpen, matchId, playerOnly])
  
  // Check if type is available
  const isTypeAvailable = (type) => {
    if (type === 'jugador') {
      return spotsInfo.jugadores < spotsInfo.cupoTotal
    }
    if (type === 'suplente') {
      return spotsInfo.suplentes < spotsInfo.maxSuplentes
    }
    return true // hinchada always available
  }
  
  // Add friend to the list
  const handleAddFriend = () => {
    setError('')
    
    const trimmedName = friendName.trim()
    if (!trimmedName) {
      setError('Ingresa el nombre del amigo')
      return
    }
    
    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }
    
    // Check if same as main player
    if (nombre.trim().toLowerCase() === trimmedName.toLowerCase()) {
      setError('El amigo no puede tener el mismo nombre que tú')
      return
    }
    
    // Check if already in the friends list
    const alreadyInList = friends.some(
      f => f.nombre.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (alreadyInList) {
      setError('Este amigo ya está en la lista')
      return
    }
    
    // Check if already registered in the match
    const existingRegistrations = Storage.getRegistrations(matchId)
    const players = Storage.getPlayers()
    const existingPlayer = Object.values(players).find(
      p => p.nombre.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (existingPlayer) {
      const alreadyRegistered = existingRegistrations.some(
        r => r.jugadorId === existingPlayer.id
      )
      if (alreadyRegistered) {
        setError('Este jugador ya está inscrito en el partido')
        return
      }
    }
    
    // Add to friends list
    setFriends([
      ...friends,
      {
        id: Date.now().toString(),
        nombre: trimmedName
      }
    ])
    
    // Clear friend input
    setFriendName('')
  }
  
  // Remove friend from list
  const handleRemoveFriend = (id) => {
    setFriends(friends.filter(f => f.id !== id))
  }
  
  // Submit main player + friends
  const handleSubmit = () => {
    setError('')
    
    // Validate main player name
    const trimmedName = nombre.trim()
    if (!trimmedName) {
      setError('Por favor ingresa tu nombre')
      return
    }
    
    if (trimmedName.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }
    
    // Check if main player already registered
    const existingRegistrations = Storage.getRegistrations(matchId)
    const allPlayers = Storage.getPlayers()
    const existingMainPlayer = Object.values(allPlayers).find(
      p => p.nombre.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (existingMainPlayer) {
      const alreadyRegistered = existingRegistrations.some(
        r => r.jugadorId === existingMainPlayer.id
      )
      if (alreadyRegistered) {
        setError('Ya estás inscrito en este partido')
        return
      }
    }
    
    // Check availability for selected type
    if (!isTypeAvailable(tipoInscripcion)) {
      setError(`No hay más lugares disponibles como ${REGISTRATION_TYPES[tipoInscripcion].label.toLowerCase()}`)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const players = { ...allPlayers }
      
      // 1. Register main player
      let mainPlayer = Object.values(players).find(
        p => p.nombre.toLowerCase() === trimmedName.toLowerCase()
      )
      
      if (!mainPlayer) {
        mainPlayer = {
          id: Storage.generateId(),
          nombre: trimmedName,
          avatar: null,
          perfilPermanente: {
            posicionPreferida: 'Mediocampista',
            posicionesSecundarias: [],
            atributos: {
              velocidad: 5,
              tecnica: 5,
              resistencia: 5,
              defensa: 5,
              ataque: 5,
              pase: 5
            },
            nivelGeneral: 5
          }
        }
        Storage.savePlayer(mainPlayer)
        players[mainPlayer.id] = mainPlayer
      }
      
      const mainRegistration = {
        jugadorId: mainPlayer.id,
        partidoId: matchId,
        estadoFisico: tipoInscripcion === 'hinchada' ? 'normal' : estadoFisico,
        tipoInscripcion: tipoInscripcion,
        timestamp: new Date().toISOString(),
        confirmado: true,
        asistira: true
      }
      Storage.saveRegistration(mainRegistration)
      
      // 2. Register friends (same type as main player, except hinchada friends are also hinchada)
      friends.forEach((friend, index) => {
        let friendPlayer = Object.values(players).find(
          p => p.nombre.toLowerCase() === friend.nombre.toLowerCase()
        )
        
        if (!friendPlayer) {
          friendPlayer = {
            id: Storage.generateId(),
            nombre: friend.nombre,
            avatar: null,
            perfilPermanente: {
              posicionPreferida: 'Mediocampista',
              posicionesSecundarias: [],
              atributos: {
                velocidad: 5,
                tecnica: 5,
                resistencia: 5,
                defensa: 5,
                ataque: 5,
                pase: 5
              },
              nivelGeneral: 5
            }
          }
          Storage.savePlayer(friendPlayer)
          players[friendPlayer.id] = friendPlayer
        }
        
        const friendRegistration = {
          jugadorId: friendPlayer.id,
          partidoId: matchId,
          estadoFisico: 'normal',
          tipoInscripcion: tipoInscripcion,
          timestamp: new Date(Date.now() + index + 1).toISOString(),
          confirmado: true,
          asistira: true
        }
        Storage.saveRegistration(friendRegistration)
      })
      
      // Reset and close
      setNombre('')
      setEstadoFisico('normal')
      setTipoInscripcion('jugador')
      setFriendName('')
      setFriends([])
      setIsSubmitting(false)
      
      if (onJoined) {
        onJoined()
      }
      
      onClose()
    } catch (err) {
      setError('Error al inscribir. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }
  
  const handleClose = () => {
    setNombre('')
    setEstadoFisico('normal')
    setTipoInscripcion('jugador')
    setFriendName('')
    setFriends([])
    setError('')
    onClose()
  }
  
  const handleFriendKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddFriend()
    }
  }
  
  const totalToRegister = 1 + friends.length
  const cupoLleno = spotsInfo.jugadores >= spotsInfo.cupoTotal
  const suplentesLleno = spotsInfo.suplentes >= spotsInfo.maxSuplentes
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Anotarse al Partido"
      footer={
        <>
          <button 
            className="btn btn-secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Inscribiendo...' 
              : friends.length > 0 
                ? `Confirmar (${totalToRegister})` 
                : 'Confirmar'
            }
          </button>
        </>
      }
    >
      <div className="join-form">
        {error && (
          <div className="form-error">{error}</div>
        )}
        
        {/* Registration type selector - only show if not playerOnly */}
        {!playerOnly && (
          <div className="form-group">
            <label>Tipo de inscripción</label>
            <div className="registration-type-selector">
              {Object.entries(REGISTRATION_TYPES).map(([key, type]) => {
                const Icon = type.icon
                const available = isTypeAvailable(key)
                const isSelected = tipoInscripcion === key
                
                return (
                  <div
                    key={key}
                    className={`type-option ${isSelected ? 'selected' : ''} ${!available ? 'disabled' : ''}`}
                    onClick={() => available && setTipoInscripcion(key)}
                  >
                    <Icon size={20} />
                    <div className="type-option-text">
                      <span className="type-label">{type.label}</span>
                      <span className="type-description">{type.description}</span>
                    </div>
                    {!available && <span className="type-full">Lleno</span>}
                  </div>
                )
              })}
            </div>
            
            {/* Spots info */}
            <div className="spots-info">
              <span>Jugadores: {spotsInfo.jugadores}/{spotsInfo.cupoTotal}</span>
              <span>Suplentes: {spotsInfo.suplentes}/{spotsInfo.maxSuplentes}</span>
            </div>
          </div>
        )}
        
        {/* Main player section */}
        <div className="form-group">
          <label htmlFor="nombre">
            Tu nombre <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Juan Pérez"
            maxLength={50}
            autoFocus
          />
        </div>
        
        {/* Physical state - only for jugador and suplente */}
        {tipoInscripcion !== 'hinchada' && (
          <div className="form-group">
            <label>Tu estado físico</label>
            <div className="physical-state-selector">
              {Object.entries(PHYSICAL_STATES).map(([key, state]) => (
                <div
                  key={key}
                  className={`state-option ${estadoFisico === key ? 'selected' : ''}`}
                  onClick={() => setEstadoFisico(key)}
                >
                  <span className="state-emoji">{state.emoji}</span>
                  <span className="state-label">{state.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Friends section - only for jugador and suplente */}
        {tipoInscripcion !== 'hinchada' && (
          <div className="friends-section">
            <div className="friends-section-header">
              Agregar amigos (opcional)
            </div>
            
            <div className="friend-input-row">
              <input
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                onKeyDown={handleFriendKeyDown}
                placeholder="Nombre del amigo"
                maxLength={50}
                className="friend-input"
              />
              <button 
                type="button"
                className="btn btn-secondary btn-add-friend"
                onClick={handleAddFriend}
              >
                <UserPlus size={16} />
                <span className="btn-add-friend-text">Agregar</span>
              </button>
            </div>
            
            {/* Friends list */}
            {friends.length > 0 && (
              <div className="friends-list">
                <div className="friends-list-header">
                  Amigos a inscribir ({friends.length}):
                </div>
                <div className="friends-list-items">
                  {friends.map((friend, index) => (
                    <div key={friend.id} className="friend-item">
                      <span className="friend-number">{index + 1}.</span>
                      <span className="friend-name">{friend.nombre}</span>
                      <button
                        type="button"
                        className="friend-remove"
                        onClick={() => handleRemoveFriend(friend.id)}
                        title="Quitar de la lista"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default JoinMatchModal
