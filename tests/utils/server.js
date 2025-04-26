const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '../../')));

// Start the server
const server = app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});

module.exports = server;
