// focus/electron/main.js
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require("electron");
const path = require("path");

const isDev = !app.isPackaged;

let mainWindow;

const APP_URL_PROD = "https://devfocus-seven.vercel.app";
const APP_URL_DEV = "http://localhost:3000";

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://devfocus-seven.vercel.app",
]);

function toggleFullScreen() {
  if (!mainWindow) return;
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    fullscreenable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Remove menu por completo
  Menu.setApplicationMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  // Abre o app (DEV = localhost, PROD = Vercel)
  const startUrl = isDev ? APP_URL_DEV : APP_URL_PROD;
  mainWindow.loadURL(startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Segurança: abre links externos no navegador padrão
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const origin = new URL(url).origin;
      if (!allowedOrigins.has(origin)) shell.openExternal(url);
    } catch {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    try {
      const origin = new URL(url).origin;
      if (!allowedOrigins.has(origin)) {
        event.preventDefault();
        shell.openExternal(url);
      }
    } catch {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  if (isDev) mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  // Atalhos
  globalShortcut.register("F11", () => toggleFullScreen());
  globalShortcut.register("CommandOrControl+Shift+F", () => toggleFullScreen());
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC: permite controlar janela pelo Next (botões)
ipcMain.handle("window:toggle-fullscreen", () => toggleFullScreen());
ipcMain.handle("window:minimize", () => mainWindow?.minimize());
ipcMain.handle("window:maximize", () => {
  if (!mainWindow) return;
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});
ipcMain.handle("window:close", () => mainWindow?.close());
