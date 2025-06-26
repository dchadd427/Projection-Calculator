import React from "react";

// ProjectorVisualization: Renders the SVG visualization of the projector setup
export default function ProjectorVisualization({
  visScreenWidth,
  visScreenHeight,
  visProjWidth,
  visProjHeight,
  visDistance,
  visPadding,
  screen,
  projector,
  canCover,
  numProjectors,
  overlapPx,
  blendPerOverlap,
  distanceFt,
}) {
  // SVG height: screen + projector throw + padding
  const svgWidth = visScreenWidth + 40; // 20px padding left/right
  const svgHeight = visScreenHeight + visDistance + visPadding;
  // Projector Y position: below screen, at visScreenHeight + visDistance
  const projY = visScreenHeight + visDistance;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <svg
        className="vis-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{
          width: svgWidth,
          height: svgHeight,
          display: "block",
          background: "#eee",
          borderRadius: 8,
        }}
      >
        <g transform="translate(20,0)">
          {/* Screen rectangle */}
          <rect
            x={0}
            y={0}
            width={visScreenWidth}
            height={visScreenHeight}
            fill="#fff"
            stroke="#000"
          />
          {/* Projectors and throw triangles */}
          {canCover &&
            Array.from({ length: numProjectors }).map((_, idx) => {
              const x = idx * (visProjWidth - overlapPx);
              const projCenter = x + visProjWidth / 2;
              const screenPosFt =
                (projCenter / visScreenWidth) * screen.widthFt;
              const screenY = visScreenHeight;
              const leftX = x;
              const rightX = x + visProjWidth;
              const trianglePoints = `${projCenter},${projY} ${leftX},${screenY} ${rightX},${screenY}`;
              const hasLeftOverlap = idx > 0 && overlapPx > 0;
              const hasRightOverlap = idx < numProjectors - 1 && overlapPx > 0;
              const projWidthFt =
                (visProjWidth / visScreenWidth) * screen.widthFt;
              const lensRatioForProj = (distanceFt / projWidthFt).toFixed(2);
              return (
                <g key={idx}>
                  {/* Throw triangle */}
                  <polygon
                    points={trianglePoints}
                    fill="rgba(0,128,255,0.12)"
                    stroke="#0078ff"
                    strokeWidth={1}
                  />
                  {/* Projector icon */}
                  <rect
                    x={projCenter - 15}
                    y={projY - 10}
                    width={30}
                    height={20}
                    fill="#444"
                    stroke="#222"
                    rx={4}
                  />
                  {/* Projector label */}
                  <text
                    x={projCenter}
                    y={projY + 20}
                    fontSize="12"
                    fill="#222"
                    textAnchor="middle"
                  >
                    P{idx + 1}
                  </text>
                  {/* Lens ratio below projector */}
                  <text
                    x={projCenter}
                    y={projY + 36}
                    fontSize="11"
                    fill="#0078ff"
                    textAnchor="middle"
                  >
                    Lens: {lensRatioForProj}
                  </text>
                  {/* Left overlap */}
                  {hasLeftOverlap && (
                    <>
                      <rect
                        x={x}
                        y={0}
                        width={overlapPx}
                        height={visProjHeight}
                        fill="rgba(255,128,0,0.35)"
                        stroke="none"
                      />
                      <text
                        x={x + overlapPx / 2}
                        y={visProjHeight / 2}
                        fontSize="11"
                        fill="#b35c00"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        style={{ pointerEvents: "none", fontWeight: 600 }}
                      >
                        {blendPerOverlap.toFixed(0)} px
                      </text>
                    </>
                  )}
                  {/* Right overlap */}
                  {hasRightOverlap && (
                    <>
                      <rect
                        x={x + visProjWidth - overlapPx}
                        y={0}
                        width={overlapPx}
                        height={visProjHeight}
                        fill="rgba(255,128,0,0.35)"
                        stroke="none"
                      />
                      <text
                        x={x + visProjWidth - overlapPx / 2}
                        y={visProjHeight / 2}
                        fontSize="11"
                        fill="#b35c00"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        style={{ pointerEvents: "none", fontWeight: 600 }}
                      >
                        {blendPerOverlap.toFixed(0)} px
                      </text>
                    </>
                  )}
                  {/* Non-overlapped center */}
                  <rect
                    x={x + (hasLeftOverlap ? overlapPx : 0)}
                    y={0}
                    width={
                      visProjWidth -
                      (hasLeftOverlap ? overlapPx : 0) -
                      (hasRightOverlap ? overlapPx : 0)
                    }
                    height={visProjHeight}
                    fill="rgba(0,128,255,0.3)"
                    stroke="#0078ff"
                    strokeWidth={2}
                  />
                  {/* Center line and position label */}
                  <line
                    x1={projCenter}
                    y1={visScreenHeight}
                    x2={projCenter}
                    y2={visScreenHeight + 10}
                    stroke="#0078ff"
                    strokeDasharray="4 2"
                  />
                  <text
                    x={projCenter}
                    y={visScreenHeight + 25}
                    fontSize="12"
                    fill="#0078ff"
                    textAnchor="middle"
                  >
                    {screenPosFt.toFixed(1)} ft
                  </text>
                </g>
              );
            })}
        </g>
      </svg>
    </div>
  );
}
