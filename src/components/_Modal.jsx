import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, title, children }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // focus close button when open
    closeRef.current?.focus();

    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    // prevent body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title || "dialog"}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button
            ref={closeRef}
            className="btn btn--outline"
            onClick={onClose}
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
