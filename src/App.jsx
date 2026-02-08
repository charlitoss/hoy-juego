import { useState, useEffect } from 'react'
import MatchList from './components/match/MatchList'
import CreateMatchForm from './components/match/CreateMatchForm'
import MatchPage from './components/match/MatchPage'

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
