import { Storage } from './storage'

// Sample players with varied profiles (10 players for 5v5)
const samplePlayers = [
  {
    id: 'player_1',
    nombre: 'Juan Pérez',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Mediocampista',
      posicionesSecundarias: ['Delantero'],
      atributos: {
        velocidad: 8,
        tecnica: 7,
        resistencia: 6,
        defensa: 5,
        ataque: 7,
        pase: 8
      },
      nivelGeneral: 6.8
    }
  },
  {
    id: 'player_2',
    nombre: 'María García',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Delantero',
      posicionesSecundarias: ['Mediocampista'],
      atributos: {
        velocidad: 9,
        tecnica: 8,
        resistencia: 7,
        defensa: 4,
        ataque: 9,
        pase: 6
      },
      nivelGeneral: 7.2
    }
  },
  {
    id: 'player_3',
    nombre: 'Carlos Rodríguez',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Defensor',
      posicionesSecundarias: ['Mediocampista'],
      atributos: {
        velocidad: 6,
        tecnica: 5,
        resistencia: 8,
        defensa: 9,
        ataque: 4,
        pase: 6
      },
      nivelGeneral: 6.3
    }
  },
  {
    id: 'player_4',
    nombre: 'Ana Martínez',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Arquero',
      posicionesSecundarias: [],
      atributos: {
        velocidad: 5,
        tecnica: 6,
        resistencia: 7,
        defensa: 8,
        ataque: 3,
        pase: 7
      },
      nivelGeneral: 6.0
    }
  },
  {
    id: 'player_5',
    nombre: 'Luis Sánchez',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Mediocampista',
      posicionesSecundarias: ['Defensor'],
      atributos: {
        velocidad: 7,
        tecnica: 8,
        resistencia: 8,
        defensa: 6,
        ataque: 6,
        pase: 9
      },
      nivelGeneral: 7.3
    }
  },
  {
    id: 'player_6',
    nombre: 'Laura Torres',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Delantero',
      posicionesSecundarias: [],
      atributos: {
        velocidad: 9,
        tecnica: 7,
        resistencia: 6,
        defensa: 3,
        ataque: 8,
        pase: 5
      },
      nivelGeneral: 6.3
    }
  },
  {
    id: 'player_7',
    nombre: 'Diego Ramírez',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Arquero',
      posicionesSecundarias: ['Defensor'],
      atributos: {
        velocidad: 4,
        tecnica: 5,
        resistencia: 7,
        defensa: 9,
        ataque: 2,
        pase: 6
      },
      nivelGeneral: 5.5
    }
  },
  {
    id: 'player_8',
    nombre: 'Sofia Morales',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Mediocampista',
      posicionesSecundarias: ['Delantero'],
      atributos: {
        velocidad: 7,
        tecnica: 8,
        resistencia: 7,
        defensa: 5,
        ataque: 7,
        pase: 8
      },
      nivelGeneral: 7.0
    }
  },
  {
    id: 'player_9',
    nombre: 'Pedro López',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Defensor',
      posicionesSecundarias: ['Mediocampista'],
      atributos: {
        velocidad: 5,
        tecnica: 6,
        resistencia: 9,
        defensa: 8,
        ataque: 4,
        pase: 7
      },
      nivelGeneral: 6.5
    }
  },
  {
    id: 'player_10',
    nombre: 'Valentina Castro',
    avatar: null,
    perfilPermanente: {
      posicionPreferida: 'Delantero',
      posicionesSecundarias: ['Mediocampista'],
      atributos: {
        velocidad: 8,
        tecnica: 7,
        resistencia: 6,
        defensa: 4,
        ataque: 8,
        pase: 6
      },
      nivelGeneral: 6.5
    }
  }
]

