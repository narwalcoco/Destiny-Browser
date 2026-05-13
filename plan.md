Destiny Browser Technical Specification
1. Project Overview
Destiny Browser is a high-performance web-based browser emulator designed for Chromebooks. It utilizes a Client-Side Service Worker Proxy to bypass network restrictions. It features a custom "Destiny" UI (The Shell) inspired by modern Chromium aesthetics and a remote Node.js backend (The Engine) to tunnel traffic securely.

2. Technology Stack
Frontend (Repo 1): HTML5, CSS3, JavaScript (ES6+). Hosted on GitHub Pages.

Backend (Repo 2): Node.js, Express, @mercuryworkshop/bare-server-node (or Wisp). Hosted on Render/Koyeb.

Proxy Protocol: Ultraviolet (UV) or Scramjet using the Wisp Protocol (WebSocket-based) for high-speed data transfer.

3. Phase 1: The Engine (Backend - Repo 2)
Goal: Create a stealthy middleman server to fetch and rewrite web content.

Requirements:

Initialize a Node.js project with express and a Bare server.

Health Check: Implement a GET /ping route that returns 200 OK (used by the bootloader).

Power-Save Shutdown: Implement a POST /shutdown route. When triggered, the server must execute process.exit(0) to stop the instance immediately.

Environment: Must support WebSockets for the Wisp transport.

4. Phase 2: The Shell (Frontend - Repo 1)
Goal: Build the visual interface based on the "Destiny" design language.

4.1 UI Layout & Styling
Sleek Tabs: Implement a Tab Bar using display: flex. Tabs must use a "Trapezoid" shape.

CSS Tip: Use clip-path: polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%); or an SVG mask.

Address Bar: A custom input field that handles URL encoding. If input is not a valid URL, it should redirect to a search query (e.g., Google/DuckDuckGo).

Settings Persistence: * Store destiny_settings in localStorage.

Fields: bg_url, search_visible (bool), title_visible (bool).

Function applyTheme() must run immediately on page load to prevent "flash of unstyled content."

4.2 The Bootloader (Waking the Server)
Overlay: A full-screen z-index: 9999 div with a rotating SVG loader and a progress bar.

Wake Logic: * On load, start a setInterval to fetch the Backend's /ping endpoint.

Increment the progress bar visually while waiting.

Once the server responds, animate the overlay's opacity to 0 and enable the browser UI.

5. Phase 3: Proxy Logic (Service Workers)
Goal: Intercept and tunnel all traffic within the <iframe>.

Implementation:

Register the sw.js (Service Worker) from the Ultraviolet/Scramjet library.

Transport Configuration: Point the proxy's Bare transport to the Repo 2 URL using the Wisp protocol (wss://...).

Dynamic Rewriting: Ensure the service worker handles Media Source Extensions (MSE) to allow YouTube video streaming and sidebar recommendations to load correctly.

6. Phase 4: The "Guard Dog" (Auto-Shutdown)
Goal: Ensure the backend turns off when the user leaves the site.

Interception: Use window.addEventListener('beforeunload').

Logic:

Set event.preventDefault() to trigger the browser's "Leave site?" confirmation dialog.

The Shutdown Signal: Use navigator.sendBeacon('https://backend-url.com/shutdown'). This ensures the POST request reaches the server even after the tab is closed.

Variable check: Only show the "Leave" warning if the server is currently confirmed "Active."

7. Implementation Checklist
[ ] Repo 2: Deploy Node.js server to Render/Koyeb; test /ping and /shutdown.

[ ] Repo 1 (HTML/CSS): Build the tab system and address bar UI.

[ ] Repo 1 (JS): Setup localStorage for background and search bar toggles.

[ ] Repo 1 (Logic): Integrate the UV Service Worker and connect to Backend.

[ ] Final: Add the Bootloader overlay and the sendBeacon shutdown logic.

Final Advice for Success
Testing: Test the proxy with a "Public Bare Server" first to ensure your CSS/UI works before troubleshooting your own Backend.

YouTube: If the video buffers, check your Backend's RAM usage. Free tiers usually give you 512MB—keep your tab count low.

Theme: Use CSS variables (e.g., --tab-color: #202124;) to make it easy to change the "Destiny" theme colors later.