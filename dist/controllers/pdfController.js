import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pdfService from '../services/pdfService.js';
// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class PDFController {
    async fillPDF(req, res) {
        try {
            const { templateName, outputName, fields, options } = req.body;
            // Validate request
            if (!templateName || !fields || !Array.isArray(fields)) {
                res.status(400).json({ error: 'Invalid request format' });
                return;
            }
            // Generate output filename if not provided
            const finalOutputName = outputName || `filled_${Date.now()}.pdf`;
            // Call service to fill PDF
            const filledPdfPath = await pdfService.fillPDF(templateName, finalOutputName, fields, options);
            res.status(200).json({
                success: true,
                message: 'PDF filled successfully',
                filePath: path.basename(filledPdfPath)
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
    async downloadPDF(req, res) {
        try {
            const { filename } = req.params;
            const outputDir = path.join(dirname(__dirname), '..', 'output');
            const filePath = path.join(outputDir, filename);
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ error: 'File not found' });
                return;
            }
            res.download(filePath);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
export default new PDFController();
//# sourceMappingURL=pdfController.js.map