const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// мершрут без теста покрытие <80%
app.get('/new-endpoint', (req, res) => {
  res.json({ message: 'hello' });
});

module.exports = app;