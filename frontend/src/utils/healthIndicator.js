//The classification itself is
// prepared and stored externally; this module only presents the stored
// value and never calculates, or modifies it.

export const HEALTH_INDICATORS = {
  HEALTHIER_CHOICE: {
    label: 'Healthier Choice',
    variant: 'healthier'
  },
  CONSUME_IN_MODERATION: {
    label: 'Consume in Moderation',
    variant: 'moderation'
  },
  HIGH_NUTRITIONAL_CONCERN: {
    label: 'High Nutritional Concern',
    variant: 'concern'
  }
};

export function getHealthIndicator(code) {
  return HEALTH_INDICATORS[code] || null;
}
