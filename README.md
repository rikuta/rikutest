# Auto Page Loader Chrome Extension

A Chrome extension that automatically loads the next page when you scroll to the bottom, creating an infinite scroll experience on paginated websites.

## Features

- 🔄 Automatically detects and loads next page when scrolling to bottom
- 📄 Works on paginated websites (Google search, forums, blogs, etc.)
- 🎯 Smart pagination detection (supports multiple pagination patterns)
- ⚡ Simple enable/disable toggle
- 💾 Remembers your preference across page loads
- 🏷️ Clear page separators showing which page you're viewing
- 💜 Beautiful gradient UI design

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top right corner
4. Click "Load unpacked" button
5. Select the directory containing this extension
6. The Auto Page Loader icon should now appear in your Chrome toolbar

## Usage

1. Navigate to any paginated web page (e.g., Google search results, blog archives)
2. Click the Auto Page Loader extension icon in your Chrome toolbar
3. Click the "Enable" button to activate auto-pagination
4. Scroll down the page - when you reach near the bottom, the next page will automatically load
5. Continue scrolling to load more pages infinitely
6. Click "Disable" to turn off auto-pagination

### Supported Pagination Types

The extension automatically detects various pagination patterns:
- Next/Previous buttons (English, Chinese, Japanese)
- Page number links (1, 2, 3...)
- Common pagination selectors (rel="next", aria-label="Next", etc.)
- Google search pagination
- Generic "Next Page" links

## How It Works

1. When enabled, the extension monitors your scroll position
2. When you scroll within 500px of the page bottom, it searches for a "next page" link
3. It fetches the next page content via AJAX
4. The new content is appended to the current page with a clear separator
5. You can keep scrolling to load more pages seamlessly

## Files Structure

- `manifest.json` - Extension configuration (Manifest V3)
- `popup.html` - Extension popup UI
- `popup.js` - Popup functionality and toggle handling
- `content.js` - Auto-pagination engine and content loading
- `styles.css` - Popup styling
- `icons/` - Extension icons (16x16, 48x48, 128x128)

## Technical Details

- Uses Chrome Manifest V3
- Implements message passing between popup and content scripts
- Uses `chrome.storage.local` to persist enabled state
- Fetches next page content without full page reload
- Smart content detection and DOM manipulation
- Debounced scroll detection for performance

## Browser Compatibility

This extension is designed for Chrome and Chromium-based browsers (Edge, Brave, Opera, etc.) that support Manifest V3.

## Notes

- Some websites may have anti-scraping measures that prevent automatic page loading
- Dynamic websites that load content via JavaScript may require special handling
- The extension works best on traditional paginated websites with clear "next page" links
