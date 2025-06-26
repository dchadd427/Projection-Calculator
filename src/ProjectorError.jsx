import React from "react";

// ProjectorError: Displays error if the projector setup is invalid
export default function ProjectorError({
  numProjectors,
  projector,
  totalPixelWidth,
  tooMuchOverlap,
}) {
  return (
    <div className="projector-error">
      {numProjectors * projector.width < totalPixelWidth
        ? "Error: The selected number of projectors cannot cover the screen at the current resolution."
        : "Error: Too many projectors. Overlap between projectors cannot exceed 50% of a projector's width."}
    </div>
  );
}
