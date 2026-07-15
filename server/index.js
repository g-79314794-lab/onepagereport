import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import reports from './routes/reports.js';
import exportRoutes from './routes/export.js';
import ai from './routes/ai.js';
import uploads from './routes/uploads.js';
import integrations from './routes/integrations.js';
import share from './routes/share.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/api/reports', reports);
app.use('/api/export', exportRoutes);
app.use('/api/ai', ai);
app.use('/api/uploads', uploads);
app.use('/api/integrations', integrations);
app.use('/api/share', share);
app.get('/api/health', (_, res) => res.json({ status: 'ok', nama: 'Sistem Laporan Satu Muka Sekolah' }));

if (process.env.MONGODB_URI) await mongoose.connect(process.env.MONGODB_URI);
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Pelayan berjalan pada port ${port}`));
