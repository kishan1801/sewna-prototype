// src/pages/DesignerDiscovery.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesignerCard from "../components/DesignerCard";
import Modal from "../components/_Modal"; // change to ../components/Modal if yours is named Modal.jsx
import { SAMPLE_DESIGNERS } from "./designerData";
import { getFavorites } from "../utils/favorites";

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

export default function DesignerDiscovery() {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const allTags = [
    "Bridal",
    "Couture",
    "Sarees",
    "Minimal",
    "Formal",
    "Boho",
    "Dresses",
    "Streetwear",
    "Custom",
    "Men's tailoring",
    "Ready-to-wear",
  ];

  // initial simulated load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, []);

  // whenever query/tag/saved toggle changes, show skeleton briefly
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 280);
    return () => clearTimeout(t);
  }, [query, selectedTag, showSavedOnly]);

  // assemble designers: built-in + published
  const published = getPublishedDesigners();
  const ALL_DESIGNERS = [...SAMPLE_DESIGNERS, ...published];

  const filtered = ALL_DESIGNERS.filter((d) => {
    const kws = Array.isArray(d.keywords)
      ? d.keywords.join(" ")
      : d.keywords || "";
    const matchesQuery = `${d.name} ${kws}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesTag = !selectedTag || (d.keywords || []).includes(selectedTag);
    const matchesSaved = !showSavedOnly || getFavorites().includes(d.id);
    return matchesQuery && matchesTag && matchesSaved;
  });

  const onView = (d) => setSelectedDesigner(d);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 36 }}>
      <div className="container">
        <h2 style={{ marginTop: 0 }}>Find your designer</h2>
        <p style={{ color: "var(--muted)" }}>
          Browse designers and filter by style. Click “View” to open a profile
          (prototype).
        </p>

        <div className="search-row">
          <input
            placeholder="Search designers or styles (e.g. 'bridal')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn--outline"
              onClick={() => {
                setQuery("");
                setSelectedTag(null);
                setShowSavedOnly(false);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* top row: count + saved toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ color: "var(--muted)", fontSize: 13 }}>
            {filtered.length} designers
          </div>
          <div>
            <button
              className={`favorite-btn`}
              aria-pressed={showSavedOnly ? "true" : "false"}
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              title={showSavedOnly ? "Show all designers" : "Show only saved"}
            >
              <svg
                viewBox="0 0 24 24"
                fill={showSavedOnly ? "var(--accent)" : "none"}
                stroke={showSavedOnly ? "var(--accent)" : "currentColor"}
                strokeWidth="1.6"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 21s-7.5-4.4-9.2-7.1C1.5 11.9 3 6.9 7 5c2.2-1 4.8-.4 5 2 .2-2.4 2.8-3 5-2 4 1.9 5.5 6.9 4.2 8.9C19.5 16.6 12 21 12 21z" />
              </svg>
              <span style={{ fontSize: 13 }}>
                {showSavedOnly ? "Saved only" : "All"}
              </span>
            </button>
          </div>
        </div>

        <div className="filter-tags" style={{ marginBottom: 18 }}>
          {allTags.slice(0, 8).map((tag) => (
            <div
              key={tag}
              className={`tag ${selectedTag === tag ? "selected" : ""}`}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* grid or skeletons or empty state */}
        {loading ? (
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card-skeleton">
                <div className="avatar-s skeleton" />
                <div className="line skeleton" />
                <div className="line sm skeleton" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}
          >
            <h3 style={{ marginTop: 0 }}>No designers found</h3>
            <p style={{ marginTop: 8 }}>
              Try clearing filters or search terms to browse all designers.
            </p>
            <div style={{ marginTop: 12 }}>
              <button
                className="btn btn--outline"
                onClick={() => {
                  setQuery("");
                  setSelectedTag(null);
                  setShowSavedOnly(false);
                }}
              >
                Show all designers
              </button>
            </div>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((d) => (
              <DesignerCard key={d.id} designer={d} onView={onView} />
            ))}
          </div>
        )}
      </div>

      {/* Designer Profile Modal */}
      <Modal
        open={!!selectedDesigner}
        onClose={() => setSelectedDesigner(null)}
        title={selectedDesigner?.name}
      >
        {selectedDesigner && (
          <>
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              <img
                src={selectedDesigner.image}
                alt={`${selectedDesigner.name}`}
                style={{
                  width: 180,
                  height: 180,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>
                      {selectedDesigner.name}
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>
                      {(selectedDesigner.keywords || []).join(" · ")}
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 13,
                        marginTop: 6,
                      }}
                    >
                      {selectedDesigner.location} · {selectedDesigner.rating} ★
                      · from {selectedDesigner.priceFrom}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      className="btn btn--primary"
                      onClick={() => alert("Contact flow (prototype)")}
                      aria-label="Contact designer"
                    >
                      Contact
                    </button>

                    <button
                      className="btn btn--outline"
                      onClick={() => {
                        setSelectedDesigner(null);
                        nav(`/designer/${selectedDesigner.id}`);
                      }}
                      aria-label="Open full profile"
                    >
                      Open full profile
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 12, color: "var(--muted)" }}>
                  <p style={{ margin: 0 }}>{selectedDesigner.description}</p>
                </div>
              </div>
            </div>

            {selectedDesigner.portfolio?.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10 }}>
                  Portfolio
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {selectedDesigner.portfolio.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`portfolio ${i}`}
                      style={{
                        width: 120,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}
