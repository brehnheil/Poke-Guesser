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

const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

const TIMER_MS = 10000;              // 10 seconds per round
const TICK_MS = 50;                  // update granularity
const MAX_POINTS_PER_ROUND = 1000;   // max if answered immediately
const GRACE_MS = 1000;                // buffer before countdown starts (lets 1000 be attainable)

export default function Game() {
  const { list: pokemonList, loading, getRandom } = usePokemonList(151);
  const { user } = useAuth();

  // Game state
  const [current, setCurrent] = useState(null); // target pokemon
  const [phase, setPhase] = useState("guess");  // "guess" | "reveal" | "over"
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const maxRounds = 10;

  // Timer state
  const [timeLeft, setTimeLeft] = useState(TIMER_MS);
  const timerRef = useRef(null);
  const kickoffRef = useRef(null);

  // Save-once guard
  const didSaveRef = useRef(false);

  // Per-round result details for Reveal screen
  const [lastAward, setLastAward] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(false);

  // Pick a new random Pokémon for each round
  useEffect(() => {
    if (!loading && pokemonList.length && !current) {
      setCurrent(getRandom());
    }
  }, [loading, pokemonList, current, getRandom]);

  // Start/stop timer on phase transitions (with grace/buffer)
  useEffect(() => {
    clearInterval(timerRef.current);
    clearTimeout(kickoffRef.current);

    if (phase === "guess" && current) {
      setTimeLeft(TIMER_MS);

      // Delay the countdown a hair so a super-fast correct can still yield 1000
      kickoffRef.current = setTimeout(() => {
        timerRef.current = setInterval(() => {
          setTimeLeft((ms) => {
            const next = ms - TICK_MS;
            if (next <= 0) {
              clearInterval(timerRef.current);
              setPhase("reveal"); // time up → auto reveal (no points)
              return 0;
            }
            return next;
          });
        }, TICK_MS);
      }, GRACE_MS);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(kickoffRef.current);
    };
  }, [phase, current]);

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

    // Stop timer & grace
    clearInterval(timerRef.current);
    clearTimeout(kickoffRef.current);

    let award = 0;
    if (correct) {
      award = Math.max(0, Math.round((timeLeft / TIMER_MS) * MAX_POINTS_PER_ROUND));
      setScore((s) => s + award);
    }

    // Remember round result for Reveal screen
    setLastAward(award);
    setLastCorrect(!!correct);

    setPhase("reveal");
  }

  // Advance to the next round
  function nextRound() {
    if (round >= maxRounds) {
      setPhase("over");
      return;
    }
    setCurrent(getRandom(current?.id));
    setRound((r) => r + 1);
    setPhase("guess"); // timer restarts via effect
  }

  // Restart the game
  function resetGame() {
    setScore(0);
    setRound(1);
    setCurrent(getRandom());
    setPhase("guess");
    didSaveRef.current = false;
    setLastAward(0);
    setLastCorrect(false);
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
        {/* Top-center HUD (round + score) */}
        <Hud round={round} maxRounds={maxRounds} score={score} />

        <section className="stage">
          <div className="sprite-wrapper">
            <Sprite
              image={current.image}
              alt={phase === "reveal" ? current.name : "Who's that Pokémon?"}
              reveal={phase !== "guess"}
            />
            <div className={`timer-bar-container ${phase !== "guess" ? "timer-bar-paused" : ""}`}>
              <div
                key={round}
                className={`timer-bar-fill ${phase === "guess" ? "running" : ""}`}
                aria-label="Time remaining"
                role="progressbar"
              />
            </div>
          </div>

          {phase === "guess" && <GuessForm onSubmit={submitGuess} />}

          {phase === "reveal" && (
            <Reveal
              name={current.name}
              wasCorrect={lastCorrect}
              award={lastAward}
              onNext={nextRound}
            />
          )}

          {phase === "over" && <GameOver score={score} onRestart={resetGame} />}
        </section>
      </main>
    </>
  );
}
