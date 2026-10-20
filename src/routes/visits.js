const express = require('express');
const { Pool } = require('pg');
const { createClient } = require('redis');

function createVisitsRouter(pgConfig, redisUrl) {
    const router = express.Router();
    const pool = new Pool(pgConfig);
    const redisClient = createClient({ url: redisUrl });

    router.get('/visits', async (req, res) => {
        try {
            await redisClient.connect().catch(() => {});
            const cached = await redisClient.get('visits_count');
            if (cached) {
                return res.json({ count: parseInt(cached, 10), source: 'cache' });
            }

            const client = await pool.connect();
            const cur = await client.query("INSERT INTO visits (created_at) VALUES (NOW()) RETURNING id");
            const newId = cur.rows[0].id;
            const countRes = await client.query("SELECT COUNT(*) FROM visits");
            const count = parseInt(countRes.rows[0].count, 10);
            client.release();

            await redisClient.set('visits_count', count, { EX: 10 });
            return res.json({ count: count, source: 'db', lastId: newId });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    });

    router.close = async () => {
        await redisClient.disconnect();
        await pool.end();
    };

    return router;
}

module.exports = createVisitsRouter;