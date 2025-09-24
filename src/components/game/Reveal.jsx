// Reveal.jsx
// Component shown after a guess is submitted.
// - Shows whether the guess was correct or wrong
// - Displays how many points were earned (or 0)
// - Reveals the actual Pokémon name
// - Provides a button to advance to the next round

export default function Reveal({ name, wasCorrect, award, onNext }) {
  return (
    <div className="reveal">
      {/* Heading: indicates if the guess was correct or not */}
      <h2 className="reveal-title">
        {wasCorrect ? "Correct!" : "Wrong"}
      </h2>

      {/* Points awarded (styled green for correct, red for wrong) */}
      <div className={`reveal-points ${wasCorrect ? "correct" : "wrong"}`}>
        {wasCorrect ? `+${award} points` : "+0 points"}
      </div>

      {/* Show the actual Pokémon name for this round */}
      <div className="reveal-answer">
        The Pokémon was <strong>{name}</strong>.
      </div>

      {/* Button to continue to the next round */}
      <button onClick={onNext} className="btn btn-primary">
        Next
      </button>
    </div>
  );
}
