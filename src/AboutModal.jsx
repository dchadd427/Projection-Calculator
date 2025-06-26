// AboutModal: Modal dialog with app info
export default function AboutModal({ onClose }) {
  return (
    <div className="about-modal" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
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
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
