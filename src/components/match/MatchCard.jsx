import React from 'react';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { Storage } from '../../utils/storage';
import { formatDate } from '../../utils/dateUtils';

export default function MatchCard({ match, onClick }) {
  const dateInfo = formatDate(match.fecha);
  const registrations = Storage.getRegistrations(match.id);
  const confirmedCount = registrations.filter(r => r.asistira).length;

  return (
    <div className="match-card" onClick={onClick}>
      <div className="match-card-header">
        <h3>{match.nombre}</h3>
        <ChevronRight size={20} />
      </div>

      <div className="match-card-info">
        <div className="info-item">
          <Calendar size={16} />
          <span>{dateInfo.short} • {match.horario}</span>
        </div>
        <div className="info-item">
          <MapPin size={16} />
          <span>{match.ubicacion.split(',')[0]}</span>
        </div>
      </div>

      <div className="match-card-status">
        <div className="status-badge" data-step={match.pasoActual}>
          {match.pasoActual === 'inscripcion' ? 'Inscripción' : 'Armado de Equipos'}
        </div>
        <div className="player-count">
          <Users size={16} />
          <span>{confirmedCount}/{match.cantidadJugadores}</span>
        </div>
      </div>

      {confirmedCount >= match.cantidadJugadores && match.pasoActual === 'inscripcion' && (
        <div className="ready-badge">✓ Listo para continuar</div>
      )}
    </div>
  );
}