// Sample match in inscription phase
const sampleMatch = {
  id: 'match_demo',
  nombre: 'Partido del Sábado',
  fecha: getNextSaturday(),
  horario: '15:00',
  ubicacion: 'Cancha Los Pinos, Av. Libertador 1234',
  detallesUbicacion: 'Entrar por la puerta trasera',
  cantidadJugadores: 10,
  jugadoresPorEquipo: 5,
  pasoActual: 'inscripcion',
  linkCompartible: '',
  organizadorId: 'player_1',
  organizadorNombre: 'Juan Pérez',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Sample match ready for team building (full roster)
const sampleMatchTeamBuilder = {
  id: 'match_team_builder',
  nombre: 'Clásico Mensual',
  fecha: getNextSunday(),
  horario: '10:00',
  ubicacion: 'Club Deportivo Central, Calle 50 #123',
  detallesUbicacion: 'Cancha 2, traer pechera',
  cantidadJugadores: 10,
  jugadoresPorEquipo: 5,
  pasoActual: 'armado_equipos',
  linkCompartible: '',
  organizadorId: 'player_1',
  organizadorNombre: 'Juan Pérez',
  createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  updatedAt: new Date().toISOString()
}

// Sample registrations for inscription match (4 players)
const sampleRegistrations = [
  {
    jugadorId: 'player_1',
    partidoId: 'match_demo',
    estadoFisico: 'normal',
    timestamp: new Date().toISOString(),
    confirmado: true,
    asistira: true
  },
  {
    jugadorId: 'player_2',
    partidoId: 'match_demo',
    estadoFisico: 'excelente',
    timestamp: new Date().toISOString(),
    confirmado: true,
    asistira: true
  },
  {
    jugadorId: 'player_3',
    partidoId: 'match_demo',
    estadoFisico: 'cansado',
    timestamp: new Date().toISOString(),
    confirmado: true,
    asistira: true
  },
  {
    jugadorId: 'player_4',
    partidoId: 'match_demo',
    estadoFisico: 'normal',
    timestamp: new Date().toISOString(),
    confirmado: true,
    asistira: true
  }
]

// Full registrations for team builder match (10 players)
const teamBuilderRegistrations = [
  { jugadorId: 'player_1', partidoId: 'match_team_builder', estadoFisico: 'excelente', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_2', partidoId: 'match_team_builder', estadoFisico: 'excelente', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_3', partidoId: 'match_team_builder', estadoFisico: 'normal', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_4', partidoId: 'match_team_builder', estadoFisico: 'normal', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_5', partidoId: 'match_team_builder', estadoFisico: 'excelente', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_6', partidoId: 'match_team_builder', estadoFisico: 'cansado', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_7', partidoId: 'match_team_builder', estadoFisico: 'normal', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_8', partidoId: 'match_team_builder', estadoFisico: 'excelente', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_9', partidoId: 'match_team_builder', estadoFisico: 'normal', timestamp: new Date().toISOString(), confirmado: true, asistira: true },
  { jugadorId: 'player_10', partidoId: 'match_team_builder', estadoFisico: 'cansado', timestamp: new Date().toISOString(), confirmado: true, asistira: true }
]

// Helper to get next Saturday's date
function getNextSaturday() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7
  const nextSaturday = new Date(today)
  nextSaturday.setDate(today.getDate() + daysUntilSaturday)
  return nextSaturday.toISOString().split('T')[0]
}

// Helper to get next Sunday's date
function getNextSunday() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilSunday = (7 - dayOfWeek) % 7 || 7
  const nextSunday = new Date(today)
  nextSunday.setDate(today.getDate() + daysUntilSunday)
  return nextSunday.toISOString().split('T')[0]
}

// Initialize sample data if localStorage is empty
export function initSampleData() {
  const INIT_KEY = 'soccer_organizer_initialized_v2'
  
  // Check if already initialized
  if (localStorage.getItem(INIT_KEY)) {
    return false
  }
  
  try {
    // Check if there's any existing data
    const existingMatches = Storage.getMatches()
    const existingPlayers = Storage.getPlayers()
    
    // Only initialize if both are empty
    if (Object.keys(existingMatches).length === 0 && Object.keys(existingPlayers).length === 0) {
      // Save sample players
      samplePlayers.forEach(player => {
        Storage.savePlayer(player)
      })
      
      // Save sample matches
      Storage.saveMatch(sampleMatch)
      Storage.saveMatch(sampleMatchTeamBuilder)
      
      // Save sample registrations for inscription match
      sampleRegistrations.forEach(reg => {
        Storage.saveRegistration(reg)
      })
      
      // Save registrations for team builder match
      teamBuilderRegistrations.forEach(reg => {
        Storage.saveRegistration(reg)
      })
      
      // Mark as initialized
      localStorage.setItem(INIT_KEY, 'true')
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error initializing sample data:', error)
    return false
  }
}

// Export for testing purposes
export { samplePlayers, sampleMatch, sampleMatchTeamBuilder, sampleRegistrations, teamBuilderRegistrations }
