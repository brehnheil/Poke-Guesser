// Game.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { usePokemonList } from "../hooks/usePokemonList";
import Hud from "../components/game/Hud";
import Sprite from "../components/game/Sprite";
import GuessForm from "../components/game/GuessForm";
import Reveal from "../components/game/Reveal";
import GameOver from "../components/game/GameOver";
import "../css/game.css";

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Game() {
  const { list: pokemonList, loading, getRandom } = usePokemonList(151);
  const [current, setCurrent] = useState(null);
  const [phase, setPhase] = useState("guess"); // "guess" | "reveal" | "over"
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const maxRounds = 10;

  useEffect(() => {
    if (!loading && pokemonList.length && !current) {
      setCurrent(getRandom());
    }
  }, [loading, pokemonList, current, getRandom]);

  function submitGuess(value) {
    if (!current) return;
    const correct = normalize(value) === normalize(current.name);
    if (correct) setScore((s) => s + 100);
    setPhase("reveal");
  }

  function nextRound() {
    if (round >= maxRounds) return setPhase("over");
    setCurrent(getRandom(current?.id));
    setRound((r) => r + 1);
    setPhase("guess");
  }

  function resetGame() {
    setScore(0);
    setRound(1);
    setCurrent(getRandom());
    setPhase("guess");
  }

  if (loading || !current) {
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
        <Hud round={round} maxRounds={maxRounds} score={score} />
        <section className="stage">
          <Sprite
            image={current.image}
            alt={phase === "reveal" ? current.name : "Who's that Pokémon?"}
            reveal={phase !== "guess"}
          />

          {phase === "guess" && <GuessForm onSubmit={submitGuess} />}
          {phase === "reveal" && <Reveal name={current.name} onNext={nextRound} />}
          {phase === "over" && <GameOver score={score} onRestart={resetGame} />}
        </section>
      </main>
    </>
  );
}
