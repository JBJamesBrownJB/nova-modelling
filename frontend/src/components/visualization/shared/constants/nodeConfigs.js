import { COLORS } from '../../../../styles/colors';

export const userNodeConfig = {
  filter: node => node.label === 'User',
  defaultFill: COLORS.NODE_USER_DEFAULT,
  getFill: d => d.npsScore ? d.npsColor : COLORS.NODE_USER_DEFAULT,
  icon: ICONS.SERVICE,
};

export const goalNodeConfig = {
  filter: node => node.label === 'Goal',
  defaultFill: COLORS.NPS_UNMEASURED,
  getFill: d => d.npsColor || COLORS.NPS_UNMEASURED,
};

export const serviceNodeConfig = {
  filter: node => node.label === 'Service',
  icon: ICONS.SERVICE,
  extraIcon: ICONS.PLANNING,
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
