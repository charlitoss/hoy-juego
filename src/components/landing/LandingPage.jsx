import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { PLAYER_COUNTS } from '../../utils/constants'
import { getTodayString } from '../../utils/dateUtils'

export default function LandingPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: getTodayString(),
    horario: '15:00',
    ubicacion: '',
    cantidadJugadores: 12
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const createMatch = useMutation(api.matches.create)

  const handleSubmit = async (e) => {
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
      const matchId = await createMatch({
        nombre: formData.nombre.trim(),
        fecha: formData.fecha,
        horario: formData.horario,
        ubicacion: formData.ubicacion.trim(),
        cantidadJugadores: formData.cantidadJugadores,
        jugadoresPorEquipo: formData.cantidadJugadores / 2,
        organizadorId: 'current_user',
        organizadorNombre: 'Organizador',
      })
      
      // Navigate to the new match
      onNavigate(`#/partido/${matchId}`)
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

  return (
    <div className="landing-page">
      <div className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">Organizador de Partidos</h1>
          <p className="hero-subtitle">
            Crea tu partido, invita a tus amigos y arma los equipos de forma simple y rápida
          </p>
        </div>

        <div className="hero-form-container">
          <form onSubmit={handleSubmit} className="match-form hero-form">
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
      </div>
    </div>
  )
}
