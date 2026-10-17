const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
app.get('/new-endpoint', (req, res) => {
  res.json({ message: 'hello' });
});

module.exports = app;