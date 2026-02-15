import { useState, useEffect, useRef, useMemo } from 'react'
import { X, UserPlus, Users, Clock, Eye } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import Modal from '../ui/Modal'
import { PHYSICAL_STATES } from '../../utils/constants'

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
  const friendInputRef = useRef(null)
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Convex queries
  const registrations = useQuery(api.registrations.listByMatch, isOpen && matchId ? { matchId } : "skip")
  const playersData = useQuery(api.players.list)
  
  // Convex mutations
  const createPlayer = useMutation(api.players.create)
  const createRegistration = useMutation(api.registrations.create)
  
  // Convert players array to object for easy lookup
  const allPlayers = useMemo(() => {
    if (!playersData) return {}
    return playersData.reduce((acc, player) => {
      acc[player._id] = player
      return acc
    }, {})
  }, [playersData])
  
  // Calculate available spots - always count from registrations
  const spotsInfo = useMemo(() => {
    if (!registrations || !match) {
      return { jugadores: 0, suplentes: 0, cupoTotal: 10, maxSuplentes: 5 }
    }
    
    const cupoTotal = match.cantidadJugadores // Total de jugadores (ya es jugadoresPorEquipo * 2)
    const maxSuplentes = Math.floor(cupoTotal / 2)
    
    // Siempre contar desde registrations - jugadores son los que NO son suplente ni hinchada
    const jugadores = registrations.filter(r => 
      r.asistira && 
      r.tipoInscripcion !== 'suplente' && 
      r.tipoInscripcion !== 'hinchada'
    ).length
    
    const suplentes = registrations.filter(r => 
      r.asistira && 
      r.tipoInscripcion === 'suplente'
    ).length
    
    return { jugadores, suplentes, cupoTotal, maxSuplentes }
  }, [registrations, match])
  
  useEffect(() => {
    if (isOpen && matchId) {
      // If playerOnly mode, always set to jugador
      if (playerOnly) {
        setTipoInscripcion('jugador')
      } else {
        // Auto-select type based on availability
        if (spotsInfo.jugadores >= spotsInfo.cupoTotal) {
          if (spotsInfo.suplentes >= spotsInfo.maxSuplentes) {
            setTipoInscripcion('hinchada')
          } else {
            setTipoInscripcion('suplente')
          }
        } else {
          setTipoInscripcion('jugador')
        }
      }
    }
  }, [isOpen, matchId, playerOnly, spotsInfo])
  
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
  
  // Add friend(s) to the list - supports multiple names separated by comma
  const handleAddFriend = () => {
    setError('')
    
    // Parse multiple names separated by comma
    const names = friendName.split(',').map(n => n.trim()).filter(n => n.length > 0)
    
    if (names.length === 0) {
      setError('Ingresa el nombre del amigo')
      return
    }
    
    const errors = []
    const newFriends = []
    
    for (const name of names) {
      // Validate name length
      if (name.length < 2) {
        errors.push(`"${name}" debe tener al menos 2 caracteres`)
        continue
      }
      
      // Check if same as main player
      if (nombre.trim().toLowerCase() === name.toLowerCase()) {
        errors.push(`"${name}" es tu propio nombre`)
        continue
      }
      
      // Check if already in the friends list (existing + new)
      const alreadyInList = friends.some(f => f.nombre.toLowerCase() === name.toLowerCase()) ||
        newFriends.some(f => f.nombre.toLowerCase() === name.toLowerCase())
      
      if (alreadyInList) {
        errors.push(`"${name}" ya está en la lista`)
        continue
      }
      
      // Check if already registered in the match
      const existingPlayer = Object.values(allPlayers).find(
        p => p.nombre.toLowerCase() === name.toLowerCase()
      )
      
      if (existingPlayer && registrations) {
        const alreadyRegistered = registrations.some(
          r => r.jugadorId === existingPlayer._id
        )
        if (alreadyRegistered) {
          errors.push(`"${name}" ya está inscrito en el partido`)
          continue
        }
      }
      
      // Valid - add to new friends
      newFriends.push({
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        nombre: name
      })
    }
    
    // Add valid friends
    if (newFriends.length > 0) {
      setFriends([...friends, ...newFriends])
    }
    
    // Show errors if any
    if (errors.length > 0) {
      setError(errors.join('. '))
    }
    
    // Clear input and keep focus
    setFriendName('')
    friendInputRef.current?.focus()
  }
  
  // Remove friend from list
  const handleRemoveFriend = (id) => {
    setFriends(friends.filter(f => f.id !== id))
  }
  
  // Submit main player + friends
  const handleSubmit = async () => {
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
    const existingMainPlayer = Object.values(allPlayers).find(
      p => p.nombre.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (existingMainPlayer && registrations) {
      const alreadyRegistered = registrations.some(
        r => r.jugadorId === existingMainPlayer._id
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
      // Calculate how many spots are available for jugadores
      const availableJugadorSpots = spotsInfo.cupoTotal - spotsInfo.jugadores
      
      // 1. Register main player
      let mainPlayerId = existingMainPlayer?._id
      
      if (!mainPlayerId) {
        mainPlayerId = await createPlayer({
          nombre: trimmedName,
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
        })
      }
      
      // Main player always gets their selected type
      await createRegistration({
        partidoId: matchId,
        jugadorId: mainPlayerId,
        estadoFisico: tipoInscripcion === 'hinchada' ? 'normal' : estadoFisico,
        tipoInscripcion: tipoInscripcion,
        confirmado: true,
        asistira: true
      })
      
      // Track how many jugador spots we've used (1 for main player if they're jugador)
      let jugadorSpotsUsed = tipoInscripcion === 'jugador' ? 1 : 0
      
      // 2. Register friends - overflow goes to suplentes if registering as jugador
      for (let i = 0; i < friends.length; i++) {
        const friend = friends[i]
        let friendPlayerId = Object.values(allPlayers).find(
          p => p.nombre.toLowerCase() === friend.nombre.toLowerCase()
        )?._id
        
        if (!friendPlayerId) {
          friendPlayerId = await createPlayer({
            nombre: friend.nombre,
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
          })
        }
        
        // Determine registration type for this friend
        let friendType = tipoInscripcion
        if (tipoInscripcion === 'jugador') {
          // Check if we still have jugador spots
          if (jugadorSpotsUsed >= availableJugadorSpots) {
            // Overflow to suplente
            friendType = 'suplente'
          } else {
            jugadorSpotsUsed++
          }
        }
        
        await createRegistration({
          partidoId: matchId,
          jugadorId: friendPlayerId,
          estadoFisico: 'normal',
          tipoInscripcion: friendType,
          confirmado: true,
          asistira: true
        })
      }
      
      // Reset and close
      setNombre('')
      setEstadoFisico('normal')
      setTipoInscripcion('jugador')
      setFriendName('')
      setFriends([])
      setIsSubmitting(false)
      
      if (onJoined) {
        // Pass the main player ID so the caller can auto-assign if needed
        onJoined(mainPlayerId)
      }
      
      onClose()
    } catch (err) {
      console.error('Error registering:', err)
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
      onSubmit={handleSubmit}
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
                ref={friendInputRef}
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                onKeyDown={handleFriendKeyDown}
                placeholder="Nombre del amigo"
                maxLength={200}
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
            <span className="hint">Podés agregar varios separados por coma</span>
            
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
