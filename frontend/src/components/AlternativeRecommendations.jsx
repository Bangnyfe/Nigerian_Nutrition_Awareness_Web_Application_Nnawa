function AlternativeRecommendations({ productAlternatives, wholeFoodAlternatives }) {
  const hasProductAlternatives =
    productAlternatives && productAlternatives.length > 0;
  const hasWholeFoodAlternatives =
    wholeFoodAlternatives && wholeFoodAlternatives.length > 0;

  
  if (!hasProductAlternatives && !hasWholeFoodAlternatives) {
    return (
      <p className="empty-state">
        No healthier alternatives have been recorded for this product yet.
      </p>
    );
  }

  return (
    <div className="alternatives">
      <div className="alternatives__group">
        <h3 className="alternatives__heading">Healthier Processed Alternatives</h3>
        {hasProductAlternatives ? (
          <ul className="alternative-list">
            {productAlternatives.map((alternative) => (
              <li key={alternative.id} className="alternative">
                <span className="alternative__name">
                  {alternative.alternative_name}
                </span>
                {alternative.reason && (
                  <p className="alternative__detail">{alternative.reason}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="alternatives__none">
            No healthier processed alternatives are available.
          </p>
        )}
      </div>

      <div className="alternatives__group">
        <h3 className="alternatives__heading">Whole Food Alternatives</h3>
        {hasWholeFoodAlternatives ? (
          <ul className="alternative-list">
            {wholeFoodAlternatives.map((alternative) => (
              <li key={alternative.id} className="alternative">
                <span className="alternative__name">
                  {alternative.food_name}
                </span>
                {alternative.description && (
                  <p className="alternative__detail">{alternative.description}</p>
                )}
                {alternative.benefit && (
                  <p className="alternative__benefit">{alternative.benefit}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="alternatives__none">
            No whole food alternatives are available.
          </p>
        )}
      </div>
    </div>
  );
}

export default AlternativeRecommendations;
