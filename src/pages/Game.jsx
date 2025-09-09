// Game.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../css/game.css";

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Game() {
  const [pokemonList, setPokemonList] = useState([]);
  const [current, setCurrent] = useState(null);
  const [phase, setPhase] = useState("guess"); // "guess" | "reveal" | "over"
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [maxRounds] = useState(10);

  useEffect(() => {
    async function fetchPokemon() {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await res.json();
      const list = data.results.map((p) => {
        const id = p.url.split("/").filter(Boolean).pop();
        return {
          id,
          name: p.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });
      setPokemonList(list);
      const idx = Math.floor(Math.random() * list.length);
      setCurrent(list[idx]);
    }
    fetchPokemon();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!current) return;
    const correct = normalize(guess) === normalize(current.name);
    if (correct) setScore((s) => s + 100);
    setPhase("reveal");
  }

  function nextRound() {
    if (round >= maxRounds) {
      setPhase("over");
      return;
    }
    let next;
    do {
      next = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    } while (current && next.id === current.id && pokemonList.length > 1);

    setCurrent(next);
    setGuess("");
    setRound((r) => r + 1);
    setPhase("guess");
  }

  function resetGame() {
    setScore(0);
    setRound(1);
    setGuess("");
    setPhase("guess");
    if (pokemonList.length) {
      const idx = Math.floor(Math.random() * pokemonList.length);
      setCurrent(pokemonList[idx]);
    } else {
      setCurrent(null);
    }
  }

  if (pokemonList.length === 0 || !current) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading…</div>
      </>
    );
  }

  return (
    <>
      <main className="game">
        <header className="hud">
          <div className="pill">
            Round <strong>{round}</strong> / {maxRounds}
          </div>
          <div className="pill">
            Score <strong>{score}</strong>
          </div>
        </header>

        <section className="stage">
          <div className="sprite">
            <img
              className={phase === "guess" ? "silhouette" : "revealed"}
              src={current.image}
              alt={phase === "reveal" ? current.name : "Who's that Pokémon?"}
              width={320}
              height={320}
              draggable="false"
            />
          </div>

          {phase === "guess" && (
            <form className="guess-form" onSubmit={handleSubmit}>
              <input
                className="input"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Who's that Pokémon?"
                autoFocus
              />
              <button className="btn btn-primary" type="submit">
                Guess
              </button>
            </form>
          )}

          {phase === "reveal" && (
            <div className="reveal">
              <h2 className="answer">
                It’s <span>{current.name}</span>!
              </h2>
              <button className="btn" onClick={nextRound}>
                Next
              </button>
            </div>
          )}

          {phase === "over" && (
            <div className="gameover">
              <h2>Game Over</h2>
              <p>
                Your score: <strong>{score}</strong>
              </p>
              <button className="btn btn-primary" onClick={resetGame}>
                Play again
              </button>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
