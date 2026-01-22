// Keep this file minimal and secure.
// Expose ONLY the APIs your UI needs.
const { contextBridge, ipcRenderer } = require("electron");

/**
 * Renderer bridge.
 * Use this from the Next.js UI as: window.desktop.window.*
 */
contextBridge.exposeInMainWorld("desktop", {
  isElectron: true,
  platform: process.platform,
  window: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    toggleMaximize: () => ipcRenderer.invoke("window:toggle-maximize"),
    close: () => ipcRenderer.invoke("window:close"),
    toggleFullscreen: () => ipcRenderer.invoke("window:toggle-fullscreen"),
    getState: () => ipcRenderer.invoke("window:get-state"),
    /**
     * Subscribe to window-state changes.
     * Returns an unsubscribe function.
     */
    onStateChanged: (callback) => {
      const handler = (_event, state) => callback(state);
      ipcRenderer.on("window:state-changed", handler);
      return () => ipcRenderer.removeListener("window:state-changed", handler);
    },
  },
});
