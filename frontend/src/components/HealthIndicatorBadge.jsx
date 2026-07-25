import { getHealthIndicator } from '../utils/healthIndicator.js';

function HealthIndicatorBadge({ code }) {
  const indicator = getHealthIndicator(code);

  // Products that have not been assigned an approved classification show a
  // neutral state rather than an assumed or default rating.
  if (!indicator) {
    return (
      <span className="health-badge health-badge--unassessed">
        <span className="health-badge__dot" aria-hidden="true" />
        Not yet assessed
      </span>
    );
  }

  // The label is always rendered as text so the classification is never
  // communicated by colour alone.
  return (
    <span className={`health-badge health-badge--${indicator.variant}`}>
      <span className="health-badge__dot" aria-hidden="true" />
      {indicator.label}
    </span>
  );
}

export default HealthIndicatorBadge;
