// src/pages/DesignerDashboard.jsx
import { useEffect, useState } from "react";

const STORAGE_KEY = "sewna:designer_profile";
const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'%3E%3Crect width='100%25' height='100%25' fill='%23f6f6f6'/%3E%3Ctext x='50%25' y='50%25' fill='%236b6b6b' font-family='Arial, Helvetica, sans-serif' font-size='18' dominant-baseline='middle' text-anchor='middle'%3ENo image%3C/text%3E%3C/svg%3E";

function readFilesAsDataURLs(files) {
  const readers = Array.from(files).map(
    (file) =>
      new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res({ name: file.name, data: r.result });
        r.onerror = () => res(null);
        r.readAsDataURL(file);
      })
  );
  return Promise.all(readers).then((arr) => arr.filter(Boolean));
}

export default function DesignerDashboard() {
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    bio: "",
    keywords: "",
    portfolio: [],
    priceFrom: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {}
  }, []);

  function updateField(key, val) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  async function handleFiles(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const items = await readFilesAsDataURLs(files);
    setProfile((p) => ({ ...p, portfolio: [...items, ...p.portfolio] }));
    e.target.value = null;
    setMessage(`${items.length} image(s) added`);
    setTimeout(() => setMessage(null), 1400);
  }

  function removeImage(index) {
    setProfile((p) => {
      const copy = [...p.portfolio];
      copy.splice(index, 1);
      return { ...p, portfolio: copy };
    });
  }

  function saveProfile() {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setMessage("Profile saved locally");
    } catch (e) {
      setMessage("Save failed");
    }
    setTimeout(() => {
      setMessage(null);
      setSaving(false);
    }, 900);
  }

  function clearProfile() {
    if (!confirm("Clear your profile locally?")) return;
    // if the profile was published, also remove from published list
    try {
      const published = JSON.parse(
        localStorage.getItem("sewna:published_designers") || "[]"
      );
      const kept = published.filter(
        (p) => String(p.id) !== String(profile.publishId)
      );
      localStorage.setItem("sewna:published_designers", JSON.stringify(kept));
    } catch {}
    localStorage.removeItem(STORAGE_KEY);
    setProfile({
      name: "",
      location: "",
      bio: "",
      keywords: "",
      portfolio: [],
      priceFrom: "",
    });
    setMessage("Profile cleared");
    setTimeout(() => setMessage(null), 900);
  }

  function publishProfile() {
    try {
      const id = profile.publishId || `local-${Date.now()}`;

      const publicProfile = {
        id,
        name: profile.name || "Unnamed designer",
        keywords: (profile.keywords || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        image: profile.portfolio?.[0]?.data || PLACEHOLDER,
        location: profile.location || "",
        rating: 4.8,
        priceFrom: profile.priceFrom || "",
        description: profile.bio || "",
        portfolio: profile.portfolio?.map((p) => p.data).filter(Boolean) || [],
      };

      const existing = JSON.parse(
        localStorage.getItem("sewna:published_designers") || "[]"
      );
      const idx = existing.findIndex((p) => String(p.id) === String(id));
      if (idx > -1) existing[idx] = publicProfile;
      else existing.unshift(publicProfile);

      localStorage.setItem(
        "sewna:published_designers",
        JSON.stringify(existing)
      );

      const updatedProfile = { ...profile, publishId: id };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);

      setMessage(
        profile.publishId
          ? "Profile updated"
          : "Profile published — visible in Discovery"
      );
      setTimeout(() => setMessage(null), 1400);
    } catch (e) {
      console.error(e);
      setMessage("Publish failed");
      setTimeout(() => setMessage(null), 1400);
    }
  }

  function unpublishProfile() {
    if (!profile.publishId) {
      alert("No published profile to remove.");
      return;
    }
    if (!confirm("Remove published profile? This will only remove it locally."))
      return;

    try {
      const existing = JSON.parse(
        localStorage.getItem("sewna:published_designers") || "[]"
      );
      const filtered = existing.filter(
        (p) => String(p.id) !== String(profile.publishId)
      );
      localStorage.setItem(
        "sewna:published_designers",
        JSON.stringify(filtered)
      );

      const newProfile = { ...profile };
      delete newProfile.publishId;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);

      setMessage("Profile unpublished");
      setTimeout(() => setMessage(null), 1200);
    } catch (e) {
      console.error(e);
      setMessage("Could not unpublish");
      setTimeout(() => setMessage(null), 1200);
    }
  }

  return (
    <div style={{ minHeight: "100vh", padding: 36 }}>
      <div className="container" style={{ maxWidth: 920 }}>
        <h2 style={{ marginTop: 0 }}>Designer Dashboard (Prototype)</h2>
        <p style={{ color: "var(--muted)" }}>
          Edit your public profile and upload portfolio images. This is a
          frontend-only demo — data is saved to your browser.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 18,
            marginTop: 18,
          }}
        >
          <div>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
            >
              Display name
            </label>
            <input
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Your full name or studio name"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #00000010",
              }}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
                >
                  Location
                </label>
                <input
                  value={profile.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="City, Country"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #00000010",
                  }}
                />
              </div>

              <div style={{ width: 160 }}>
                <label
                  style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
                >
                  Starting price
                </label>
                <input
                  value={profile.priceFrom || ""}
                  onChange={(e) => updateField("priceFrom", e.target.value)}
                  placeholder="e.g. ₹3,500"
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #00000010",
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
              >
                Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={5}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #00000010",
                }}
                placeholder="Short description about your style and process"
              ></textarea>
            </div>

            <div style={{ marginTop: 12 }}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
              >
                Keywords / styles (comma separated)
              </label>
              <input
                value={profile.keywords}
                onChange={(e) => updateField("keywords", e.target.value)}
                placeholder="bridal, couture, minimal"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #00000010",
                }}
              />
            </div>

            <div style={{ marginTop: 18 }}>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 700 }}
              >
                Portfolio — upload images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
              />
              <div style={{ marginTop: 10, color: "var(--muted)" }}>
                Tip: upload clear photos of garments (no huge files).
              </div>
            </div>

            <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
              <button
                className="btn btn--primary"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save profile"}
              </button>

              <button className="btn btn--outline" onClick={publishProfile}>
                {profile.publishId ? "Update publish" : "Publish profile"}
              </button>

              <button className="btn btn--outline" onClick={clearProfile}>
                Clear
              </button>

              {profile.publishId && (
                <button className="btn btn--outline" onClick={unpublishProfile}>
                  Unpublish
                </button>
              )}
            </div>

            {message && (
              <div style={{ marginTop: 12, color: "var(--muted)" }}>
                {message}
              </div>
            )}
          </div>

          <aside
            style={{
              border: "1px solid #00000006",
              padding: 12,
              borderRadius: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {profile.name || "Your name"}
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  {profile.location || "Location"}
                </div>
                {profile.priceFrom && (
                  <div
                    style={{
                      marginTop: 6,
                      color: "var(--muted)",
                      fontSize: 13,
                    }}
                  >
                    From {profile.priceFrom}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  {(profile.keywords || "")
                    .split(",")
                    .filter(Boolean)
                    .slice(0, 3)
                    .join(" · ")}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, minHeight: 72 }}>
              <div style={{ color: "var(--muted)" }}>
                {profile.bio || "A short bio will appear here."}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>
                Portfolio preview
              </div>
              {profile.portfolio.length === 0 ? (
                <div style={{ color: "var(--muted)" }}>No images yet</div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))",
                    gap: 8,
                  }}
                >
                  {profile.portfolio.map((it, i) => (
                    <div key={i} style={{ position: "relative" }}>
                      <img
                        src={it.data || PLACEHOLDER}
                        alt={it.name || `img-${i}`}
                        style={{
                          width: "100%",
                          height: 82,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                      />
                      <button
                        aria-label="Remove image"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          background: "rgba(255,255,255,0.9)",
                          borderRadius: 8,
                          border: "1px solid #00000006",
                          padding: "4px 6px",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
