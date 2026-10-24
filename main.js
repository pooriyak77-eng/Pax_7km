const { app, BrowserWindow, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
app.setAppUserModelId('com.local.marketalerts');
if (!app.requestSingleInstanceLock()) app.quit();
let win, tray, quitting = false;
const icon = () => nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.png'));
function createWindow() {
  win = new BrowserWindow({
    width: 1100, height: 800, title: 'زنگ بازارهای مالی', icon: icon(),
    autoHideMenuBar: true,
    webPreferences: { backgroundThrottling: false }
  });
  win.loadFile('index.html');
  win.on('close', e => { if (!quitting) { e.preventDefault(); win.hide(); } });
}
function buildMenu() {
  const login = app.getLoginItemSettings().openAtLogin;
  return Menu.buildFromTemplate([
    { label: 'نمایش', click: () => { win.show(); win.focus(); } },
    { label: 'اجرا همراه ویندوز', type: 'checkbox', checked: login,
      click: m => { app.setLoginItemSettings({ openAtLogin: m.checked }); tray.setContextMenu(buildMenu()); } },
    { type: 'separator' },
    { label: 'خروج', click: () => { quitting = true; app.quit(); } }
  ]);
}
app.whenReady().then(() => {
  createWindow();
  tray = new Tray(icon().resize({ width: 16, height: 16 }));
  tray.setToolTip('زنگ بازارهای مالی');
  tray.setContextMenu(buildMenu());
  tray.on('click', () => { win.isVisible() ? win.hide() : win.show(); });
});
app.on('second-instance', () => { if (win) { win.show(); win.focus(); } });
