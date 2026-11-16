@echo off
cd /d "%~dp0"

if "%HOSTNAME%"=="" set "HOSTNAME=127.0.0.1"
if "%PORT%"=="" set "PORT=3000"
if "%SHOP_API_URL%"=="" set "SHOP_API_URL=https://api.balviofficial.com"
if "%APP_ORIGIN%"=="" set "APP_ORIGIN=https://balviofficial.com,https://balviofficial.ir"

node server.js
