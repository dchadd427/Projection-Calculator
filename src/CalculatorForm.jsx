import React from "react";

// CalculatorForm: Handles all user input for screen and projector settings
export default function CalculatorForm({
  screen,
  setScreen,
  projector,
  setProjector,
  distanceFt,
  setDistanceFt,
  manualNumProjectors,
  setManualNumProjectors,
  minNumProjectors,
}) {
  return (
    <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
      <div className="calc-form-row">
        <label>
          <span className="calc-label">Screen Width (ft):</span>
          <input
            type="number"
            value={screen.widthFt}
            onChange={(e) => setScreen({ ...screen, widthFt: +e.target.value })}
          />
        </label>
        <label>
          <span className="calc-label">Screen Height (ft):</span>
          <input
            type="number"
            value={screen.heightFt}
            onChange={(e) =>
              setScreen({ ...screen, heightFt: +e.target.value })
            }
          />
        </label>
      </div>
      <div className="calc-form-row">
        <label>
          <span className="calc-label">Projector Resolution:</span>
          <div className="calc-proj-res">
            <input
              type="number"
              value={projector.width}
              onChange={(e) =>
                setProjector({ ...projector, width: +e.target.value })
              }
            />
            <span className="calc-proj-x">x</span>
            <input
              type="number"
              value={projector.height}
              onChange={(e) =>
                setProjector({ ...projector, height: +e.target.value })
              }
            />
          </div>
        </label>
        <label>
          <span className="calc-label">
            Projector Distance from Screen (ft):
          </span>
          <input
            type="number"
            value={distanceFt}
            onChange={(e) => setDistanceFt(+e.target.value)}
            min={1}
          />
        </label>
      </div>
      <div className="calc-form-row align-center">
        <label>
          <span className="calc-label">Number of Projectors:</span>
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
          />
        </label>
        <span className="calc-auto-min">
          (Auto minimum: {minNumProjectors})
        </span>
      </div>
    </form>
  );
}
