import { Router } from 'express';
import OpenAI from 'openai';
const router = Router();
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
router.post('/suggest', async (req, res) => {
  const input = req.body.input || '';
  if (!client) return res.json({ ringkasanAktiviti: `Berdasarkan catatan guru, ${input} Aktiviti ini dilaksanakan secara tersusun dengan penglibatan aktif murid dan guru.`, impakProgram: 'Program ini meningkatkan disiplin, kerjasama dan kesedaran murid terhadap nilai murni yang disasarkan.', cadanganPenambahbaikan: 'Pelaksanaan akan datang boleh ditambah baik melalui perancangan masa yang lebih rapi, bahan sokongan mencukupi dan dokumentasi yang lebih menyeluruh.' });
  const response = await client.responses.create({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: `Tulis JSON rasmi Bahasa Melayu untuk laporan sekolah berdasarkan catatan ini: ${input}. Medan: ringkasanAktiviti, impakProgram, cadanganPenambahbaikan.` });
  try { res.json(JSON.parse(response.output_text)); } catch { res.json({ ringkasanAktiviti: response.output_text, impakProgram: '', cadanganPenambahbaikan: '' }); }
});
export default router;
