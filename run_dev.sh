#!/bin/bash

# NPM Watch
gnome-terminal -- bash -c "npm run watch; exec bash"

# SASS Watch
gnome-terminal -- bash -c "npx sass --watch .:.; exec bash"