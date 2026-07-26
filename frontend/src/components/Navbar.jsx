function Navbar() {
  return (
    <header className="navbar">
      <a className="logo" href="#home">
        Smart Cereal Finder
      </a>

      <nav className="nav-links" aria-label="Main navigation">
        <a href="#home">Home</a>
        <a href="#finder">Cereal Finder</a>
        <a href="#about">About</a>
      </nav>
    </header>
  );
}

export default Navbar;