const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
app.setAppUserModelId('com.local.marketalerts');
if (!app.requestSingleInstanceLock()) app.quit();
let win, tray, quitting = false;
const icon = () => nativeImage.createFromPath(path.join(__dirname, 'build', 'icon.png'));
function createWindow() {
  win = new BrowserWindow({
    width: 1100, height: 800, title: 'زنگ بازارهای مالی', icon: icon(),
    autoHideMenuBar: true,
    webPreferences: { backgroundThrottling: false, preload: path.join(__dirname, 'preload.js') }
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

ipcMain.handle('quotes', async (_e, syms) => {
  const out = {};
  await Promise.all((Array.isArray(syms) ? syms : []).slice(0, 50).map(async (s) => {
    try {
      const r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/' + encodeURIComponent(s) + '?range=1d&interval=1d', { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) return;
      const j = await r.json();
      const m = j.chart.result[0].meta;
      const price = m.regularMarketPrice;
      const prev = m.chartPreviousClose != null ? m.chartPreviousClose : m.previousClose;
      if (price && prev) out[s] = { price, prev, hi: m.regularMarketDayHigh, lo: m.regularMarketDayLow };
    } catch (e) {}
  }));
  return out;
});
