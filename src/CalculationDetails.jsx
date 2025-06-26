import React from "react";

// CalculationDetails: Shows all calculation results for the projection setup
export default function CalculationDetails({
  aspect,
  imageWidthFt,
  pixelsPerFoot,
  totalPixelWidth,
  minNumProjectors,
  totalProjectorPixels,
  blend,
  blendPerOverlap,
  projector,
  fullAspectRatio,
  lensRatio,
}) {
  return (
    <>
      <h3>Calculation</h3>
      <ul>
        <li>Projector Aspect: {aspect.toFixed(2)}</li>
        <li>Image Width (ft): {imageWidthFt.toFixed(2)}</li>
        <li>Pixels Per Foot: {pixelsPerFoot.toFixed(2)}</li>
        <li>Total Pixel Width of Screen: {totalPixelWidth.toFixed(0)} px</li>
        <li>Projectors Needed: {minNumProjectors}</li>
        <li>Total Projector Pixels: {totalProjectorPixels} px</li>
        <li>Total Blend/Overlap: {blend.toFixed(0)} px</li>
        <li>Blend Per Overlap: {blendPerOverlap.toFixed(0)} px</li>
        <li>
          <b>
            Full Resolution After Blending:{" "}
            {(totalProjectorPixels - blend).toFixed(0)} px (width) x{" "}
            {projector.height} px (height)
          </b>
        </li>
        <li>
          <b>Full aspect ratio: {fullAspectRatio.toFixed(2)}</b>
        </li>
        <li>
          <b>Lens Ratio Needed: {lensRatio} (Throw Distance / Image Width)</b>
        </li>
      </ul>
    </>
  );
}
