import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs/promises';
const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (_, file, cb) => cb(null, ['image/jpeg','image/png','image/webp'].includes(file.mimetype)) });
router.post('/', upload.single('photo'), async (req, res) => { await fs.mkdir('uploads', { recursive: true }); const name = `${Date.now()}.webp`; await sharp(req.file.buffer).resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`uploads/${name}`); res.json({ url: `/uploads/${name}` }); });
export default router;
