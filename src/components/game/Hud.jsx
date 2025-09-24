// Hud.jsx
// Heads-up display for the game.
// - Shows the current round number and total rounds
// - Shows the player's current score

export default function Hud({ round, maxRounds, score }) {
  return (
    <header className="hud">
      {/* Display current round and total rounds */}
      Round {round} / {maxRounds}

      {/* Separator */}
      &nbsp; | &nbsp;
      
      {/* Display current score */}
      Score {score}
    </header>
  );
}
