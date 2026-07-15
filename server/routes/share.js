import { Router } from 'express';
import { notify } from '../services/notifications.js';
const router = Router();
router.post('/email', (req, res) => { const recipients = req.body.recipients || ['Guru Besar', 'PK Pentadbiran', 'PK HEM', 'PK Kokurikulum', 'PPD']; const notification = notify('email', 'Emel PDF laporan dijadualkan untuk dihantar.', { recipients, reportNo: req.body.reportNo }); res.json({ status: 'email-queued', recipients, notification }); });
export default router;
