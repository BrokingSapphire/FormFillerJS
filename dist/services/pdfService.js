// src/services/pdfService.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export class PDFService {
    templatesDir;
    outputDir;
    constructor() {
        this.templatesDir = path.join(dirname(__dirname), '..', 'templates');
        this.outputDir = path.join(dirname(__dirname), '..', 'output');
        // Ensure directories exist
        if (!fs.existsSync(this.templatesDir)) {
            fs.mkdirSync(this.templatesDir, { recursive: true });
        }
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }
    async fillPDF(templateName, outputName, fields, options) {
        try {
            const inputPath = path.join(this.templatesDir, templateName);
            const outputPath = path.join(this.outputDir, outputName);
            // Check if template exists
            if (!fs.existsSync(inputPath)) {
                throw new Error(`Template not found: ${templateName}`);
            }
            // Use promises for file operations to prevent blocking
            const pdfBytes = await fs.promises.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const page = pdfDoc.getPages()[0];
            // Set default options
            const fontSize = options?.fontSize || 12;
            const fontColor = options?.fontColor
                ? rgb(options.fontColor.r, options.fontColor.g, options.fontColor.b)
                : rgb(0, 0, 0);
            const fontName = options?.fontName || StandardFonts.Helvetica;
            // Embed font
            const font = await pdfDoc.embedFont(fontName);
            // Fill fields
            fields.forEach(field => {
                page.drawText(field.text, {
                    x: field.x,
                    y: field.y,
                    size: fontSize,
                    color: fontColor,
                    font: font,
                });
            });
            // Save the modified PDF
            const pdfBytesUpdated = await pdfDoc.save();
            await fs.promises.writeFile(outputPath, pdfBytesUpdated);
            return outputPath;
        }
        catch (error) {
            throw new Error(`Error filling PDF: ${error.message}`);
        }
    }
}
export default new PDFService();
//# sourceMappingURL=pdfService.js.map