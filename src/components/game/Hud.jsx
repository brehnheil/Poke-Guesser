export default function Hud({ round, maxRounds, score }) {
  return (
    <header className="hud">
      <div className="pill">Round <strong>{round}</strong> / {maxRounds}</div>
      <div className="pill">Score <strong>{score}</strong></div>
    </header>
  );
}
