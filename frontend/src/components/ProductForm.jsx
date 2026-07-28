import { useState } from 'react';
import { HEALTH_INDICATORS } from '../utils/healthIndicator.js';
import { SEVERITY_LEVELS } from '../utils/severity.js';
import { NUTRIENT_FIELDS } from '../utils/productLabels.js';

const PROCESSING_OPTIONS = [
  { value: '', label: 'Not recorded' },
  { value: 'NOVA_1', label: 'Group 1 — Unprocessed or minimally processed' },
  { value: 'NOVA_2', label: 'Group 2 — Processed culinary ingredient' },
  { value: 'NOVA_3', label: 'Group 3 — Processed food' },
  { value: 'NOVA_4', label: 'Group 4 — Ultra-processed food' }
];

const BASIS_OPTIONS = [
  { value: '', label: 'No nutrition facts recorded' },
  { value: 'PER_100G', label: 'Per 100 g' },
  { value: 'PER_100ML', label: 'Per 100 ml' },
  { value: 'PER_SERVING', label: 'Per serving' }
];

// A module-level counter provides stable keys for dynamically added rows so
// React can track them correctly as rows are added and removed.
let rowIdCounter = 0;
function nextRowId() {
  rowIdCounter += 1;
  return rowIdCounter;
}

function buildNutritionState(nutritionFacts) {
  const values = {};
  for (const field of NUTRIENT_FIELDS) {
    const value = nutritionFacts ? nutritionFacts[field.key] : null;
    values[field.key] = value === null || value === undefined ? '' : String(value);
  }
  return values;
}

