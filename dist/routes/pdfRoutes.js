// src/routes/pdfRoutes.ts
import { Router } from 'express';
import pdfController from '../controllers/pdfController.js';
const router = Router();
router.post('/fill', pdfController.fillPDF);
router.get('/download/:filename', pdfController.downloadPDF);
export default router;
//# sourceMappingURL=pdfRoutes.js.map