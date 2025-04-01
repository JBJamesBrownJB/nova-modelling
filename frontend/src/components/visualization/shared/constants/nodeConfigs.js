import { COLORS } from '../../../../styles/colors';

export const userNodeConfig = {
  filter: node => node.label === 'User',
  defaultFill: COLORS.NODE_USER_DEFAULT,
  getFill: d => d.npsScore ? d.npsColor : COLORS.NODE_USER_DEFAULT,
  icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
};

export const goalNodeConfig = {
  filter: node => node.label === 'Goal',
  defaultFill: COLORS.NPS_UNMEASURED,
  getFill: d => d.npsColor || COLORS.NPS_UNMEASURED,
};

export const serviceNodeConfig = {
  filter: node => node.label === 'Service',
  icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  extraIcon: 'M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01',
  extraIconTransform: 'translate(5, 5) scale(0.6)',
  extraIconColor: COLORS.STATUS_IN_DEVELOPMENT_ICON,
  extraIconCondition: d => d.status === 'in_development',
  getFill: d => {
    // Color based on status
    switch (d.status) {
      case 'in_development':
        return COLORS.STATUS_IN_DEVELOPMENT;
      case 'vapour':
      case 'planned':
        return COLORS.STATUS_VAPOUR;
      case 'active':
        return COLORS.STATUS_ACTIVE;
      default:
        return COLORS.STATUS_VAPOUR;
    }
  },
};
