import { useMemo } from 'react'
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react'
import { Storage } from '../../utils/storage'
import { formatDate } from '../../utils/dateUtils'

export default function MatchCard({ match, onClick }) {
  // Memoize expensive operations
  const dateInfo = useMemo(() => formatDate(match.fecha), [match.fecha])
  
  const { confirmedCount, isReady } = useMemo(() => {
    const registrations = Storage.getRegistrations(match.id)
    const confirmed = registrations.filter(r => r.asistira).length
    return {
      confirmedCount: confirmed,
      isReady: confirmed >= match.cantidadJugadores
    }
  }, [match.id, match.cantidadJugadores])

  // Safely get location display (handle missing comma)
  const locationDisplay = useMemo(() => {
    if (!match.ubicacion) return 'Sin ubicación'
    const parts = match.ubicacion.split(',')
    return parts[0].trim() || match.ubicacion
  }, [match.ubicacion])

  // Get status label
  const getStatusLabel = () => {
    switch (match.pasoActual) {
      case 'inscripcion':
        return 'Inscripción'
      case 'armado_equipos':
        return 'Armado de Equipos'
      case 'finalizado':
        return 'Finalizado'
      default:
        return 'Inscripción'
    }
  }

  // Get status class
  const getStatusClass = () => {
    switch (match.pasoActual) {
      case 'inscripcion':
        return 'inscripcion'
      case 'armado_equipos':
        return 'armado'
      case 'finalizado':
        return 'finalizado'
      default:
        return 'inscripcion'
    }
  }

  return (
    <div className="card card-clickable match-card" onClick={onClick}>
      <div className="match-card-header">
        <h3>{match.nombre || 'Partido sin nombre'}</h3>
        <ChevronRight size={20} />
      </div>

      <div className="match-card-info">
        <div className="info-item">
          <Calendar size={16} />
          <span>{dateInfo.short} • {match.horario}</span>
        </div>
        <div className="info-item">
          <MapPin size={16} />
          <span>{locationDisplay}</span>
        </div>
      </div>

      <div className="match-card-status">
        <span className={`status-badge ${getStatusClass()}`}>
          {getStatusLabel()}
        </span>
        <div className="player-count">
          <Users size={16} />
          <span>{confirmedCount}/{match.cantidadJugadores}</span>
        </div>
      </div>

      {isReady && match.pasoActual === 'inscripcion' && (
        <div className="ready-badge">✓ Listo para continuar</div>
      )}
    </div>
  )
}
