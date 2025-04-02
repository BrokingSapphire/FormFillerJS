// src/services/pdfService.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';
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
            const pages = pdfDoc.getPages();
            const pageCount = pages.length;
            // Set default options
            const fontSize = options?.fontSize || 12;
            const fontColor = options?.fontColor
                ? rgb(options.fontColor.r, options.fontColor.g, options.fontColor.b)
                : rgb(0, 0, 0);
            const fontName = options?.fontName || StandardFonts.Helvetica;
            // Embed font
            const font = await pdfDoc.embedFont(fontName);
            // Process each field
            for (const field of fields) {
                // Get the target page (default to first page if not specified)
                const pageIndex = field.page !== undefined ? field.page : 0;
                // Validate page number
                if (pageIndex < 0 || pageIndex >= pageCount) {
                    console.warn(`Warning: Page ${pageIndex} does not exist in document with ${pageCount} pages. Field skipped.`);
                    continue;
                }
                const page = pages[pageIndex];
                // Process based on content type
                if (field.contentType === 'text' && field.text) {
                    page.drawText(field.text, {
                        x: field.x,
                        y: field.y,
                        size: fontSize,
                        color: fontColor,
                        font: font,
                    });
                }
                else if (field.contentType === 'image' && field.imageUrl) {
                    try {
                        console.log(`Processing image URL: ${field.imageUrl}`);
                        // Fetch the image
                        const response = await fetch(field.imageUrl);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch image: ${response.statusText}`);
                        }
                        // Get content type from the response headers
                        const contentType = response.headers.get('content-type');
                        console.log(`Response content type: ${contentType}`);
                        const imageBytes = await response.arrayBuffer();
                        // Determine image type from Content-Type header or URL
                        let image;
                        if (contentType?.includes('image/jpeg') ||
                            field.imageUrl.toLowerCase().endsWith('.jpg') ||
                            field.imageUrl.toLowerCase().endsWith('.jpeg')) {
                            image = await pdfDoc.embedJpg(imageBytes);
                        }
                        else if (contentType?.includes('image/png') ||
                            field.imageUrl.toLowerCase().endsWith('.png')) {
                            image = await pdfDoc.embedPng(imageBytes);
                        }
                        else {
                            // Try to detect image format from the first few bytes
                            const bytes = new Uint8Array(imageBytes).slice(0, 8);
                            const isPNG = bytes[0] === 0x89 &&
                                bytes[1] === 0x50 &&
                                bytes[2] === 0x4E &&
                                bytes[3] === 0x47;
                            const isJPG = bytes[0] === 0xFF &&
                                bytes[1] === 0xD8;
                            console.log(`Magic bytes check - isPNG: ${isPNG}, isJPG: ${isJPG}`);
                            if (isPNG) {
                                image = await pdfDoc.embedPng(imageBytes);
                            }
                            else if (isJPG) {
                                image = await pdfDoc.embedJpg(imageBytes);
                            }
                            else {
                                throw new Error('Unsupported image format. Only JPG and PNG are supported.');
                            }
                        }
                        // Get dimensions
                        const imgWidth = field.width || image.width;
                        const imgHeight = field.height || image.height;
                        // Draw the image
                        page.drawImage(image, {
                            x: field.x,
                            y: field.y,
                            width: imgWidth,
                            height: imgHeight,
                        });
                        console.log(`Image successfully embedded at (${field.x}, ${field.y}) with dimensions ${imgWidth}x${imgHeight}`);
                    }
                    catch (imgError) {
                        console.error(`Error processing image: ${imgError.message}`);
                        continue;
                    }
                }
                else {
                    console.warn(`Warning: Field has invalid content type or missing required data.`);
                }
            }
            // Save the modified PDF
            const pdfBytesUpdated = await pdfDoc.save();
            await fs.promises.writeFile(outputPath, pdfBytesUpdated);
            return outputPath;
        }
        catch (error) {
            throw new Error(`Error filling PDF: ${error.message}`);
        }
    }
    async getTemplateInfo(templateName) {
        try {
            const inputPath = path.join(this.templatesDir, templateName);
            if (!fs.existsSync(inputPath)) {
                throw new Error(`Template not found: ${templateName}`);
            }
            const pdfBytes = await fs.promises.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();
            const pageInfo = pages.map(page => ({
                width: page.getWidth(),
                height: page.getHeight()
            }));
            return {
                name: templateName,
                pageCount: pages.length,
                pages: pageInfo
            };
        }
        catch (error) {
            throw new Error(`Error getting template info: ${error.message}`);
        }
    }
}
export default new PDFService();
//# sourceMappingURL=pdfService.js.map