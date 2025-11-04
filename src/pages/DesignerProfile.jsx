// src/pages/DesignerProfile.jsx
import { useParams, useNavigate } from "react-router-dom";
import { SAMPLE_DESIGNERS } from "./designerData";
import { useState, useEffect } from "react";
import { isFavorited, toggleFavorite } from "../utils/favorites";

function getPublishedDesigners() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(
      localStorage.getItem("sewna:published_designers") || "[]"
    );
  } catch {
    return [];
  }
}

export default function DesignerProfile() {
  const { id } = useParams();
  const nav = useNavigate();

  // combine built-in + local published designers
  const ALL_DESIGNERS = [...SAMPLE_DESIGNERS, ...getPublishedDesigners()];
  const designer = ALL_DESIGNERS.find((d) => String(d.id) === String(id));

  // If designer not found, show friendly UI and avoid crashes
  if (!designer) {
    return (
      <div className="container" style={{ paddingTop: 40 }}>
        <h2>Designer not found</h2>
        <p style={{ color: "var(--muted)" }}>
          We couldn't find that designer — they may have been unpublished or the
          link is invalid.
        </p>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn--outline" onClick={() => nav("/discover")}>
            Back to discover
          </button>
        </div>
      </div>
    );
  }

  // Contact form state
  const [messageText, setMessageText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  // Favorites state
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(isFavorited(designer.id));
  }, [designer.id]);

  function handleToggleSaveProfile() {
    toggleFavorite(designer.id);
    setSaved(isFavorited(designer.id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!messageText.trim()) return alert("Please write a brief message");
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 800);
  }

  const PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'%3E%3Crect width='100%25' height='100%25' fill='%23f6f6f6'/%3E%3Ctext x='50%25' y='50%25' fill='%236b6b6b' font-family='Arial, Helvetica, sans-serif' font-size='18' dominant-baseline='middle' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";

  return (
    <div style={{ minHeight: "100vh", paddingTop: 36 }}>
      <div className="container">
        <button className="btn btn--outline" onClick={() => nav("/discover")}>
          ← Back
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
            marginTop: 18,
          }}
        >
          <div>
            <img
              src={designer.image}
              alt={designer.name}
              onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
            <h1 style={{ marginTop: 16 }}>{designer.name}</h1>
            <div style={{ color: "var(--muted)" }}>
              {designer.location} · {designer.rating} ★ · from{" "}
              {designer.priceFrom}
            </div>
            <p style={{ marginTop: 12 }}>{designer.description}</p>

            {designer.portfolio?.length > 0 && (
              <>
                <h3 style={{ marginTop: 18 }}>Portfolio</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
                    gap: 10,
                  }}
                >
                  {designer.portfolio.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`portfolio ${i}`}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                      style={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <aside
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px solid #00000006",
              height: "fit-content",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              Contact {designer.name}
            </div>

            {sent ? (
              <div>
                <p style={{ marginTop: 0 }}>
                  Message sent! {designer.name} will reply here in the
                  prototype.
                </p>
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    setSent(false);
                    setMessageText("");
                  }}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label
                  style={{ display: "block", marginBottom: 8, fontSize: 13 }}
                >
                  Tell the designer about your idea
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={6}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #00000010",
                    fontSize: 14,
                  }}
                  placeholder="Example: I'd like a custom saree for my wedding with pastel embroidery..."
                />

                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? "Sending..." : "Send message"}
                  </button>

                  <button
                    type="button"
                    className="favorite-btn"
                    aria-pressed={saved ? "true" : "false"}
                    onClick={handleToggleSaveProfile}
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
                    <span style={{ fontSize: 13 }}>
                      {saved ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>
              </form>
            )}

            <div style={{ marginTop: 14, color: "var(--muted)", fontSize: 13 }}>
              <div>
                <strong>Response time:</strong> ~2–3 days (prototype)
              </div>
              <div style={{ marginTop: 6 }}>
                <strong>Booking:</strong> Quote & booking available after
                initial chat.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