function ProductForm({
  initialProduct = null,
  categories = [],
  submitLabel,
  onSubmit,
  onCancel
}) {
  const [fields, setFields] = useState({
    product_name: initialProduct?.product_name ?? '',
    brand: initialProduct?.brand ?? '',
    category_name: initialProduct?.category_name ?? '',
    description: initialProduct?.description ?? '',
    processing_level: initialProduct?.processing_level ?? '',
    health_indicator: initialProduct?.health_indicator ?? '',
    serving_size_value:
      initialProduct?.serving_size_value === null ||
      initialProduct?.serving_size_value === undefined
        ? ''
        : String(initialProduct.serving_size_value),
    serving_size_unit: initialProduct?.serving_size_unit ?? ''
  });

  const [basis, setBasis] = useState(
    initialProduct?.nutrition_facts?.basis ?? ''
  );
  const [nutrition, setNutrition] = useState(
    buildNutritionState(initialProduct?.nutrition_facts)
  );

  const [concerns, setConcerns] = useState(
    (initialProduct?.nutritional_concerns ?? []).map((concern) => ({
      _key: nextRowId(),
      title: concern.title ?? '',
      description: concern.description ?? '',
      severity: concern.severity ?? ''
    }))
  );

  const [productAlternatives, setProductAlternatives] = useState(
    (initialProduct?.product_alternatives ?? []).map((alternative) => ({
      _key: nextRowId(),
      alternative_name: alternative.alternative_name ?? '',
      reason: alternative.reason ?? ''
    }))
  );

  const [wholeFoodAlternatives, setWholeFoodAlternatives] = useState(
    (initialProduct?.whole_food_alternatives ?? []).map((alternative) => ({
      _key: nextRowId(),
      food_name: alternative.food_name ?? '',
      description: alternative.description ?? '',
      benefit: alternative.benefit ?? ''
    }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState([]);

  function updateField(name, value) {
    setFields((current) => ({ ...current, [name]: value }));
  }

  function updateNutrition(key, value) {
    setNutrition((current) => ({ ...current, [key]: value }));
  }

  function updateRow(setRows, key, field, value) {
    setRows((rows) =>
      rows.map((row) => (row._key === key ? { ...row, [field]: value } : row))
    );
  }

  function removeRow(setRows, key) {
    setRows((rows) => rows.filter((row) => row._key !== key));
  }

  function buildPayload() {
    const nutritionFacts = { basis };
    for (const field of NUTRIENT_FIELDS) {
      nutritionFacts[field.key] = nutrition[field.key];
    }

    // A row is sent when the user has entered anything in it. Fully blank
    // rows are dropped as unused; partially filled rows are sent so the
    // backend can validate them and report any missing required field,
    // rather than silently discarding the admin's input.
    const concernHasContent = (row) =>
      row.title.trim() !== '' ||
      row.description.trim() !== '' ||
      row.severity !== '';

    const productAlternativeHasContent = (row) =>
      row.alternative_name.trim() !== '' || row.reason.trim() !== '';

    const wholeFoodHasContent = (row) =>
      row.food_name.trim() !== '' ||
      row.description.trim() !== '' ||
      row.benefit.trim() !== '';

    return {
      product_name: fields.product_name,
      brand: fields.brand,
      category_name: fields.category_name,
      description: fields.description,
      processing_level: fields.processing_level,
      health_indicator: fields.health_indicator,
      serving_size_value: fields.serving_size_value,
      serving_size_unit: fields.serving_size_unit,
      nutrition_facts: nutritionFacts,
      nutritional_concerns: concerns
        .filter(concernHasContent)
        .map(({ title, description, severity }) => ({
          title,
          description,
          severity
        })),
      product_alternatives: productAlternatives
        .filter(productAlternativeHasContent)
        .map(({ alternative_name, reason }) => ({ alternative_name, reason })),
      whole_food_alternatives: wholeFoodAlternatives
        .filter(wholeFoodHasContent)
        .map(({ food_name, description, benefit }) => ({
          food_name,
          description,
          benefit
        }))
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // A quick check on the two required fields gives immediate feedback; the
    // backend remains the source of truth for full validation.
    const localErrors = [];
    if (fields.product_name.trim() === '') {
      localErrors.push('Product name is required.');
    }
    if (fields.category_name.trim() === '') {
      localErrors.push('Category is required.');
    }
    if (localErrors.length > 0) {
      setErrors(localErrors);
      return;
    }

    setIsSaving(true);
    setErrors([]);

    try {
      await onSubmit(buildPayload());
    } catch (requestError) {
      setErrors(
        requestError.errors && requestError.errors.length > 0
          ? requestError.errors
          : [requestError.message]
      );
      setIsSaving(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div className="status-message status-message--error" role="alert">
          <p className="form-errors__title">Please correct the following:</p>
          <ul className="form-errors__list">
            {errors.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="form-section">
        <legend>Product Information</legend>

        <label className="form-field">
          <span className="form-field__label">Product name *</span>
          <input
            type="text"
            value={fields.product_name}
            maxLength={200}
            onChange={(event) => updateField('product_name', event.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="form-field__label">Brand</span>
          <input
            type="text"
            value={fields.brand}
            maxLength={200}
            onChange={(event) => updateField('brand', event.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="form-field__label">Category *</span>
          <input
            type="text"
            list="category-options"
            value={fields.category_name}
            maxLength={100}
            onChange={(event) => updateField('category_name', event.target.value)}
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
          <span className="form-field__hint">
            Choose an existing category or type a new one.
          </span>
        </label>

        <label className="form-field">
          <span className="form-field__label">Description</span>
          <textarea
            rows={3}
            value={fields.description}
            maxLength={2000}
            onChange={(event) => updateField('description', event.target.value)}
          />
        </label>

        <label className="form-field">
          <span className="form-field__label">Processing level</span>
          <select
            value={fields.processing_level}
            onChange={(event) =>
              updateField('processing_level', event.target.value)
            }
          >
            {PROCESSING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="form-row">
          <label className="form-field">
            <span className="form-field__label">Serving size value</span>
            <input
              type="number"
              min="0"
              step="any"
              value={fields.serving_size_value}
              onChange={(event) =>
                updateField('serving_size_value', event.target.value)
              }
            />
          </label>

          <label className="form-field">
            <span className="form-field__label">Serving size unit</span>
            <input
              type="text"
              placeholder="g or ml"
              value={fields.serving_size_unit}
              onChange={(event) =>
                updateField('serving_size_unit', event.target.value)
              }
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Health Indicator</legend>
        <label className="form-field">
          <span className="form-field__label">Assigned indicator</span>
          <select
            value={fields.health_indicator}
            onChange={(event) =>
              updateField('health_indicator', event.target.value)
            }
          >
            <option value="">Not yet assessed</option>
            {Object.entries(HEALTH_INDICATORS).map(([code, indicator]) => (
              <option key={code} value={code}>
                {indicator.label}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Nutrition Facts</legend>

        <label className="form-field">
          <span className="form-field__label">Values are measured</span>
          <select value={basis} onChange={(event) => setBasis(event.target.value)}>
            {BASIS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="form-field__hint">
            A basis is required if any nutrition value is entered.
          </span>
        </label>

        <div className="nutrition-grid">
          {NUTRIENT_FIELDS.map((field) => (
            <label className="form-field" key={field.key}>
              <span className="form-field__label">
                {field.label} ({field.unit})
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={nutrition[field.key]}
                onChange={(event) =>
                  updateNutrition(field.key, event.target.value)
                }
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Nutritional Concerns</legend>
        {concerns.map((concern) => (
          <div className="repeatable-row" key={concern._key}>
            <label className="form-field">
              <span className="form-field__label">Title</span>
              <input
                type="text"
                value={concern.title}
                maxLength={200}
                onChange={(event) =>
                  updateRow(setConcerns, concern._key, 'title', event.target.value)
                }
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Description</span>
              <textarea
                rows={2}
                value={concern.description}
                onChange={(event) =>
                  updateRow(
                    setConcerns,
                    concern._key,
                    'description',
                    event.target.value
                  )
                }
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Severity</span>
              <select
                value={concern.severity}
                onChange={(event) =>
                  updateRow(
                    setConcerns,
                    concern._key,
                    'severity',
                    event.target.value
                  )
                }
              >
                <option value="">None</option>
                {Object.entries(SEVERITY_LEVELS).map(([code, level]) => (
                  <option key={code} value={code}>
                    {level.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="button button--danger button--small"
              onClick={() => removeRow(setConcerns, concern._key)}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button button--secondary"
          onClick={() =>
            setConcerns((rows) => [
              ...rows,
              { _key: nextRowId(), title: '', description: '', severity: '' }
            ])
          }
        >
          Add concern
        </button>
      </fieldset>

      <fieldset className="form-section">
        <legend>Healthier Processed Alternatives</legend>
        {productAlternatives.map((alternative) => (
          <div className="repeatable-row" key={alternative._key}>
            <label className="form-field">
              <span className="form-field__label">Alternative name</span>
              <input
                type="text"
                value={alternative.alternative_name}
                maxLength={200}
                onChange={(event) =>
                  updateRow(
                    setProductAlternatives,
                    alternative._key,
                    'alternative_name',
                    event.target.value
                  )
                }
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Reason</span>
              <textarea
                rows={2}
                value={alternative.reason}
                onChange={(event) =>
                  updateRow(
                    setProductAlternatives,
                    alternative._key,
                    'reason',
                    event.target.value
                  )
                }
              />
            </label>
            <button
              type="button"
              className="button button--danger button--small"
              onClick={() =>
                removeRow(setProductAlternatives, alternative._key)
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button button--secondary"
          onClick={() =>
            setProductAlternatives((rows) => [
              ...rows,
              { _key: nextRowId(), alternative_name: '', reason: '' }
            ])
          }
        >
          Add processed alternative
        </button>
      </fieldset>

      <fieldset className="form-section">
        <legend>Whole Food Alternatives</legend>
        {wholeFoodAlternatives.map((alternative) => (
          <div className="repeatable-row" key={alternative._key}>
            <label className="form-field">
              <span className="form-field__label">Food name</span>
              <input
                type="text"
                value={alternative.food_name}
                maxLength={200}
                onChange={(event) =>
                  updateRow(
                    setWholeFoodAlternatives,
                    alternative._key,
                    'food_name',
                    event.target.value
                  )
                }
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Description</span>
              <textarea
                rows={2}
                value={alternative.description}
                onChange={(event) =>
                  updateRow(
                    setWholeFoodAlternatives,
                    alternative._key,
                    'description',
                    event.target.value
                  )
                }
              />
            </label>
            <label className="form-field">
              <span className="form-field__label">Benefit</span>
              <input
                type="text"
                value={alternative.benefit}
                onChange={(event) =>
                  updateRow(
                    setWholeFoodAlternatives,
                    alternative._key,
                    'benefit',
                    event.target.value
                  )
                }
              />
            </label>
            <button
              type="button"
              className="button button--danger button--small"
              onClick={() =>
                removeRow(setWholeFoodAlternatives, alternative._key)
              }
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="button button--secondary"
          onClick={() =>
            setWholeFoodAlternatives((rows) => [
              ...rows,
              {
                _key: nextRowId(),
                food_name: '',
                description: '',
                benefit: ''
              }
            ])
          }
        >
          Add whole food alternative
        </button>
      </fieldset>

      <div className="form-actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : submitLabel}
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
export default ProductForm;
