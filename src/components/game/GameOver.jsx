// GameOver.jsx
// Displays the game over screen.
// Shows the player’s final score and provides a restart button.

export default function GameOver({ score, onRestart }) {
  return (
    <div className="gameover">
      <h2>Game Over</h2>
      <p>Your score: <strong>{score}</strong></p>
      {/* Button to restart the game */}
      <button className="btn btn-primary" onClick={onRestart}>Play again</button>
    </div>
  );
}
