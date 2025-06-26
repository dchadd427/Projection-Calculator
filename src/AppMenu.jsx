import React, { useState, useRef, useEffect } from "react";
import WindowControls from "./WindowControls";
import "./App.css"; // Import the CSS file

// Application menu bar with File/View/Help menus and window controls
export default function AppMenu({ onExit, onAbout }) {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState(null);
  const menuRef = useRef();

  // Open menu and set submenu, or close if already open
  const handleMenu = (menu, e) => {
    e.stopPropagation();
    if (open && submenu === menu) {
      setOpen(false);
      setSubmenu(null);
    } else {
      setOpen(true);
      setSubmenu(menu);
    }
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
      className="menu-bar"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Draggable region for Electron window (does not overlap controls) */}
      <div className="menu-drag-region" />
      {/* App icon */}
      <img
        src={"assets/icon.png"}
        alt="App Icon"
        className="menu-app-icon"
        draggable={false}
      />
      <div className="menu-list">
        {/* File menu */}
        <div
          className={`menu-item${
            open && submenu === "file" ? " menu-item-active" : ""
          }`}
          onClick={(e) => handleMenu("file", e)}
          onMouseEnter={() => handleMenuHover("file")}
          tabIndex={0}
        >
          File
          {open && submenu === "file" && (
            <div
              className="menu-dropdown"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                className="menu-dropdown-item menu-dropdown-exit"
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
        </div>
        {/* View menu */}
        <div
          className={`menu-item${
            open && submenu === "view" ? " menu-item-active" : ""
          }`}
          onClick={(e) => handleMenu("view", e)}
          onMouseEnter={() => handleMenuHover("view")}
          tabIndex={0}
        >
          View
          {open && submenu === "view" && (
            <div
              className="menu-dropdown"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                className="menu-dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setSubmenu(null);
                  window.location.reload();
                }}
              >
                Refresh
              </div>
              <div
                className="menu-dropdown-item"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setSubmenu(null);
                  // Use Electron IPC if available
                  if (window?.electronAPI?.openDevTools) {
                    window.electronAPI.openDevTools();
                  } else if (window?.ipcRenderer) {
                    // Some Electron setups expose ipcRenderer directly
                    window.ipcRenderer.send("open-devtools");
                  } else if (window?.require) {
                    // Fallback for Electron with nodeIntegration
                    try {
                      const { remote } = window.require("electron");
                      remote.getCurrentWindow().webContents.openDevTools();
                    } catch {}
                  } else {
                    alert("Developer Tools not available in this environment.");
                  }
                }}
              >
                Developer Tools
              </div>
            </div>
          )}
        </div>
        {/* Help menu */}
        <div
          className={`menu-item${
            open && submenu === "help" ? " menu-item-active" : ""
          }`}
          onClick={(e) => handleMenu("help", e)}
          onMouseEnter={() => handleMenuHover("help")}
          tabIndex={0}
        >
          Help
          {open && submenu === "help" && (
            <div
              className="menu-dropdown"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div
                className="menu-dropdown-item"
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
      </div>
      <div className="menu-spacer" />
      <WindowControls />
    </div>
  );
}
