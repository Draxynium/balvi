@echo off
cd /d "%~dp0"

if "%HOSTNAME%"=="" set "HOSTNAME=127.0.0.1"
if "%PORT%"=="" set "PORT=3000"
if "%SHOP_API_URL%"=="" set "SHOP_API_URL=https://195.254.165.41"
if "%APP_ORIGIN%"=="" set "APP_ORIGIN=https://195.254.165.41:8843"

node server.js
