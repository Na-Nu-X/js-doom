@echo off

:: NPM Watch
start cmd /k "npm run watch"

:: SASS Watch
start cmd /k "npx sass --watch .:."

pause