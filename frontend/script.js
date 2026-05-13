// Initialize Lucide Icons
lucide.createIcons();

// --- Elements ---
const addressBar = document.getElementById('address-bar');
const iframe = document.getElementById('browser-view');
const bootloader = document.getElementById('bootloader');
const newTabPage = document.getElementById('new-tab-page');
const ntpInput = document.getElementById('ntp-input');

// CONFIG: Keep your codespace URL here
const BACKEND_URL = 'https://redesigned-waffle-q79rg4445g4924x96-3000.app.github.dev';

// --- Bootloader Logic ---
async function wakeServer() {
    try {
        const response = await fetch(`${BACKEND_URL}/ping`);
        if (response.ok) {
            bootloader.style.opacity = '0';
            setTimeout(() => bootloader.style.display = 'none', 500);
        }
    } catch (e) {
        console.log("Waiting for engine...");
        setTimeout(wakeServer, 2000);
    }
}

// --- Navigation Logic ---
function loadURL(inputStr) {
    let url = inputStr.trim();
    if (!url.includes('.')) {
        url = `https://www.google.com/search?q=${url}`;
    } else if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    // Sync the top address bar with what was searched
    addressBar.value = url;

    // Hide New Tab, Show Iframe
    newTabPage.style.display = 'none';
    iframe.style.display = 'block';

    // Load the URL
    iframe.src = url;
}

// Top Address Bar Listener
addressBar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadURL(addressBar.value);
});

// Center New Tab Search Listener
ntpInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadURL(ntpInput.value);
});

// --- Guard Dog ---
window.addEventListener('beforeunload', (event) => {
    navigator.sendBeacon(`${BACKEND_URL}/shutdown`);
    event.preventDefault();
    event.returnValue = '';
});

// Initialize
wakeServer();
