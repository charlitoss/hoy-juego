import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PLAYER_COUNTS } from '../../utils/constants';
import { Storage, generateId } from '../../utils/storage';
import { getTodayString } from '../../utils/dateUtils';

export default function CreateMatchForm({ onBack, onCreate }) {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: getTodayString(),
    horario: '15:00',
    ubicacion: '',
    detallesUbicacion: '',
    cantidadJugadores: 14
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('=== CREATE MATCH FORM SUBMIT ===');
    console.log('Form data:', formData);
    
    // Validate
    if (!formData.nombre.trim()) {
      alert('Por favor ingresa un nombre para el partido');
      return;
    }
    
    if (!formData.ubicacion.trim()) {
      alert('Por favor ingresa una ubicación');
      return;
    }

    const match = {
      id: generateId(),
      nombre: formData.nombre.trim(),
      fecha: formData.fecha,
      horario: formData.horario,
      ubicacion: formData.ubicacion.trim(),
      detallesUbicacion: formData.detallesUbicacion.trim(),
      cantidadJugadores: formData.cantidadJugadores,
      jugadoresPorEquipo: formData.cantidadJugadores / 2,
      pasoActual: 'inscripcion',
      linkCompartible: '',
      organizadorId: 'current_user',
      organizadorNombre: 'Usuario',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Match object:', match);
    
    const saved = Storage.saveMatch(match);
    console.log('Saved to storage:', saved);
    
    if (saved) {
      console.log('Calling onCreate...');
      onCreate(match);
    } else {
      alert('Error al guardar el partido');
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="create-form-container">
      <div className="form-header">
        <button 
          type="button"
          className="back-btn" 
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Crear Nuevo Partido</h1>
      </div>

      <form onSubmit={handleSubmit} className="match-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del partido *</label>
          <input
            id="nombre"
            type="text"
            value={formData.nombre}
            onChange={(e) => handleChange('nombre', e.target.value)}
            placeholder="Ej: Partido del Sábado"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha">Fecha *</label>
            <input
              id="fecha"
              type="date"
              value={formData.fecha}
              onChange={(e) => handleChange('fecha', e.target.value)}
              min={getTodayString()}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="horario">Horario *</label>
            <input
              id="horario"
              type="time"
              value={formData.horario}
              onChange={(e) => handleChange('horario', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ubicacion">Ubicación *</label>
          <input
            id="ubicacion"
            type="text"
            value={formData.ubicacion}
            onChange={(e) => handleChange('ubicacion', e.target.value)}
            placeholder="Ej: Cancha Los Pinos, Av. Libertador 1234"
            required
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
          />
        </div>

        <div className="form-group">
          <label>Cantidad de jugadores *</label>
          <div className="player-count-grid">
            {PLAYER_COUNTS.map(option => (
              <button
                key={option.total}
                type="button"
                className={`count-option ${formData.cantidadJugadores === option.total ? 'active' : ''}`}
                onClick={() => handleChange('cantidadJugadores', option.total)}
              >
                <span className="count-number">{option.total}</span>
                <span className="count-format">{option.format}</span>
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-create">
          Crear Partido
        </button>
      </form>
    </div>
  );
}
