/**
 * LocalStorage management utilities
 */

const generateId = () => 
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generate a short 6-character alphanumeric code for sharing
const generateShortCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars: I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Generate a unique short code (checks for collisions)
const generateUniqueShortCode = (existingMatches) => {
  const existingCodes = new Set(
    Object.values(existingMatches).map(m => m.codigoCorto).filter(Boolean)
  );
  
  let code = generateShortCode();
  let attempts = 0;
  while (existingCodes.has(code) && attempts < 100) {
    code = generateShortCode();
    attempts++;
  }
  return code;
};

export { generateId, generateShortCode, generateUniqueShortCode };

export const Storage = {
  // Generate unique ID
  generateId,
  generateShortCode,
  generateUniqueShortCode,
  
  // Find match by short code
  getMatchByShortCode: (shortCode) => {
    try {
      const matches = Storage.getMatches();
      return Object.values(matches).find(
        m => m.codigoCorto?.toUpperCase() === shortCode?.toUpperCase()
      ) || null;
    } catch (error) {
      console.error('Error finding match by short code:', error);
      return null;
    }
  },
  
  // Matches
  getMatches: () => {
    try {
      return JSON.parse(localStorage.getItem('matches') || '{}');
    } catch (error) {
      console.error('Error loading matches:', error);
      return {};
    }
  },
  
  saveMatch: (match) => {
    try {
      const matches = Storage.getMatches();
      matches[match.id] = match;
      localStorage.setItem('matches', JSON.stringify(matches));
      return true;
    } catch (error) {
      console.error('Error saving match:', error);
      return false;
    }
  },
  
  deleteMatch: (matchId) => {
    try {
      const matches = Storage.getMatches();
      delete matches[matchId];
      localStorage.setItem('matches', JSON.stringify(matches));
      return true;
    } catch (error) {
      console.error('Error deleting match:', error);
      return false;
    }
  },
  
  // Players
  getPlayers: () => {
    try {
      return JSON.parse(localStorage.getItem('players') || '{}');
    } catch (error) {
      console.error('Error loading players:', error);
      return {};
    }
  },
  
  savePlayer: (player) => {
    try {
      const players = Storage.getPlayers();
      players[player.id] = player;
      localStorage.setItem('players', JSON.stringify(players));
      return true;
    } catch (error) {
      console.error('Error saving player:', error);
      return false;
    }
  },
  
  // Registrations
  getRegistrations: (matchId) => {
    try {
      const allRegs = JSON.parse(localStorage.getItem('registrations') || '{}');
      return Object.values(allRegs).filter(r => r.partidoId === matchId);
    } catch (error) {
      console.error('Error loading registrations:', error);
      return [];
    }
  },
  
  saveRegistration: (registration) => {
    try {
      const regs = JSON.parse(localStorage.getItem('registrations') || '{}');
      const key = `${registration.partidoId}_${registration.jugadorId}`;
      regs[key] = registration;
      localStorage.setItem('registrations', JSON.stringify(regs));
      return true;
    } catch (error) {
      console.error('Error saving registration:', error);
      return false;
    }
  },
  
  deleteRegistration: (matchId, playerId) => {
    try {
      const regs = JSON.parse(localStorage.getItem('registrations') || '{}');
      const key = `${matchId}_${playerId}`;
      delete regs[key];
      localStorage.setItem('registrations', JSON.stringify(regs));
      return true;
    } catch (error) {
      console.error('Error deleting registration:', error);
      return false;
    }
  },
  
  // Team Configurations
  getTeamConfig: (matchId) => {
    try {
      const configs = JSON.parse(localStorage.getItem('team_configurations') || '{}');
      return configs[matchId] || null;
    } catch (error) {
      console.error('Error loading team config:', error);
      return null;
    }
  },
  
  saveTeamConfig: (config) => {
    try {
      const configs = JSON.parse(localStorage.getItem('team_configurations') || '{}');
      configs[config.partidoId] = {
        ...config,
        updatedAt: new Date().toISOString(),
        version: (configs[config.partidoId]?.version || 0) + 1
      };
      localStorage.setItem('team_configurations', JSON.stringify(configs));
      return true;
    } catch (error) {
      console.error('Error saving team config:', error);
      return false;
    }
  },
  
  // Get or create default team config
  getOrCreateTeamConfig: (matchId) => {
    let config = Storage.getTeamConfig(matchId);
    if (!config) {
      config = {
        partidoId: matchId,
        nombreEquipoBlanco: 'Equipo Blanco',
        nombreEquipoOscuro: 'Equipo Oscuro',
        asignaciones: [],
        formacionEquipoBlanco: '4-3-3',
        formacionEquipoOscuro: '4-3-3',
        createdBy: 'current_user',
        version: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      Storage.saveTeamConfig(config);
    }
    return config;
  },
  
  // Clear all data (useful for testing)
  clearAll: () => {
    try {
      localStorage.removeItem('matches');
      localStorage.removeItem('players');
      localStorage.removeItem('registrations');
      localStorage.removeItem('team_configurations');
      localStorage.removeItem('soccer_organizer_initialized');
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};
