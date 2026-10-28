const express = require('express');
const { register, metricsMiddleware } = require('./metrics');
const app = express();

app.use(metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.get('/health', (req, res) => {
  if (process.env.CHAOS_MODE === 'true' && Math.random() < 0.3) {
    return res.status(500).json({ status: 'error' });
  }
  res.status(200).json({ status: 'ok' });
});

module.exports = app;