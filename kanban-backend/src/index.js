import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import projKanbanBoards from './routes/projKanbanBoards.routes.js';
import { pool } from './config/database.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/dbcheck', async (_, res) => {
  try { const { rows } = await pool.query('SELECT NOW()'); res.json({ db:'ok', now: rows[0].now }); }
  catch (e) { console.error(e); res.status(500).json({ db:'error', message: e.message }); }
});

app.use('/api/ProjKanbanBoards', projKanbanBoards);

const PORT = process.env.PORT || 7260;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
