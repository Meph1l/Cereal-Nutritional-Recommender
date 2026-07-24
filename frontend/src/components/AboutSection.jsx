function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div>
        <p className="section-label">
          About the project
        </p>

        <h2>
          Smarter cereal decisions
        </h2>
      </div>

      <p>
        Smart Cereal Finder compares nutritional information from a cereal
        dataset and recommends options based on the user's selected goals.
        The system considers values such as sugar, protein, fibre and
        calories when ranking the cereals.
      </p>
    </section>
  );
}

export default AboutSection;