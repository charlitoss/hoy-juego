import React from 'react';
import { Plus } from 'lucide-react';
import { Storage } from '../../utils/storage';
import MatchCard from './MatchCard';

export default function MatchList({ onCreateNew, onSelectMatch }) {
  const matches = Object.values(Storage.getMatches());

  return (
    <div className="match-list-container">
      <div className="list-header">
        <h1>⚽ Organizador de Partidos</h1>
        <button className="btn-new" onClick={onCreateNew}>
          <Plus size={20} />
          Nuevo
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <h2>No hay partidos creados</h2>
          <p>Crea tu primer partido para comenzar a organizar</p>
          <button className="btn-primary" onClick={onCreateNew}>
            Crear primer partido
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              onClick={() => onSelectMatch(match)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
