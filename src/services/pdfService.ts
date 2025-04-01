// src/services/pdfService.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PDFField, PDFOptions } from '../types/pdf.types.js';

// ESM compatibility for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PDFService {
  private templatesDir: string;
  private outputDir: string;

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

  async fillPDF(
    templateName: string, 
    outputName: string, 
    fields: PDFField[], 
    options?: PDFOptions
  ): Promise<string> {
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

      // Fill fields, respecting page numbers
      fields.forEach(field => {
        // Get the target page (default to first page if not specified)
        const pageIndex = field.page !== undefined ? field.page : 0;
        
        // Validate page number
        if (pageIndex < 0 || pageIndex >= pageCount) {
          console.warn(`Warning: Page ${pageIndex} does not exist in document with ${pageCount} pages. Field "${field.text}" skipped.`);
          return;
        }
        
        const page = pages[pageIndex];
        
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
    } catch (error: any) {
      throw new Error(`Error filling PDF: ${error.message}`);
    }
  }

  async getTemplateInfo(templateName: string): Promise<{
    name: string;
    pageCount: number;
    pages: Array<{ width: number; height: number }>;
  }> {
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
    } catch (error: any) {
      throw new Error(`Error getting template info: ${error.message}`);
    }
  }
}

export default new PDFService();