import { Link } from "react-router";
import Navbar from "../components/Navbar";
import "../css/home.css";

export default function Home() {
  return (
    <>
      <main className="home">
        <section className="home__hero">
          <div className="home__card">
            <h1 className="home__title">Who’s that Pokémon?</h1>
            <p className="home__subtitle">
              Guess the Pokémon from its silhouette. Beat your high score and climb the ranks!
            </p>
            <div className="home__actions">
              <Link to="/game" className="btn btn-primary btn-lg">Play</Link>
              <Link to="/howtoplay" className="btn btn-ghost">How to play</Link>
            </div>
          </div>
        </section>
        <footer className="home__footer">
          <span>Built with PokéAPI</span>
        </footer>
      </main>
    </>
  );
}
