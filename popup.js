// Get DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const statusText = document.getElementById('statusText');

// Update speed display
speedInput.addEventListener('input', () => {
  speedValue.textContent = speedInput.value;
});

// Start scrolling
startBtn.addEventListener('click', async () => {
  const speed = parseInt(speedInput.value);
  
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Send message to content script to start scrolling
  chrome.tabs.sendMessage(tab.id, { 
    action: 'startScroll', 
    speed: speed 
  }, (response) => {
    if (chrome.runtime.lastError) {
      statusText.textContent = 'Error: Please refresh the page';
      return;
    }
    
    if (response && response.success) {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      statusText.textContent = 'Scrolling...';
    }
  });
});

// Stop scrolling
stopBtn.addEventListener('click', async () => {
  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Send message to content script to stop scrolling
  chrome.tabs.sendMessage(tab.id, { 
    action: 'stopScroll' 
  }, (response) => {
    if (chrome.runtime.lastError) {
      statusText.textContent = 'Error: Please refresh the page';
      return;
    }
    
    if (response && response.success) {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      statusText.textContent = 'Idle';
    }
  });
});

// Check scroll status on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getStatus' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not loaded yet
        return;
      }
      
      if (response && response.isScrolling) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusText.textContent = 'Scrolling...';
      }
    });
  }
});
