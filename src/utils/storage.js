/**
 * Legacy LocalStorage utilities
 * 
 * NOTE: This app now uses Convex for data persistence.
 * These utilities are kept for reference but are no longer used.
 * To seed the database, use the Convex seed mutation:
 *   npx convex run seed:seedDatabase
 */

// Generate a unique ID (legacy format)
export const generateId = () => 
  `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Generate a short 6-character alphanumeric code for sharing
export const generateShortCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars: I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Legacy Storage object - no longer used, kept for reference
export const Storage = {
  generateId,
  generateShortCode,
};
