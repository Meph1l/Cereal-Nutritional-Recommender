function Hero() {
  return (
    <section className="hero-section" id="home">
      <div className="hero-content">
        <p className="hero-label">
          AI-powered cereal recommendations
        </p>

        <h1>
          Find the cereal that fits your nutritional goals
        </h1>

        <p className="hero-description">
          Choose what matters to you, such as lower sugar, higher protein,
          more fibre, or fewer calories. Our recommendation system will help
          you find suitable cereals.
        </p>

        <a className="primary-button" href="#finder">
          Find My Cereal
        </a>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="cereal-bowl">
          <span className="cereal-piece piece-one"></span>
          <span className="cereal-piece piece-two"></span>
          <span className="cereal-piece piece-three"></span>
          <span className="cereal-piece piece-four"></span>
          <span className="cereal-piece piece-five"></span>
        </div>
      </div>
    </section>
  );
}

export default Hero;