// GuessForm.jsx
// Controlled input form for submitting a guess to the parent.

import { useState } from "react";

export default function GuessForm({ onSubmit }) {
  // Local input state (controlled component)
  const [value, setValue] = useState("");
  return (
    // Prevent default submit; pass current value up via onSubmit
    <form className="guess-form" onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}>
      <input
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Who's that Pokémon?"
        autoFocus
        autoCorrect="off"
      />
      <button className="btn btn-primary" type="submit">Guess</button>
    </form>
  );
}
