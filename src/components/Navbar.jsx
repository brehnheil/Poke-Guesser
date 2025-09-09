import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="app-nav">
      <div className="app-nav__inner">
        <Link to="/" className="app-nav__brand">Poke-Guesser</Link>
        <div className="app-nav__links">
          <Link to="/" className="app-nav__link">Home</Link>
          <Link to="/game" className="app-nav__link app-nav__cta">Play</Link>
        </div>
      </div>
    </nav>
  );
}
