import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();
// initialize middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 7260;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
