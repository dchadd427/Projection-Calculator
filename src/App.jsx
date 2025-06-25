import React, { useState, useEffect, useRef } from "react";

// Window controls for Electron (minimize, maximize, close)
function WindowControls() {
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

  // Render window control buttons
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

// Application menu bar with File/Help menus and window controls
function AppMenu({ onExit, onAbout }) {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState(null);
  const menuRef = useRef();

  // Open menu and set submenu
  const handleMenu = (menu, e) => {
    e.stopPropagation();
    setOpen(true);
    setSubmenu(menu);
  };

  // Hover to switch submenu if menu is open
  const handleMenuHover = (menu) => {
    if (open && submenu !== menu) {
      setSubmenu(menu);
    }
  };

  // Close menu on any click outside or drag
  useEffect(() => {
    if (!open) return;
    const closeListener = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setSubmenu(null);
      }
    };
    window.addEventListener("mousedown", closeListener);
    window.addEventListener("mousemove", closeListener);
    return () => {
      window.removeEventListener("mousedown", closeListener);
      window.removeEventListener("mousemove", closeListener);
    };
  }, [open]);

  // Render menu bar and dropdowns
  return (
    <div
      ref={menuRef}
      style={{
        userSelect: "none",
        marginBottom: 10,
        background: "#ececec",
        borderBottom: "1px solid #bdbdbd",
        height: 28,
        display: "flex",
        alignItems: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
        fontSize: 15,
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3000,
        boxShadow: "0 1px 2px #ddd",
        WebkitAppRegion: "drag",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          marginLeft: 8,
          WebkitAppRegion: "no-drag",
        }}
      >
        <div
          style={{
            cursor: "pointer",
            fontWeight: "normal",
            padding: "2px 16px",
            borderRadius: 2,
            background: open && submenu === "file" ? "#dbeafe" : "transparent",
            color: "#222",
            outline: "none",
          }}
          onClick={(e) => handleMenu("file", e)}
          onMouseEnter={() => handleMenuHover("file")}
          tabIndex={0}
        >
          File
        </div>
        <div
          style={{
            cursor: "pointer",
            fontWeight: "normal",
            padding: "2px 16px",
            borderRadius: 2,
            background: open && submenu === "help" ? "#dbeafe" : "transparent",
            color: "#222",
            outline: "none",
          }}
          onClick={(e) => handleMenu("help", e)}
          onMouseEnter={() => handleMenuHover("help")}
          tabIndex={0}
        >
          Help
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <WindowControls />
      {open && submenu === "file" && (
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 8,
            background: "#fff",
            border: "1px solid #bdbdbd",
            boxShadow: "0 2px 8px #bbb",
            zIndex: 100,
            minWidth: 120,
            borderRadius: 2,
            WebkitAppRegion: "no-drag",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "6px 16px",
              cursor: "pointer",
              color: "#222",
              fontFamily: "Segoe UI, Arial, sans-serif",
              fontSize: 15,
              borderBottom: "1px solid #eee",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setSubmenu(null);
              if (onExit) onExit();
            }}
          >
            Exit
          </div>
        </div>
      )}
      {open && submenu === "help" && (
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 70,
            background: "#fff",
            border: "1px solid #bdbdbd",
            boxShadow: "0 2px 8px #bbb",
            zIndex: 100,
            minWidth: 120,
            borderRadius: 2,
            WebkitAppRegion: "no-drag",
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: "6px 16px",
              cursor: "pointer",
              color: "#222",
              fontFamily: "Segoe UI, Arial, sans-serif",
              fontSize: 15,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              setSubmenu(null);
              if (onAbout) onAbout();
            }}
          >
            About
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  // State for calculator inputs and dialogs
  const [screen, setScreen] = useState({ widthFt: 45, heightFt: 15 });
  const [projector, setProjector] = useState({ width: 1920, height: 1080 });
  const [distanceFt, setDistanceFt] = useState(20);
  const [manualNumProjectors, setManualNumProjectors] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  // Calculation logic for projection and blending
  const aspect = projector.width / projector.height;
  const imageWidthFt = screen.heightFt * aspect;
  const pixelsPerFoot = projector.width / imageWidthFt;
  const totalPixelWidth = screen.widthFt * pixelsPerFoot;
  let minNumProjectors = Math.ceil(totalPixelWidth / projector.width);

  let numProjectors =
    manualNumProjectors !== "" ? Number(manualNumProjectors) : minNumProjectors;
  let totalProjectorPixels = numProjectors * projector.width;
  let blend = totalProjectorPixels - totalPixelWidth;
  let blendPerOverlap = numProjectors > 1 ? blend / (numProjectors - 1) : 0;

  // Add extra projector if blend per overlap is too small
  if (manualNumProjectors === "" && blendPerOverlap < 300) {
    numProjectors += 1;
    minNumProjectors = numProjectors;
    totalProjectorPixels = numProjectors * projector.width;
    blend = totalProjectorPixels - totalPixelWidth;
    blendPerOverlap = numProjectors > 1 ? blend / (numProjectors - 1) : 0;
  }

  // Overlap constraint
  const maxAllowedOverlap = projector.width * 0.5;
  const tooMuchOverlap = blendPerOverlap > maxAllowedOverlap;

  // Can the screen be covered?
  const canCover =
    numProjectors * projector.width >= totalPixelWidth && !tooMuchOverlap;

  // Lens ratio calculation
  const projectorImageWidthFt = imageWidthFt;
  const lensRatio = (distanceFt / projectorImageWidthFt).toFixed(2);

  // Visualization scaling
  const visScale = 20;
  const visScreenWidth = screen.widthFt * visScale;
  const visScreenHeight = screen.heightFt * visScale;
  const visProjWidth = (projector.width / pixelsPerFoot) * visScale;
  const visProjHeight = visScreenHeight;
  const overlapPx = (blendPerOverlap / pixelsPerFoot) * visScale;
  const visDistance = distanceFt * visScale;

  // Reset manualNumProjectors when relevant inputs change
  useEffect(() => {
    setManualNumProjectors("");
    // eslint-disable-next-line
  }, [screen.widthFt, screen.heightFt, projector.width, projector.height]);

  // Handler for File > Exit
  const handleExit = () => {
    if (window && window.close) {
      window.close();
    } else if (window?.electronAPI?.exitApp) {
      window.electronAPI.exitApp();
    }
  };

  // Remove browser default margins/borders
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: #fff !important;
        box-shadow: none !important;
      }
      #root {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: #fff !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Main calculator UI with 10px padding (not on menu)
  return (
    <div
      style={{
        padding: 0,
        fontFamily: "sans-serif",
        background: "#fff",
        border: "none",
        boxShadow: "none",
        margin: 0,
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <AppMenu onExit={handleExit} onAbout={() => setShowAbout(true)} />
      <div style={{ padding: 10 }}>
        {/* Calculator input fields */}
        <div>
          <label>
            Screen Width (ft):{" "}
            <input
              type="number"
              value={screen.widthFt}
              onChange={(e) =>
                setScreen({ ...screen, widthFt: +e.target.value })
              }
            />
          </label>
          <label>
            Screen Height (ft):{" "}
            <input
              type="number"
              value={screen.heightFt}
              onChange={(e) =>
                setScreen({ ...screen, heightFt: +e.target.value })
              }
            />
          </label>
        </div>
        <div>
          <label>
            Projector Resolution:
            <input
              type="number"
              value={projector.width}
              style={{ width: 70 }}
              onChange={(e) =>
                setProjector({ ...projector, width: +e.target.value })
              }
            />{" "}
            x
            <input
              type="number"
              value={projector.height}
              style={{ width: 70 }}
              onChange={(e) =>
                setProjector({ ...projector, height: +e.target.value })
              }
            />
          </label>
        </div>
        <div>
          <label>
            Projector Distance from Screen (ft):{" "}
            <input
              type="number"
              value={distanceFt}
              onChange={(e) => setDistanceFt(+e.target.value)}
              style={{ width: 70 }}
              min={1}
            />
          </label>
        </div>
        <div>
          <label>
            Number of Projectors:{" "}
            <input
              type="number"
              min={1}
              value={
                manualNumProjectors !== ""
                  ? manualNumProjectors
                  : minNumProjectors
              }
              onChange={(e) => {
                const val = e.target.value;
                setManualNumProjectors(
                  val === "" ? "" : Math.max(1, Math.floor(Number(val)))
                );
              }}
              style={{ width: 70 }}
            />
            <span style={{ marginLeft: 8, color: "#888" }}>
              (Auto minimum: {minNumProjectors})
            </span>
          </label>
        </div>
        {/* Error message if not possible */}
        {!canCover && (
          <div style={{ color: "red", fontWeight: "bold", marginTop: 10 }}>
            {numProjectors * projector.width < totalPixelWidth
              ? "Error: The selected number of projectors cannot cover the screen at the current resolution."
              : "Error: Too many projectors. Overlap between projectors cannot exceed 50% of a projector's width."}
          </div>
        )}
        {/* Show/hide calculation details */}
        <button
          style={{
            margin: "12px 0 8px 0",
            padding: "6px 18px",
            borderRadius: 4,
            border: "1px solid #888",
            background: "#f3f3f3",
            cursor: "pointer",
            fontSize: 15,
          }}
          onClick={() => setShowCalc((v) => !v)}
        >
          {showCalc ? "Hide Calculation" : "Show Calculation"}
        </button>
        {showCalc && (
          <>
            <h3>Calculation</h3>
            <ul>
              <li>Aspect Ratio: {aspect.toFixed(2)}</li>
              <li>Image Width (ft): {imageWidthFt.toFixed(2)}</li>
              <li>Pixels Per Foot: {pixelsPerFoot.toFixed(2)}</li>
              <li>
                Total Pixel Width of Screen: {totalPixelWidth.toFixed(0)} px
              </li>
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
                <b>
                  Lens Ratio Needed: {lensRatio} (Throw Distance / Image Width)
                </b>
              </li>
            </ul>
          </>
        )}
        {/* Projector visualization */}
        <h3>Projector Placement Visualization</h3>
        <div
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            background: "#eee",
            width: "100%",
            border: "none",
            boxShadow: "none",
          }}
        >
          <svg
            width={visScreenWidth + 80}
            height={visScreenHeight + visDistance + 80}
            style={{ display: "block", margin: "0 auto" }}
          >
            <g transform="translate(40,0)">
              {/* Screen */}
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
                  const projY = visScreenHeight + visDistance + 20;
                  const screenY = visScreenHeight;
                  const leftX = x;
                  const rightX = x + visProjWidth;
                  const trianglePoints = `${projCenter},${projY} ${leftX},${screenY} ${rightX},${screenY}`;

                  const hasLeftOverlap = idx > 0 && overlapPx > 0;
                  const hasRightOverlap =
                    idx < numProjectors - 1 && overlapPx > 0;

                  // Each projector covers visProjWidth on screen, convert to ft
                  const projWidthFt =
                    (visProjWidth / visScreenWidth) * screen.widthFt;
                  const lensRatioForProj = (distanceFt / projWidthFt).toFixed(
                    2
                  );

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
        {/* Visualization legend */}
        <div style={{ marginTop: 10 }}>
          <small>
            Each blue rectangle represents a projector's non-overlapped coverage
            on the screen.
            <br />
            Orange regions show the overlapped (blended) areas between
            projectors.
            <br />
            Projectors are shown below the screen. The triangle shows the throw
            area from projector to screen width.
            <br />
            The blue dashed line and label show the center position of each
            projector along the screen width.
            <br />
            Overlap is shown where rectangles intersect.
          </small>
        </div>
        {/* About dialog */}
        {showAbout && (
          <div
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.3)",
              zIndex: 200,
              border: "none",
              boxShadow: "none",
            }}
            onClick={() => setShowAbout(false)}
          >
            <div
              style={{
                background: "#fff",
                border: "none",
                borderRadius: 8,
                maxWidth: 400,
                margin: "120px auto",
                padding: 24,
                position: "relative",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>About Projection Calculator</h2>
              <p>
                Widescreen Projection Calculator
                <br />
                Version 1.0
                <br />
                <br />
                Created with Electron + React.
                <br />
                Calculates projector blending and placement for multi-projector
                setups.
              </p>
              <button
                style={{
                  marginTop: 16,
                  padding: "6px 18px",
                  borderRadius: 4,
                  border: "1px solid #888",
                  background: "#eee",
                  cursor: "pointer",
                }}
                onClick={() => setShowAbout(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
