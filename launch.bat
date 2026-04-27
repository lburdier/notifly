@echo off
title Notifly — Creative Media OS
cd /d "%~dp0"

echo.
echo  +-----------------------------------------+
echo  ^|  NOTIFLY  ^|  Creative Media OS  ^|  v0.1  ^|
echo  +-----------------------------------------+
echo.
echo  Starting dev server...
echo.

start "" "http://localhost:5173"
npm run dev
