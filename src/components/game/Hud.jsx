// Hud.jsx
// Heads-up display for the game.
// Shows the current round, total rounds, and the player’s score.

export default function Hud({ round, maxRounds, score }) {
  return (
    <header className="hud">
      {/* Current round out of total */}
      <div className="pill">Round <strong>{round}</strong> / {maxRounds}</div>
      {/* Current score */}
      <div className="pill">Score <strong>{score}</strong></div>
    </header>
  );
}
