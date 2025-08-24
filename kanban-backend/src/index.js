import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { pool } from './config/database.js';

const app = express();
// initialize middlewaresimport { pool } from './config/database.js';

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// initialize routes
app.get('/api/health', (_, res) => res.json({ ok: true }));

// new route to check database connection
app.get('/api/dbcheck', async (_, res) => {
    try {
      const { rows } = await pool.query('SELECT NOW()');
      res.json({ db: 'ok', now: rows[0].now });
    } catch (err) {
      console.error(err);
      res.status(500).json({ db: 'error', message: err.message });
    }
  });
const PORT = process.env.PORT || 7260;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
