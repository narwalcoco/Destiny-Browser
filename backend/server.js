const express = require('express');
const { createBareServer } = require('@tomphttp/bare-server-node');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());
app.use(express.json());

// Create an EMPTY server (Notice 'app' is no longer inside the parentheses)
const server = http.createServer();
const bare = createBareServer('/bare/');

// Express Routes
app.get('/ping', (req, res) => {
    res.status(200).json({ status: 'online' });
});

app.post('/shutdown', (req, res) => {
    console.log("Received shutdown signal. Closing server...");
    res.status(200).send("Shutting down");
    setTimeout(() => process.exit(0), 100); // Give it 100ms to send the response before dying
});

// The Traffic Cop (Routes to Bare OR Express)
server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(3000, () => {
    console.log('Destiny Engine running on port 3000');
});