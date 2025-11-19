// Get DOM elements
const toggleBtn = document.getElementById('toggleBtn');
const statusText = document.getElementById('statusText');
const pageCount = document.getElementById('pageCount');

let isEnabled = false;

// Toggle auto-pagination
toggleBtn.addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!isEnabled) {
    // Enable auto-pagination
    chrome.tabs.sendMessage(tab.id, { 
      action: 'enable'
    }, (response) => {
      if (chrome.runtime.lastError) {
        statusText.textContent = 'Error: Please refresh the page';
        return;
      }
      
      if (response && response.success) {
        isEnabled = true;
        toggleBtn.textContent = 'Disable';
        toggleBtn.classList.remove('btn-enable');
        toggleBtn.classList.add('btn-disable');
        statusText.textContent = 'Enabled';
        statusText.style.color = '#48bb78';
      }
    });
  } else {
    // Disable auto-pagination
    chrome.tabs.sendMessage(tab.id, { 
      action: 'disable'
    }, (response) => {
      if (chrome.runtime.lastError) {
        statusText.textContent = 'Error: Please refresh the page';
        return;
      }
      
      if (response && response.success) {
        isEnabled = false;
        toggleBtn.textContent = 'Enable';
        toggleBtn.classList.remove('btn-disable');
        toggleBtn.classList.add('btn-enable');
        statusText.textContent = 'Disabled';
        statusText.style.color = '#f56565';
      }
    });
  }
});

// Check status on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not loaded yet
        return;
      }
      
      if (response) {
        isEnabled = response.enabled;
        
        if (isEnabled) {
          toggleBtn.textContent = 'Disable';
          toggleBtn.classList.remove('btn-enable');
          toggleBtn.classList.add('btn-disable');
          statusText.textContent = 'Enabled';
          statusText.style.color = '#48bb78';
        }
        
        if (response.currentPage > 1) {
          pageCount.textContent = `Page ${response.currentPage}`;
        }
      }
    });
  }
});
