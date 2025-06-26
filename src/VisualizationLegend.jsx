import React from "react";

// VisualizationLegend: Explains the meaning of the visualization colors and shapes
export default function VisualizationLegend() {
  return (
    <div className="vis-legend">
      <small>
        Each blue rectangle represents a projector's non-overlapped coverage on
        the screen.
        <br />
        Orange regions show the overlapped (blended) areas between projectors.
        <br />
        Projectors are shown below the screen. The triangle shows the throw area
        from projector to screen width.
        <br />
        The blue dashed line and label show the center position of each
        projector along the screen width.
        <br />
        Overlap is shown where rectangles intersect.
      </small>
    </div>
  );
}
