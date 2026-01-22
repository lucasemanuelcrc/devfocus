const { app, BrowserWindow, Menu, shell, Tray, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const isDev = !app.isPackaged;

/**
 * In dev we load Next.js from localhost.
 * In preview/prod you can set ELECTRON_START_URL.
 */
const DEFAULT_DEV_URL = "http://localhost:3000";
const DEFAULT_PROD_URL = "http://localhost:3000";

// ---- Single instance (avoid opening twice) ---------------------------------
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
}

let mainWindow;
let tray;

// ---- Simple window state persistence (no extra deps) -----------------------
const stateFile = path.join(app.getPath("userData"), "window-state.json");
function readWindowState() {
  try {
    const raw = fs.readFileSync(stateFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveWindowState(win) {
  try {
    const bounds = win.getBounds();
    const state = {
      bounds,
      isMaximized: win.isMaximized(),
      isFullScreen: win.isFullScreen(),
    };
    fs.writeFileSync(stateFile, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function getStartUrl() {
  return (
    process.env.ELECTRON_START_URL ||
    (isDev ? DEFAULT_DEV_URL : DEFAULT_PROD_URL)
  );
}

function isExternalUrl(url, base) {
  try {
    const u = new URL(url);
    const b = new URL(base);
    return u.origin !== b.origin;
  } catch {
    return false;
  }
}

function broadcastWindowState() {
  if (!mainWindow) return;
  mainWindow.webContents.send("window:state-changed", {
    isMaximized: mainWindow.isMaximized(),
    isFullScreen: mainWindow.isFullScreen(),
  });
}

function createWindow() {
  const startUrl = getStartUrl();
  const saved = readWindowState();

  mainWindow = new BrowserWindow({
    width: saved?.bounds?.width ?? 1280,
    height: saved?.bounds?.height ?? 800,
    x: saved?.bounds?.x,
    y: saved?.bounds?.y,
    show: false,
    backgroundColor: "#0b0b0b",

    // Custom titlebar (app-like feel)
    frame: false,
    titleBarStyle: process.platform === "darwin" ? "hidden" : undefined,

    autoHideMenuBar: true,
    fullscreenable: true,

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Remove application menu completely
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  mainWindow.loadURL(startUrl);

  // Restore maximize/fullscreen state after ready
  mainWindow.once("ready-to-show", () => {
    if (saved?.isMaximized) mainWindow.maximize();
    mainWindow.show();
    // Fullscreen is opt-in; restore only if it was fullscreen last time
    if (saved?.isFullScreen) mainWindow.setFullScreen(true);
    broadcastWindowState();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Prevent navigation away from the app origin
  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (isExternalUrl(url, startUrl)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Persist window state
  const persist = () => saveWindowState(mainWindow);
  mainWindow.on("close", persist);
  mainWindow.on("resize", () => {
    if (!mainWindow.isMaximized() && !mainWindow.isFullScreen()) persist();
  });
  mainWindow.on("move", () => {
    if (!mainWindow.isMaximized() && !mainWindow.isFullScreen()) persist();
  });

  // Broadcast state changes to renderer UI (for button icons)
  mainWindow.on("maximize", broadcastWindowState);
  mainWindow.on("unmaximize", broadcastWindowState);
  mainWindow.on("enter-full-screen", broadcastWindowState);
  mainWindow.on("leave-full-screen", broadcastWindowState);

  if (isDev) mainWindow.webContents.openDevTools({ mode: "detach" });
}

function createTray() {
  // Small tray menu for "real app" feel (optional, lightweight)
  try {
    const iconPath = path.join(__dirname, "assets", "app.png");
    tray = new Tray(iconPath);
    tray.setToolTip("FOCUS");

    tray.on("click", () => {
      if (!mainWindow) return;
      if (mainWindow.isVisible()) mainWindow.hide();
      else {
        mainWindow.show();
        mainWindow.focus();
      }
    });

    const { Menu: ElectronMenu } = require("electron");
    const ctx = ElectronMenu.buildFromTemplate([
      {
        label: "Mostrar/Ocultar",
        click: () => {
          if (!mainWindow) return;
          if (mainWindow.isVisible()) mainWindow.hide();
          else {
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      {
        label: "Alternar Fullscreen",
        click: () => {
          if (!mainWindow) return;
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
      { type: "separator" },
      {
        label: "Sair",
        click: () => app.quit(),
      },
    ]);

    tray.setContextMenu(ctx);
  } catch {
    // ignore tray errors (e.g., missing icon in some environments)
  }
}

// ---- IPC (window controls from renderer) -----------------------------------
ipcMain.handle("window:minimize", () => mainWindow?.minimize());
ipcMain.handle("window:toggle-maximize", () => {
  if (!mainWindow) return;
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
  broadcastWindowState();
});
ipcMain.handle("window:close", () => mainWindow?.close());
ipcMain.handle("window:toggle-fullscreen", () => {
  if (!mainWindow) return;
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
  broadcastWindowState();
});
ipcMain.handle("window:get-state", () => ({
  isMaximized: !!mainWindow?.isMaximized(),
  isFullScreen: !!mainWindow?.isFullScreen(),
}));

// ---- App lifecycle ---------------------------------------------------------
app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("second-instance", () => {
  // Someone tried to run a second instance; focus the existing window.
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
