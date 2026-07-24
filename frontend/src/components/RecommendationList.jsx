import CerealCard from "./CerealCard";

function RecommendationList({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <section
      className="recommendation-section"
      aria-labelledby="recommendation-title"
    >
      <div className="section-heading">
        <p className="section-label">
          Your results
        </p>

        <h2 id="recommendation-title">
          Recommended cereals for you
        </h2>

        <p>
          These cereals best match the nutritional preferences you selected.
        </p>
      </div>

      <div className="recommendation-grid">
        {recommendations.map((cereal, index) => (
          <CerealCard
            key={cereal.id || cereal.name || index}
            cereal={cereal}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendationList;