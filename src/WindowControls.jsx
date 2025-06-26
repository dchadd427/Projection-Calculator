import React from "react";

export default function WindowControls() {
  // ...existing code for minimize, maximize, close handlers...

  // Minimize window
  const minimize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window &&
      window.electronAPI &&
      typeof window.electronAPI.minimize === "function"
    ) {
      window.electronAPI.minimize();
    }
  };
  // Maximize or unmaximize window
  const maximize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window &&
      window.electronAPI &&
      typeof window.electronAPI.maximize === "function"
    ) {
      window.electronAPI.maximize();
    }
  };
  // Close window
  const close = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window &&
      window.electronAPI &&
      typeof window.electronAPI.close === "function"
    ) {
      window.electronAPI.close();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 28,
        position: "relative",
        zIndex: 2000,
        marginLeft: "auto",
        WebkitAppRegion: "no-drag",
      }}
    >
      <button
        title="Minimize"
        type="button"
        tabIndex={0}
        onClick={minimize}
        style={{
          width: 40,
          height: 28,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 18,
        }}
      >
        <span style={{ fontWeight: "bold" }}>─</span>
      </button>
      <button
        title="Maximize"
        type="button"
        tabIndex={0}
        onClick={maximize}
        style={{
          width: 40,
          height: 28,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            border: "1px solid #222",
            padding: "2px 6px",
            borderRadius: 2,
          }}
        >
          ▢
        </span>
      </button>
      <button
        title="Close"
        type="button"
        tabIndex={0}
        onClick={close}
        style={{
          width: 40,
          height: 28,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 18,
          color: "#c00",
        }}
      >
        <span style={{ fontWeight: "bold" }}>×</span>
      </button>
    </div>
  );
}
