import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { PLAYER_COUNTS } from '../../utils/constants'
import { Storage } from '../../utils/storage'
import { getTodayString } from '../../utils/dateUtils'

export default function CreateMatchForm({ onNavigate }) {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: getTodayString(),
    horario: '15:00',
    ubicacion: '',
    detallesUbicacion: '',
    cantidadJugadores: 14
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    // Validate
    if (!formData.nombre.trim()) {
      setError('Por favor ingresa un nombre para el partido')
      return
    }
    
    if (!formData.ubicacion.trim()) {
      setError('Por favor ingresa una ubicación')
      return
    }
    
    if (!formData.fecha) {
      setError('Por favor selecciona una fecha')
      return
    }
    
    if (!formData.horario) {
      setError('Por favor selecciona un horario')
      return
    }

    setIsSubmitting(true)

    try {
      const matchId = Storage.generateId()
      const existingMatches = Storage.getMatches()
      const codigoCorto = Storage.generateUniqueShortCode(existingMatches)
      
      const match = {
        id: matchId,
        codigoCorto: codigoCorto,
        nombre: formData.nombre.trim(),
        fecha: formData.fecha,
        horario: formData.horario,
        ubicacion: formData.ubicacion.trim(),
        detallesUbicacion: formData.detallesUbicacion.trim(),
        cantidadJugadores: formData.cantidadJugadores,
        jugadoresPorEquipo: formData.cantidadJugadores / 2,
        pasoActual: 'inscripcion',
        linkCompartible: `${window.location.origin}${window.location.pathname}#/p/${codigoCorto}`,
        organizadorId: 'current_user',
        organizadorNombre: 'Organizador',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const saved = Storage.saveMatch(match)
      
      if (saved) {
        // Navigate to the new match
        onNavigate(`#/partido/${matchId}`)
      } else {
        setError('Error al guardar el partido. Por favor intenta de nuevo.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Error al crear el partido. Por favor intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleBack = () => {
    onNavigate('#/')
  }

  return (
    <div className="create-form-container">
      <div className="form-header">
        <button 
          type="button"
          className="back-btn" 
          onClick={handleBack}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Crear Nuevo Partido</h1>
      </div>

      <form onSubmit={handleSubmit} className="match-form">
        {error && (
          <div className="form-error">{error}</div>
        )}
        
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre del partido <span className="required">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Partido del Sábado"
            maxLength={50}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha">
              Fecha <span className="required">*</span>
            </label>
            <input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              min={getTodayString()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="horario">
              Horario <span className="required">*</span>
            </label>
            <input
              id="horario"
              type="time"
              value={formData.horario}
              onChange={(e) => handleChange('horario', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">
            Ubicación <span className="required">*</span>
          </label>
          <input
            id="ubicacion"
            type="text"
            value={formData.ubicacion}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
            placeholder="Ej: Cancha Los Pinos, Av. Libertador 1234"
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="detalles">Detalles adicionales (opcional)</label>
          <input
            id="detalles"
            type="text"
            value={formData.detallesUbicacion}
            onChange={(e) => handleChange('detallesUbicacion', e.target.value)}
            placeholder="Ej: Entrar por puerta trasera"
            maxLength={200}
          />
          <span className="hint">Información adicional sobre cómo llegar o qué traer</span>
        </div>

        <div className="form-group">
          <label>
            Cantidad de jugadores <span className="required">*</span>
          </label>
          <div className="player-count-grid">
            {PLAYER_COUNTS.map(option => (
              <button
                key={option.total}
                type="button"
                className={`count-option ${formData.cantidadJugadores === option.total ? 'selected' : ''}`}
                onClick={() => handleChange('cantidadJugadores', option.total)}
              >
                <span className="count-number">{option.total}</span>
                <span className="count-format">{option.format}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary btn-create"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando...' : 'Crear Partido'}
        </button>
      </form>
    </div>
  )
}
