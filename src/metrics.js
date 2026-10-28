const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['status_code'],
  registers: [register],
});

function metricsMiddleware(req, res, next) {
  res.on('finish', () => {
    httpRequestsTotal.inc({ status_code: res.statusCode });
  });
  next();
}

module.exports = { register, metricsMiddleware };