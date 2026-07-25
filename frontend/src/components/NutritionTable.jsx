import {
  NUTRIENT_FIELDS,
  getNutritionBasisLabel
} from '../utils/productLabels.js';

function NutritionTable({ nutritionFacts }) {
  // Only nutrients present on the product label are listed. Missing values
  // are omitted rather than displayed as zero or estimated.
  const availableNutrients = NUTRIENT_FIELDS.filter(
    (field) =>
      nutritionFacts[field.key] !== null &&
      nutritionFacts[field.key] !== undefined
  );

  if (availableNutrients.length === 0) {
    return (
      <p className="empty-state">
        Nutritional values for this product have not been recorded yet.
      </p>
    );
  }

  const basisLabel = getNutritionBasisLabel(nutritionFacts.basis);

  return (
    <table className="nutrition-table">
      <caption className="nutrition-table__caption">
        Values shown {basisLabel ? basisLabel.toLowerCase() : 'as recorded'}.
      </caption>
      <thead>
        <tr>
          <th scope="col">Nutrient</th>
          <th scope="col">Amount</th>
        </tr>
      </thead>
      <tbody>
        {availableNutrients.map((field) => (
          <tr key={field.key}>
            <th scope="row">{field.label}</th>
            <td>
              {nutritionFacts[field.key]} {field.unit}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default NutritionTable;
