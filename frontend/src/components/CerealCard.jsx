function CerealCard({ cereal }) {
  return (
    <article className="cereal-card">
      <div className="cereal-card-header">
        <p className="cereal-rank">
          Recommended cereal
        </p>

        <h3>
          {cereal.name || "Cereal name"}
        </h3>

        {cereal.manufacturer && (
          <p className="cereal-manufacturer">
            {cereal.manufacturer}
          </p>
        )}
      </div>

      <div className="nutrition-grid">
        <div className="nutrition-item">
          <span className="nutrition-label">
            Calories
          </span>

          <strong>
            {cereal.calories ?? "N/A"}
          </strong>
        </div>

        <div className="nutrition-item">
          <span className="nutrition-label">
            Sugar
          </span>

          <strong>
            {cereal.sugars ?? "N/A"}
            {cereal.sugars !== undefined ? " g" : ""}
          </strong>
        </div>

        <div className="nutrition-item">
          <span className="nutrition-label">
            Protein
          </span>

          <strong>
            {cereal.protein ?? "N/A"}
            {cereal.protein !== undefined ? " g" : ""}
          </strong>
        </div>

        <div className="nutrition-item">
          <span className="nutrition-label">
            Fibre
          </span>

          <strong>
            {cereal.fiber ?? cereal.fibre ?? "N/A"}
            {cereal.fiber !== undefined ||
            cereal.fibre !== undefined
              ? " g"
              : ""}
          </strong>
        </div>
      </div>

      {cereal.reason && (
        <p className="recommendation-reason">
          {cereal.reason}
        </p>
      )}
    </article>
  );
}

export default CerealCard;