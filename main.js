const { app, BrowserWindow, shell, session, systemPreferences, desktopCapturer } = require("electron");
const path = require("path");

const APP_URL = "https://tarantula-ashen.vercel.app/";

async function requestMacPermissions() {
  if (process.platform !== "darwin") return;
  // Ask for microphone access — screen recording must be granted via System Preferences
  await systemPreferences.askForMediaAccess("microphone");
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 18 },
    backgroundColor: "#F2F2F2",
    vibrancy: null,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    show: false,
  });

  // Grant media permissions (mic, camera, screen) when the web app requests them
  session.defaultSession.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      const allowed = [
        "media",
        "display-capture",
        "mediaKeySystem",
        "geolocation",
      ];
      callback(allowed.includes(permission));
    }
  );

  // Handle getDisplayMedia — must supply a real DesktopCapturerSource for video.
  // audio: "loopback" captures system audio on macOS.
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width: 0, height: 0 },
      });
      if (sources.length === 0) {
        callback({});
        return;
      }
      callback({ video: sources[0], audio: "loopback" });
    } catch (err) {
      console.error("setDisplayMediaRequestHandler error:", err);
      callback({});
    }
  });

  win.loadURL(APP_URL);

  win.once("ready-to-show", () => win.show());

  // Open all external links in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith(APP_URL)) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(async () => {
  await requestMacPermissions();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
