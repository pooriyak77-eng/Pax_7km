# زنگ بازارهای مالی - نسخه ویندوز

## ساخت فایل exe (روی ویندوز)
1. Node.js (نسخه LTS) را از nodejs.org نصب کن.
2. در این پوشه، Command Prompt یا PowerShell باز کن و بزن:
   npm install
   npm run dist
3. فایل‌های نصب‌کننده و Portable داخل پوشه dist ساخته می‌شوند.

## فقط اجرا برای آزمایش
   npm install
   npm start

## بدون نصب Node
پوشه را در یک ریپوی GitHub آپلود کن و از تب Actions گزینه Build Windows app را اجرا کن؛ فایل exe به‌صورت artifact دانلود می‌شود.

## نکته
با بستن پنجره، برنامه در System Tray می‌ماند تا هشدارها ادامه پیدا کنند. برای خروج کامل: راست‌کلیک روی آیکون Tray و «خروج».
