// Reveal.jsx
// Displays the correct Pokémon’s name after a guess.
// Provides a button to continue to the next round.

export default function Reveal({ name, onNext }) {
  return (
    <div className="reveal">
      {/* Show the revealed Pokémon’s name */}
      <h2 className="answer">It’s <span>{name}</span>!</h2>
      {/* Button to advance to the next round */}
      <button className="btn" onClick={onNext}>Next</button>
    </div>
  );
}
