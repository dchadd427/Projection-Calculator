const { contextBridge, ipcRenderer } = require("electron");

// Use contextBridge only if running in Electron, otherwise do nothing (for Vite dev server)
if (
  typeof contextBridge !== "undefined" &&
  typeof ipcRenderer !== "undefined"
) {
  contextBridge.exposeInMainWorld("electronAPI", {
    minimize: () => ipcRenderer.send("window-minimize"),
    maximize: () => ipcRenderer.send("window-maximize"),
    close: () => ipcRenderer.send("window-close"),
    exitApp: () => ipcRenderer.send("window-close"),
  });
}
