/**
 * Color Palette
 * 
 * Central color definitions for the Nova Modelling application.
 * Using Material Design colors for consistency.
 */

// Base colors
export const COLORS = {
  // Material Design Greys
  GREY_50: '#FAFAFA',
  GREY_100: '#F5F5F5',
  GREY_200: '#EEEEEE',
  GREY_300: '#E0E0E0',
  GREY_400: '#BDBDBD',
  GREY_500: '#9E9E9E',
  GREY_600: '#757575',
  
  // Material Design Colors - Light variants
  GREEN_100: '#C8E6C9',
  GREEN_200: '#A5D6A7',
  BLUE_50: '#E3F2FD',
  BLUE_100: '#BBDEFB',
  BLUE_400: '#4361EE',
  ORANGE_100: '#FFE0B2',
  DEEP_ORANGE_100: '#FFCCBC',
  RED_100: '#FFCDD2',
  PINK_100: '#F8BBD0',
  
  // Semantic colors
  PRIMARY: '#4361EE',
  BACKGROUND: '#FAFAFA',
  TEXT: '#212121',
  TEXT_SECONDARY: '#757575',
  BORDER: '#E0E0E0',
  
  // NPS Score colors
  NPS_UNMEASURED: '#E0E0E0',    // Grey 300
  NPS_EXCELLENT: '#A5D6A7',      // Green 200
  NPS_GOOD: '#FFE0B2',          // Orange 100
  NPS_NEUTRAL: '#FFCCBC',        // Deep Orange 100
  NPS_LOW: '#FFCDD2',           // Red 100
  
  // Node status colors
  STATUS_ACTIVE: '#A5D6A7',      // Green 200
  STATUS_IN_DEVELOPMENT: '#757575', 
  STATUS_VAPOUR: '#9E9E9E',     
  
  // Node type colors
  NODE_USER: '#E3F2FD',         // Blue 50
  NODE_JTBD: '#BBDEFB',         // Blue 100
  
  // Edge colors
  EDGE_DOES: '#F8BBD0',         // Pink 100
  EDGE_DEPENDS: '#FFCDD2',      // Red 100
};

// Helper function to get NPS color based on score
export const getNpsColor = (score) => {
  if (score === null || score === undefined) return COLORS.NPS_UNMEASURED;
  if (score >= 70) return COLORS.NPS_EXCELLENT;
  if (score >= 30) return COLORS.NPS_GOOD;
  if (score >= 0) return COLORS.NPS_NEUTRAL;
  return COLORS.NPS_LOW;
};
