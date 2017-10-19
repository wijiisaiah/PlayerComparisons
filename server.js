// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');

// Get our API routes
const riotApi = require('./server/routes/riotApi');

const app = express();

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/riotApi', riotApi);

// Catch all other routes and return the index file
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, function() {
  console.log("API running on localhost:"+port);
});
