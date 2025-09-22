// HowToPlay.jsx
// Instructions page explaining the rules of the game.

import "../css/home.css"; 

export default function HowToPlay() {
  return (
    <>
      <main className="home__howto" style={{ padding: "32px 20px" }}>
        <h1 className="home__title">How to Play</h1>

        {/* Step-by-step instructions */}
        <ol>
          <li>Look at the silhouette in the center of the screen.</li>
          <li>Type your guess (e.g., <em>pikachu</em>) into the input box.</li>
          <li>Click <strong>Guess</strong> to lock in your answer.</li>
          <li>The Pokémon will be revealed — correct answers earn you points!</li>
          <li>Press <strong>Next</strong> to continue to the next round.</li>
        </ol>

        {/* Extra tip */}
        <p style={{ marginTop: "1rem", opacity: 0.85 }}>
          Tip: spelling matters, but we ignore capitalization and punctuation.
        </p>
      </main>
    </>
  );
}
