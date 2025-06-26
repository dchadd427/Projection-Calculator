import React, { useState, useRef, useEffect } from "react";
import AppMenu from "./AppMenu";
import CalculatorForm from "./CalculatorForm";
import ProjectorError from "./ProjectorError";
import CalculationDetails from "./CalculationDetails";
import ProjectorVisualization from "./ProjectorVisualization";
import VisualizationLegend from "./VisualizationLegend";
import AboutModal from "./AboutModal";
import ZoomBar from "./ZoomBar";
import "./App.css";

// Main App: Handles state, calculation, and layout for the projection calculator
export default function App() {
  // State for calculator inputs and dialogs
  const [screen, setScreen] = useState({ widthFt: 45, heightFt: 15 });
  const [projector, setProjector] = useState({ width: 1920, height: 1080 });
  const [distanceFt, setDistanceFt] = useState(20);
  const [manualNumProjectors, setManualNumProjectors] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [showCalc, setShowCalc] = useState(false);

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const minZoom = 0.5;
  const maxZoom = 2;

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
  const fullAspectRatio = (totalProjectorPixels - blend) / projector.height;

  // Visualization scaling: fit entire visualization (screen + projector area) vertically
  const svgContainerRef = useRef();
  const visMinScale = 5;
  const visMaxScale = 80;
  const [visScale, setVisScale] = useState(null);

  // Compute total visualization height: screen + projector area + padding
  const projectorAreaFt = distanceFt + 2; // 2ft padding below projectors
  const totalVisHeightFt = screen.heightFt + projectorAreaFt;

  // Fit visualization vertically on mount and when container/screen changes
  useEffect(() => {
    if (!svgContainerRef.current) return;
    const container = svgContainerRef.current;
    function fitVertically() {
      const containerHeight = container.offsetHeight || 690;
      if (totalVisHeightFt > 0) {
        const fitScale = Math.max(
          visMinScale,
          Math.min(visMaxScale, containerHeight / totalVisHeightFt)
        );
        setVisScale(fitScale);
      } else {
        setVisScale(20);
      }
    }
    fitVertically();
    const resizeObserver = new window.ResizeObserver(fitVertically);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [screen.heightFt, distanceFt, visMinScale, visMaxScale]);

  // Visualization dimensions
  const visScreenWidth = visScale ? screen.widthFt * visScale : 0;
  const visScreenHeight = visScale ? screen.heightFt * visScale : 0;
  const visProjWidth = visScale
    ? (projector.width / pixelsPerFoot) * visScale
    : 0;
  const visProjHeight = visScreenHeight;
  const overlapPx = visScale ? (blendPerOverlap / pixelsPerFoot) * visScale : 0;
  const visDistance = visScale ? distanceFt * visScale : 0;
  const visPadding = visScale ? 2 * visScale : 0; // 2ft padding below projectors

  // Reset manualNumProjectors when relevant inputs change
  useEffect(() => {
    setManualNumProjectors("");
  }, [screen.widthFt, screen.heightFt, projector.width, projector.height]);

  // Handle zoom slider
  const handleZoomChange = (value) => {
    setZoom(Number(value));
  };

  // Handle mouse wheel zoom
  useEffect(() => {
    const handleWheel = (e) => {
      if (
        !svgContainerRef.current ||
        !svgContainerRef.current.contains(e.target)
      )
        return;
      if (e.ctrlKey) return; // Let browser zoom with ctrl+wheel
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.05 : -0.05;
      setZoom((z) =>
        Math.min(maxZoom, Math.max(minZoom, +(z + delta).toFixed(2)))
      );
    };
    const container = svgContainerRef.current;
    if (container)
      container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      if (container) container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Handler for File > Exit
  const handleExit = () => {
    if (window && window.close) {
      window.close();
    } else if (window?.electronAPI?.exitApp) {
      window.electronAPI.exitApp();
    }
  };

  // Main calculator UI layout (no zoom/pan)
  return (
    <div className="app-root">
      <AppMenu onExit={handleExit} onAbout={() => setShowAbout(true)} />
      <div className="app-main">
        <CalculatorForm
          screen={screen}
          setScreen={setScreen}
          projector={projector}
          setProjector={setProjector}
          distanceFt={distanceFt}
          setDistanceFt={setDistanceFt}
          manualNumProjectors={manualNumProjectors}
          setManualNumProjectors={setManualNumProjectors}
          minNumProjectors={minNumProjectors}
        />
        {!canCover && (
          <ProjectorError
            numProjectors={numProjectors}
            projector={projector}
            totalPixelWidth={totalPixelWidth}
            tooMuchOverlap={tooMuchOverlap}
          />
        )}
        <button
          className="toggle-calc-btn"
          onClick={() => setShowCalc((v) => !v)}
        >
          {showCalc ? "Hide Calculation" : "Show Calculation"}
        </button>
        {showCalc && (
          <CalculationDetails
            aspect={aspect}
            imageWidthFt={imageWidthFt}
            pixelsPerFoot={pixelsPerFoot}
            totalPixelWidth={totalPixelWidth}
            minNumProjectors={minNumProjectors}
            totalProjectorPixels={totalProjectorPixels}
            blend={blend}
            blendPerOverlap={blendPerOverlap}
            projector={projector}
            fullAspectRatio={fullAspectRatio}
            lensRatio={lensRatio}
          />
        )}
        <h3 className="vis-title">Projector Placement Visualization</h3>
        <div className="vis-container" ref={svgContainerRef}>
          <div className="vis-svg-div">
            <ProjectorVisualization
              visScale={visScale * zoom}
              visScreenWidth={visScreenWidth * zoom}
              visScreenHeight={visScreenHeight * zoom}
              visProjWidth={visProjWidth * zoom}
              visProjHeight={visProjHeight * zoom}
              visDistance={visDistance * zoom}
              visPadding={visPadding * zoom}
              pan={{ x: 0, y: 0 }}
              screen={screen}
              projector={projector}
              canCover={canCover}
              numProjectors={numProjectors}
              overlapPx={overlapPx * zoom}
              blendPerOverlap={blendPerOverlap}
              distanceFt={distanceFt}
            />
            <ZoomBar
              zoom={zoom}
              minZoom={minZoom}
              maxZoom={maxZoom}
              onZoomChange={handleZoomChange}
            />
          </div>
        </div>
        <VisualizationLegend />
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      </div>
    </div>
  );
}
