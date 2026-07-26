import { getSeverity } from '../utils/severity.js';

function NutritionalConcerns({ concerns }) {
  // The parent decides whether to render this component. When it is shown
  // with no concerns, the product has been reviewed and none apply.
  if (!concerns || concerns.length === 0) {
    return (
      <p className="empty-state">
        No specific nutritional concerns have been recorded for this product.
      </p>
    );
  }

  return (
    <ul className="concern-list">
      {concerns.map((concern) => {
        const severity = getSeverity(concern.severity);

        return (
          <li key={concern.id} className="concern">
            <div className="concern__header">
              <span className="concern__title">{concern.title}</span>

              {/* Severity is optional, so the label only appears when a
                  value has been supplied. */}
              {severity && (
                <span
                  className={`severity-tag severity-tag--${severity.variant}`}
                >
                  {severity.label}
                </span>
              )}
            </div>

            {concern.description && (
              <p className="concern__description">{concern.description}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default NutritionalConcerns;
