# Auto Scroll Chrome Extension

A simple Chrome extension that enables auto-scrolling on web pages with easy start/stop control.

## Features

- 🚀 Auto-scroll any web page with customizable speed
- ⏯️ Easy start/stop controls via popup interface
- 🎚️ Adjustable scroll speed (1-10)
- 🛑 Automatic stop when reaching the bottom of the page
- 🖱️ Manual scroll or keyboard interaction automatically stops auto-scrolling
- 💜 Beautiful gradient UI design

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked" button
5. Select the directory containing this extension
6. The Auto Scroll icon should now appear in your Chrome toolbar

## Usage

1. Navigate to any web page you want to auto-scroll
2. Click the Auto Scroll extension icon in your Chrome toolbar
3. Adjust the speed slider to your preference (1 = slowest, 10 = fastest)
4. Click "Start Scrolling" to begin auto-scrolling
5. Click "Stop Scrolling" to stop at any time
6. The extension will automatically stop when:
   - You reach the bottom of the page
   - You manually scroll with your mouse wheel
   - You use keyboard navigation (arrow keys, space, etc.)

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality and message handling
- `content.js` - Content script for auto-scrolling functionality
- `styles.css` - Popup styling
- `icons/` - Extension icons (16x16, 48x48, 128x128)

## Technical Details

- Uses Chrome Manifest V3
- Implements message passing between popup and content scripts
- Smooth scrolling with configurable speed
- Automatic cleanup on page navigation

## Browser Compatibility

This extension is designed for Chrome and Chromium-based browsers (Edge, Brave, Opera, etc.) that support Manifest V3.
