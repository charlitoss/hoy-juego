import { Plus } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import MatchCard from './MatchCard'

export default function MatchList({ onNavigate }) {
  const matches = useQuery(api.matches.list)

  const handleCreateNew = () => {
    onNavigate('#/crear')
  }

  const handleSelectMatch = (match) => {
    onNavigate(`#/partido/${match._id}`)
  }

  if (matches === undefined) {
    return (
      <div className="match-list-container">
        <div className="loading">Cargando partidos...</div>
      </div>
    )
  }

  return (
    <div className="match-list-container">
      <div className="list-header">
        <h1>⚽ Organizador de Partidos</h1>
        <button className="btn-new" onClick={handleCreateNew}>
          <Plus size={20} />
          Nuevo
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⚽</div>
          <h3>No hay partidos creados</h3>
          <p>Crea tu primer partido para comenzar a organizar</p>
          <button className="btn btn-primary btn-lg" onClick={handleCreateNew}>
            Crear primer partido
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map(match => (
            <MatchCard
              key={match._id}
              match={match}
              onClick={() => handleSelectMatch(match)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
