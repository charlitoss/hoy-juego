import { useState, useEffect } from 'react'
import MatchList from './components/match/MatchList'
import CreateMatchForm from './components/match/CreateMatchForm'
import MatchPage from './components/match/MatchPage'
import { Storage } from './utils/storage'

function App() {
  const [route, setRoute] = useState(window.location.hash || '#/')
  
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/')
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  
  const navigate = (path) => {
    window.location.hash = path
  }
  
  // Parse route
  const getRouteComponent = () => {
    if (route === '#/' || route === '' || route === '#') {
      return <MatchList onNavigate={navigate} />
    }
    
    if (route === '#/crear') {
      return <CreateMatchForm onNavigate={navigate} />
    }
    
    // Short code route: #/p/ABC123
    const shortCodeRoute = route.match(/^#\/p\/([A-Za-z0-9]{6})$/)
    if (shortCodeRoute) {
      const shortCode = shortCodeRoute[1].toUpperCase()
      const match = Storage.getMatchByShortCode(shortCode)
      if (match) {
        // Redirect to the full match URL
        window.location.hash = `#/partido/${match.id}`
        return null
      }
      // Show error if match not found
      return (
        <div className="match-page">
          <div className="error-state">
            <h3>Partido no encontrado</h3>
            <p>El código <strong>{shortCode}</strong> no corresponde a ningún partido.</p>
            <button className="btn btn-primary" onClick={() => navigate('#/')}>
              Volver al inicio
            </button>
          </div>
        </div>
      )
    }
    
    // Match detail route: #/partido/match_123
    const matchRoute = route.match(/^#\/partido\/(.+)$/)
    if (matchRoute) {
      const matchId = matchRoute[1]
      return <MatchPage matchId={matchId} onNavigate={navigate} />
    }
    
    // 404 - redirect to home
    return <MatchList onNavigate={navigate} />
  }
  
  return (
    <div className="app">
      {getRouteComponent()}
    </div>
  )
}

export default App
