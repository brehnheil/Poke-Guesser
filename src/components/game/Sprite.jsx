// Sprite.jsx
// Displays the Pokémon image for the game.
// - Shows either a silhouette or the revealed version depending on `reveal`.
// - Prevents dragging so the image can’t be pulled out of the UI.

export default function Sprite({ image, alt, reveal }) {
  return (
    <div className="sprite">
      <img
        className={reveal ? "revealed" : "silhouette"}
        src={image}
        alt={alt}
        width={320}
        height={320}
        draggable="false"
      />
    </div>
  );
}
