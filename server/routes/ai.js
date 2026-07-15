import { Router } from 'express';
import OpenAI from 'openai';
const router = Router();
const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
router.post('/suggest', async (req, res) => {
  const input = req.body.input || '';
  const mode = req.body.mode || 'jana';
  if (!client) return res.json(fallback(input, mode));
  const response = await client.responses.create({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', input: `Anda pembantu penulisan laporan sekolah KPM. Mod: ${mode}. Pulangkan JSON dengan medan objektifProgram, ringkasanAktiviti, impakProgram, cadanganPenambahbaikan dan kesimpulan dalam Bahasa Melayu rasmi berdasarkan catatan: ${input}` });
  try { res.json(JSON.parse(response.output_text)); } catch { res.json({ ringkasanAktiviti: response.output_text }); }
});
function fallback(input, mode) {
  const base = `Berdasarkan catatan guru, ${input} Aktiviti ini dilaksanakan secara tersusun dengan penglibatan aktif murid dan guru.`;
  return { objektifProgram: 'Meningkatkan penglibatan murid secara aktif serta membina nilai murni melalui pelaksanaan program yang terancang.', ringkasanAktiviti: mode === 'pendekkan' ? base.slice(0, 140) : base, impakProgram: 'Program ini meningkatkan disiplin, kerjasama dan kesedaran murid terhadap nilai murni yang disasarkan.', cadanganPenambahbaikan: 'Pelaksanaan akan datang boleh ditambah baik melalui perancangan masa yang lebih rapi, bahan sokongan mencukupi dan dokumentasi yang lebih menyeluruh.', kesimpulan: 'Secara keseluruhannya, program ini berjaya mencapai objektif dan wajar diteruskan pada masa akan datang.' };
}
export default router;
