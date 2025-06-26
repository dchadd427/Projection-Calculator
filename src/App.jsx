import React, { useState, useRef, useEffect } from "react";
import AppMenu from "./AppMenu";
import CalculatorForm from "./CalculatorForm";
import ProjectorError from "./ProjectorError";
import CalculationDetails from "./CalculationDetails";
import ProjectorVisualization from "./ProjectorVisualization";
import AboutModal from "./AboutModal";
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

  // Pan state for visualization
  const [pan, setPan] = useState({ x: 0, y: 0 });

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

  // Visualization dimensions (do NOT multiply by zoom)
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
        <div className="main-row">
          <div className="main-form-col">
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
          </div>
          <div className="main-calc-col">
            <div className="calc-scrollbox">
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
            </div>
          </div>
        </div>
        <div className="vis-container" ref={svgContainerRef}>
          <div className="vis-svg-div">
            <ProjectorVisualization
              visScale={visScale}
              visScreenWidth={visScreenWidth}
              visScreenHeight={visScreenHeight}
              visProjWidth={visProjWidth}
              visProjHeight={visProjHeight}
              visDistance={visDistance}
              visPadding={visPadding}
              pan={pan}
              setPan={setPan}
              screen={screen}
              projector={projector}
              canCover={canCover}
              numProjectors={numProjectors}
              overlapPx={overlapPx}
              blendPerOverlap={blendPerOverlap}
              distanceFt={distanceFt}
            />
          </div>
        </div>
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      </div>
    </div>
  );
}
