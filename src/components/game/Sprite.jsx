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
