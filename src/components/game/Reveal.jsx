export default function Reveal({ name, onNext }) {
  return (
    <div className="reveal">
      <h2 className="answer">It’s <span>{name}</span>!</h2>
      <button className="btn" onClick={onNext}>Next</button>
    </div>
  );
}
