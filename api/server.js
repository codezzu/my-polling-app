const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Anket oluşturma
app.post('/api/polls', async (req, res) => {
  const { question, options } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO polls (question) VALUES ($1) RETURNING id',
      [question]
    );
    const pollId = result.rows[0].id;

    const optionQueries = options.map(option =>
      pool.query('INSERT INTO options (poll_id, text) VALUES ($1, $2)', [pollId, option])
    );
    await Promise.all(optionQueries);

    res.status(201).json({ pollId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Oy verme
app.post('/api/votes', async (req, res) => {
  const { optionId } = req.body;
  const ipAddress = req.ip;

  try {
    const result = await pool.query(
      'INSERT INTO votes (option_id, ip_address) VALUES ($1, $2) ON CONFLICT (ip_address, option_id) DO NOTHING',
      [optionId, ipAddress]
    );
    
    if (result.rowCount === 0) {
      return res.status(409).json({ message: 'Bu IP adresinden zaten oy kullanıldı.' });
    }

    res.status(201).json({ message: 'Oy kullanıldı.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Veritabanı bağlantısını test etme
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
