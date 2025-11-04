// src/components/Toast.jsx
import { useEffect, useState } from "react";

export default function Toast() {
  const [msg, setMsg] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onToast(e) {
      const message = e?.detail?.message || "Done";
      setMsg(message);
      setVisible(true);
      window.clearTimeout(window.__sewna_toast_timeout);
      window.__sewna_toast_timeout = setTimeout(() => {
        setVisible(false);
      }, 2200);
    }
    window.addEventListener("sewna:toast", onToast);
    return () => window.removeEventListener("sewna:toast", onToast);
  }, []);

  if (!msg) return null;

  return (
    <div
      aria-live="polite"
      style={{ position: "fixed", inset: "auto 20px 24px auto", zIndex: 1200 }}
    >
      <div className={`sewna-toast ${visible ? "show" : ""}`} role="status">
        {msg}
      </div>
    </div>
  );
}
