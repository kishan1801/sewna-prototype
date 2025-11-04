import { useNavigate } from "react-router-dom";
import sewnaLogo from "../assets/sewnalogo4.png";

export default function WelcomePage() {
  const nav = useNavigate();

  return (
    <div
      className="hero"
      style={{
        minHeight: "72vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div className="container" style={{ textAlign: "center", maxWidth: 720 }}>
        {/* 🪡 Logo Section */}
        <img
          src={sewnaLogo}
          alt="Sewna Logo"
          style={{
            width: 140,
            height: "auto",
            marginBottom: 20,
            borderRadius: "50%",
          }}
        />

        <h1 style={{ margin: 0, fontSize: 48, fontWeight: 700 }}>
          Bring your dream outfit to life
        </h1>

        <p style={{ color: "var(--muted)", marginTop: 12 }}>
          Connect with independent designers to create handcrafted looks made
          just for you.
        </p>

        <div
          className="role-grid"
          style={{ marginTop: 28, justifyContent: "center" }}
        >
          <button
            className="btn btn--outline"
            onClick={() => nav("/designer-dashboard")}
            aria-label="I am a Designer"
          >
            I am a Designer
          </button>

          <button
            className="btn btn--primary"
            onClick={() => nav("/discover")}
            aria-label="I need a Designer"
          >
            I need a Designer
          </button>
        </div>

        <div style={{ marginTop: 34, color: "var(--muted)" }}>
          <small>
            How it works: 1) Share your idea — 2) Browse designers — 3)
            Collaborate & fit
          </small>
        </div>
      </div>
    </div>
  );
}
