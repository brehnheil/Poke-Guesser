// Game.jsx
// Main game loop page.
// - Manages rounds, scoring, and game state (guessing, reveal, game over).
// - Renders HUD, Pokémon sprite, guess form, and results.
// - Integrates with Supabase to record scores.

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { usePokemonList } from "../hooks/usePokemonList";
import Hud from "../components/game/Hud";
import Sprite from "../components/game/Sprite";
import GuessForm from "../components/game/GuessForm";
import Reveal from "../components/game/Reveal";
import GameOver from "../components/game/GameOver";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import "../css/game.css";

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export default function Game() {
  const { list: pokemonList, loading, getRandom } = usePokemonList(151);
  const { user } = useAuth();

  // Game state
  const [current, setCurrent] = useState(null); // target pokemon
  const [phase, setPhase] = useState("guess");  // "guess" | "reveal" | "over"
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const maxRounds = 10;

  const didSaveRef = useRef(false);

  // Pick a new random Pokémon for each round
  useEffect(() => {
    if (!loading && pokemonList.length && !current) {
      setCurrent(getRandom());
    }
  }, [loading, pokemonList, current, getRandom]);

  // When game ends, record score if logged in
  useEffect(() => {
    async function saveScore() {
      if (!user) {
        console.warn("Not signed in — score not saved.");
        return;
      }
      const { error } = await supabase.from("scores").insert({
        user_id: user.id,
        score: score,
      });
      if (error) console.error("Failed to save score:", error);
    }

    if (phase === "over" && !didSaveRef.current) {
      didSaveRef.current = true;
      saveScore();
    }
  }, [phase, score, user]);

  // Handle guess submission
  function submitGuess(value) {
    if (!current) return;
    const correct = normalize(value) === normalize(current.name);
    if (correct) setScore((s) => s + 100);
    setPhase("reveal");
  }

  // Advance to the next round
  function nextRound() {
    if (round >= maxRounds) return setPhase("over");
    setCurrent(getRandom(current?.id));
    setRound((r) => r + 1);
    setPhase("guess");
  }

  // Restart the game
  function resetGame() {
    setScore(0);
    setRound(1);
    setCurrent(getRandom());
    setPhase("guess");
    didSaveRef.current = false; // allow saving for the new run
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
