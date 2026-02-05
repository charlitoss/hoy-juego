/**
 * LocalStorage management utilities
 */

export const generateId = () => 
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const Storage = {
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
  
  // Clear all data (useful for testing)
  clearAll: () => {
    try {
      localStorage.removeItem('matches');
      localStorage.removeItem('players');
      localStorage.removeItem('registrations');
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};
