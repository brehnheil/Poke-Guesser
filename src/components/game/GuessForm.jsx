import { useState } from "react";

export default function GuessForm({ onSubmit }) {
  const [value, setValue] = useState("");
  return (
    <form className="guess-form" onSubmit={(e) => { e.preventDefault(); onSubmit(value); }}>
      <input
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Who's that Pokémon?"
        autoFocus
      />
      <button className="btn btn-primary" type="submit">Guess</button>
    </form>
  );
}
