import React from "react";
import "./App.css";

// ZoomBar: Vertical zoom control for the visualization
export default function ZoomBar({ zoom, minZoom, maxZoom, onZoomChange }) {
  return (
    <div className="zoom-bar">
      <div className="zoom-label">Zoom</div>
      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step={0.01}
        value={zoom}
        onChange={(e) => onZoomChange(e.target.value)}
        aria-label="Zoom"
        style={{ margin: "12px 0" }}
      />
      <div className="zoom-label">{Math.round(zoom * 100)}%</div>
    </div>
  );
}
