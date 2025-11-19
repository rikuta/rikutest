// Auto-scroll state
let scrollInterval = null;
let isScrolling = false;
let scrollSpeed = 3;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startScroll') {
    startScrolling(request.speed);
    sendResponse({ success: true });
  } else if (request.action === 'stopScroll') {
    stopScrolling();
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    sendResponse({ isScrolling: isScrolling });
  }
  return true; // Keep message channel open for async response
});

// Start auto-scrolling
function startScrolling(speed) {
  if (scrollInterval) {
    clearInterval(scrollInterval);
  }
  
  scrollSpeed = speed;
  isScrolling = true;
  
  // Scroll at interval based on speed
  // Lower speed value = slower scrolling (higher interval)
  // Higher speed value = faster scrolling (lower interval)
  const intervalTime = 100; // Base interval in ms
  const pixelsPerScroll = speed; // Pixels to scroll each interval
  
  scrollInterval = setInterval(() => {
    // Scroll down by specified pixels
    window.scrollBy({
      top: pixelsPerScroll,
      behavior: 'instant' // Use instant instead of smooth for consistent speed
    });
    
    // Check if we've reached the bottom of the page
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    
    // If at bottom, stop scrolling
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      stopScrolling();
    }
  }, intervalTime);
}

// Stop auto-scrolling
function stopScrolling() {
  if (scrollInterval) {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }
  isScrolling = false;
}

// Stop scrolling when user manually scrolls or interacts
let userScrollTimer;
window.addEventListener('wheel', () => {
  if (isScrolling) {
    stopScrolling();
  }
}, { passive: true });

window.addEventListener('keydown', (e) => {
  // Stop on arrow keys, space, page up/down, home, end
  const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
  if (scrollKeys.includes(e.key) && isScrolling) {
    stopScrolling();
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  stopScrolling();
});
