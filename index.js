// 1) Import the express library (we installed it with npm)
const express = require('express');

// 2) Create an express application
const app = express();

// 3) Choose a port number for your local server
const PORT = 3000;

// 4) A test route so we can see something in the browser
app.get('/', (req, res) => {
  res.send('Hello, URL Shortener!');
});

// 5) Start the server (begin listening for requests)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
