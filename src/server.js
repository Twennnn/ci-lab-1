const express = require('express');
const app = express();
const createVisitsRouter = require('./routes/visits');

const pgConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
};
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// health endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// visits endpoint
app.use('/', createVisitsRouter(pgConfig, redisUrl));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));