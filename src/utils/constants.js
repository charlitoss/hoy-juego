export const PHYSICAL_STATES = {
  cansado: { emoji: '😫', label: 'Cansado', factor: 0.6, color: '#ef4444' },
  normal: { emoji: '😐', label: 'Normal', factor: 1.0, color: '#f59e0b' },
  excelente: { emoji: '💪', label: 'Excelente', factor: 1.3, color: '#10b981' }
};

export const PLAYER_COUNTS = [
  { total: 10, perTeam: 5, format: '5v5' },
  { total: 12, perTeam: 6, format: '6v6' },
  { total: 14, perTeam: 7, format: '7v7' },
  { total: 16, perTeam: 8, format: '8v8' },
  { total: 18, perTeam: 9, format: '9v9' },
  { total: 22, perTeam: 11, format: '11v11' }
];

export const ROLES = {
  ARQUERO: 'arquero',
  DEFENSOR: 'defensor',
  MEDIO: 'medio',
  DELANTERO: 'delantero'
};

export const POSITIONS = {
  ARQUERO: 'Arquero',
  DEFENSOR: 'Defensor',
  MEDIOCAMPISTA: 'Mediocampista',
  DELANTERO: 'Delantero'
};
