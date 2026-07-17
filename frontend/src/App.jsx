
function App() {
  return (
    <div className="app">
      {/* Website navigation */}
      <header className="navbar">
        <a className="logo" href="#home">
          Smart Cereal Finder
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#finder">Cereal Finder</a>
          <a href="#about">About</a>
        </nav>
      </header>

      {/* Main homepage introduction */}
      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <p className="hero-label">AI-powered cereal recommendations</p>

            <h1>Find the cereal that fits your nutritional goals</h1>

            <p className="hero-description">
              Choose what matters to you, such as lower sugar, higher protein,
              more fibre, or fewer calories. Our recommendation system will
              help you find suitable cereals.
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

        {/* Nutritional preference form */}
        <section className="finder-section" id="finder">
          <div className="section-heading">
            <p className="section-label">Personalized search</p>
            <h2>Tell us what you want in your cereal</h2>
            <p>
              Enter your preferences below. The recommendation feature will be
              connected to the backend later.
            </p>
          </div>

          <form className="preference-form">
            <div className="form-group">
              <label htmlFor="goal">Main nutritional goal</label>

              <select id="goal" name="goal" defaultValue="">
                <option value="" disabled>
                  Select a goal
                </option>
                <option value="low-sugar">Low sugar</option>
                <option value="high-protein">High protein</option>
                <option value="high-fiber">High fibre</option>
                <option value="low-calorie">Low calorie</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxSugar">Maximum sugar</label>

              <input
                id="maxSugar"
                name="maxSugar"
                type="number"
                min="0"
                placeholder="Example: 8 grams"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minimumProtein">Minimum protein</label>

              <input
                id="minimumProtein"
                name="minimumProtein"
                type="number"
                min="0"
                placeholder="Example: 4 grams"
              />
            </div>

            <div className="form-group">
              <label htmlFor="minimumFiber">Minimum fibre</label>

              <input
                id="minimumFiber"
                name="minimumFiber"
                type="number"
                min="0"
                placeholder="Example: 3 grams"
              />
            </div>

            <button className="submit-button" type="submit">
              Get Recommendations
            </button>
          </form>
        </section>

        {/* Project information */}
        <section className="about-section" id="about">
          <div>
            <p className="section-label">About the project</p>
            <h2>Smarter cereal decisions</h2>
          </div>

          <p>
            Smart Cereal Finder compares nutritional information from a cereal
            dataset and recommends options based on the user's selected goals.
          </p>
        </section>
      </main>
    </div>
  )
}

export default App
