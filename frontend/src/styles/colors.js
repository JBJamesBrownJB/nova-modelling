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
  NPS_UNMEASURED: '#E0E0E0',    
  NPS_EXCELLENT: '#81C784',      
  NPS_GOOD:'#C8E6C9',         
  NPS_LOW: '#FFE0B2',
  NPS_BAD: '#EF9A9A',        
  
  // Node status colors
  STATUS_ACTIVE: '#A5D6A7',      // Green 200
  STATUS_IN_DEVELOPMENT: '#757575', 
  STATUS_IN_DEVELOPMENT_ICON: '#E67E22', 
  STATUS_VAPOUR: '#9E9E9E',     
  
  // Node type colors
  NODE_USER_DEFAULT: '#D4C4BC',
  NODE_GOAL_DEFAULT: '#BBDEFB',         // Blue 100
};

export const LINK_CONSTANTS = {
  DOES:'#4361EE',  
  DEPENDS_ON: '#BDBDBD' 
};

// Helper function to get NPS color based on score
export const getNpsColor = (score, nodeType) => {
  if (score === null || score === undefined){
    if (nodeType && nodeType === 'User') {
      return COLORS.NODE_USER_DEFAULT;
    }
    return COLORS.NPS_UNMEASURED;
  } 
  if (score >= 70) return COLORS.NPS_EXCELLENT;
  if (score >= 30) return COLORS.NPS_GOOD;
  if (score >= 0) return COLORS.NPS_NEUTRAL;
  return COLORS.NPS_LOW;
};
