import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function fillPDF(inputPath, outputPath) {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    console.log("PDF loaded successfully!");
    return pdfDoc;
}

fillPDF('input.pdf', 'output.pdf');
