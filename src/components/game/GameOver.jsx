export default function GameOver({ score, onRestart }) {
  return (
    <div className="gameover">
      <h2>Game Over</h2>
      <p>Your score: <strong>{score}</strong></p>
      <button className="btn btn-primary" onClick={onRestart}>Play again</button>
    </div>
  );
}
