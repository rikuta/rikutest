// Auto-pagination state
let isEnabled = false;
let isLoading = false;
let currentPage = 1;
let loadedPages = new Set([1]);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'enable') {
    enableAutoPagination();
    sendResponse({ success: true, enabled: true });
  } else if (request.action === 'disable') {
    disableAutoPagination();
    sendResponse({ success: true, enabled: false });
  } else if (request.action === 'getStatus') {
    sendResponse({ enabled: isEnabled, currentPage: currentPage });
  }
  return true;
});

// Load state from storage on page load
chrome.storage.local.get(['autoPaginationEnabled'], (result) => {
  if (result.autoPaginationEnabled) {
    enableAutoPagination();
  }
});

// Enable auto-pagination
function enableAutoPagination() {
  isEnabled = true;
  chrome.storage.local.set({ autoPaginationEnabled: true });
  showNotification('Auto-pagination enabled');
}

// Disable auto-pagination
function disableAutoPagination() {
  isEnabled = false;
  chrome.storage.local.set({ autoPaginationEnabled: false });
  showNotification('Auto-pagination disabled');
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-family: Arial, sans-serif;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 999999;
    animation: slideIn 0.3s ease;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Detect when user scrolls near bottom
function checkScrollPosition() {
  if (!isEnabled || isLoading) return;
  
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  
  // Trigger when user is within 500px of bottom
  if (scrollTop + clientHeight >= scrollHeight - 500) {
    loadNextPage();
  }
}

// Find next page link
function findNextPageLink() {
  // Common selectors for next page links
  const selectors = [
    'a[aria-label*="Next" i]',
    'a[title*="Next" i]',
    'a:contains("Next")',
    'a#pnnext', // Google search next
    'a.next',
    'a[rel="next"]',
    'a.pagination__next',
    'a.pager__next',
    'button[aria-label*="Next" i]',
    '[id*="next" i]:is(a, button)',
    '[class*="next" i]:is(a, button)'
  ];
  
  // Try each selector
  for (const selector of selectors) {
    try {
      const link = document.querySelector(selector);
      if (link && link.href) {
        return link.href;
      }
    } catch (e) {
      // Selector might not be valid, continue
    }
  }
  
  // Look for links with text containing "next" or page numbers
  const links = Array.from(document.querySelectorAll('a'));
  
  // Find "next" text
  const nextLink = links.find(link => {
    const text = link.textContent.toLowerCase().trim();
    return text === 'next' || text === '下一页' || text === '次へ' || text.includes('next page');
  });
  
  if (nextLink && nextLink.href) {
    return nextLink.href;
  }
  
  // Find next page number (current page + 1)
  const pageNumberLink = links.find(link => {
    const text = link.textContent.trim();
    const pageNum = parseInt(text);
    return pageNum === currentPage + 1;
  });
  
  if (pageNumberLink && pageNumberLink.href) {
    return pageNumberLink.href;
  }
  
  return null;
}

// Load next page
async function loadNextPage() {
  if (isLoading) return;
  
  const nextPageUrl = findNextPageLink();
  
  if (!nextPageUrl) {
    console.log('No next page link found');
    return;
  }
  
  // Check if we already loaded this page
  if (loadedPages.has(nextPageUrl)) {
    return;
  }
  
  isLoading = true;
  currentPage++;
  
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'auto-page-loader-indicator';
  loadingIndicator.textContent = `Loading page ${currentPage}...`;
  loadingIndicator.style.cssText = `
    position: relative;
    text-align: center;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  `;
  
  // Insert loading indicator at the end of main content
  const mainContent = document.body;
  mainContent.appendChild(loadingIndicator);
  
  try {
    // Fetch next page
    const response = await fetch(nextPageUrl);
    const html = await response.text();
    
    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find main content container (this is site-specific, using heuristics)
    const mainContentSelectors = [
      '#main',
      '#content',
      '.main',
      '.content',
      'main',
      '[role="main"]',
      '#search', // Google search results
      '.g', // Google search result items
    ];
    
    let newContent = null;
    
    // Special handling for Google search
    if (window.location.hostname.includes('google')) {
      const searchResults = doc.querySelectorAll('#search, #rso, .g');
      if (searchResults.length > 0) {
        newContent = document.createElement('div');
        searchResults.forEach(result => {
          newContent.appendChild(result.cloneNode(true));
        });
      }
    } else {
      // Try to find main content
      for (const selector of mainContentSelectors) {
        const content = doc.querySelector(selector);
        if (content) {
          newContent = content.cloneNode(true);
          break;
        }
      }
    }
    
    // If we couldn't find specific content, get the body
    if (!newContent) {
      newContent = doc.body.cloneNode(true);
    }
    
    // Remove loading indicator
    loadingIndicator.remove();
    
    // Create separator
    const separator = document.createElement('div');
    separator.style.cssText = `
      border-top: 3px solid #667eea;
      margin: 40px auto;
      max-width: 80%;
      position: relative;
    `;
    
    const pageLabel = document.createElement('div');
    pageLabel.textContent = `Page ${currentPage}`;
    pageLabel.style.cssText = `
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 5px 20px;
      border-radius: 20px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: bold;
    `;
    separator.appendChild(pageLabel);
    
    // Add separator and new content
    mainContent.appendChild(separator);
    mainContent.appendChild(newContent);
    
    // Mark page as loaded
    loadedPages.add(nextPageUrl);
    
  } catch (error) {
    console.error('Failed to load next page:', error);
    loadingIndicator.textContent = 'Failed to load next page';
    loadingIndicator.style.background = '#f56565';
    setTimeout(() => loadingIndicator.remove(), 3000);
  }
  
  isLoading = false;
}

// Set up scroll listener
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(checkScrollPosition, 200);
}, { passive: true });

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  isEnabled = false;
  isLoading = false;
});
