// Display definitions for the severity of a nutritional concern.
// This module only presents the stored value; it does not assign severity.

export const SEVERITY_LEVELS = {
  LOW: { label: 'Low', variant: 'low' },
  MODERATE: { label: 'Moderate', variant: 'moderate' },
  HIGH: { label: 'High', variant: 'high' }
};

export function getSeverity(code) {
  return SEVERITY_LEVELS[code] || null;
}
