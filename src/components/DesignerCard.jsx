import { useState, useEffect } from "react";
import { isFavorited, toggleFavorite } from "../utils/favorites";

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='520' viewBox='0 0 800 520'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' fill='%236b6b6b' font-family='Arial, sans-serif' font-size='20' dominant-baseline='middle' text-anchor='middle'%3EImage not available%3C/text%3E%3C/svg%3E";

export default function DesignerCard({ designer, onView }) {
  const [src, setSrc] = useState(designer.image || PLACEHOLDER);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isFavorited(designer.id));
  }, [designer.id]);

  function handleToggleSave(e) {
    e.stopPropagation(); // prevent card-level clicks
    toggleFavorite(designer.id);
    setSaved(isFavorited(designer.id));
  }

  return (
    <div
      className="card"
      role="article"
      aria-label={`Designer ${designer.name}`}
    >
      <img
        className="avatar"
        src={src}
        alt={`${designer.name} avatar`}
        onError={() => setSrc(PLACEHOLDER)}
      />

      <div>
        <div className="meta">
          <div>
            <div className="name">{designer.name}</div>
            <div className="keywords">{designer.keywords.join(" · ")}</div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="favorite-btn"
              aria-pressed={saved ? "true" : "false"}
              onClick={handleToggleSave}
              title={saved ? "Unsave designer" : "Save designer"}
            >
              <svg
                viewBox="0 0 24 24"
                fill={saved ? "var(--accent)" : "none"}
                stroke={saved ? "var(--accent)" : "currentColor"}
                strokeWidth="1.6"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 21s-7.5-4.4-9.2-7.1C1.5 11.9 3 6.9 7 5c2.2-1 4.8-.4 5 2 .2-2.4 2.8-3 5-2 4 1.9 5.5 6.9 4.2 8.9C19.5 16.6 12 21 12 21z" />
              </svg>
              <span style={{ fontSize: 13 }}>{saved ? "Saved" : "Save"}</span>
            </button>

            <button
              className="btn btn--outline"
              onClick={() => onView(designer)}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
