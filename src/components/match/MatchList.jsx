import { useState, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { Storage } from '../../utils/storage'
import MatchCard from './MatchCard'

export default function MatchList({ onNavigate }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  const loadMatches = useCallback(() => {
    setLoading(true)
    try {
      const allMatches = Storage.getMatches()
      // Sort by date (newest first)
      const sortedMatches = Object.values(allMatches).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      setMatches(sortedMatches)
    } catch (error) {
      console.error('Error loading matches:', error)
      setMatches([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  const handleCreateNew = () => {
    onNavigate('#/crear')
  }

  const handleSelectMatch = (match) => {
    onNavigate(`#/partido/${match.id}`)
  }

  if (loading) {
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
              key={match.id}
              match={match}
              onClick={() => handleSelectMatch(match)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
