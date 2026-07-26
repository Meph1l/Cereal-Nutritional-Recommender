function PreferenceForm({
  preferences,
  onInputChange,
  onSubmit,
  loading,
}) {
  return (
    <section className="finder-section" id="finder">
      <div className="section-heading">
        <p className="section-label">
          Personalized search
        </p>

        <h2>
          Tell us what you want in your cereal
        </h2>

        <p>
          Enter your preferences below. The recommendation system will
          compare your choices with the nutritional information in the
          cereal dataset.
        </p>
      </div>

      <form className="preference-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="goal">
            Main nutritional goal
          </label>

          <select
            id="goal"
            name="goal"
            value={preferences.goal}
            onChange={onInputChange}
            required
          >
            <option value="" disabled>
              Select a goal
            </option>

            <option value="low-sugar">
              Low sugar
            </option>

            <option value="high-protein">
              High protein
            </option>

            <option value="high-fiber">
              High fibre
            </option>

            <option value="low-calorie">
              Low calorie
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxSugar">
            Maximum sugar
          </label>

          <input
            id="maxSugar"
            name="maxSugar"
            type="number"
            min="0"
            step="1"
            value={preferences.maxSugar}
            onChange={onInputChange}
            placeholder="Example: 8 grams"
          />
        </div>

        <div className="form-group">
          <label htmlFor="minimumProtein">
            Minimum protein
          </label>

          <input
            id="minimumProtein"
            name="minimumProtein"
            type="number"
            min="0"
            step="1"
            value={preferences.minimumProtein}
            onChange={onInputChange}
            placeholder="Example: 4 grams"
          />
        </div>

        <div className="form-group">
          <label htmlFor="minimumFiber">
            Minimum fibre
          </label>

          <input
            id="minimumFiber"
            name="minimumFiber"
            type="number"
            min="0"
            step="1"
            value={preferences.minimumFiber}
            onChange={onInputChange}
            placeholder="Example: 3 grams"
          />
        </div>

        <button
          className="submit-button"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Finding Cereals..."
            : "Get Recommendations"}
        </button>
      </form>
    </section>
  );
}

export default PreferenceForm;