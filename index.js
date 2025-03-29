import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function fillPDF(inputPath, outputPath) {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    console.log("PDF loaded successfully!");
    return pdfDoc;
}

const page = pdfDoc.getPages()[0];  // Access the first page

page.drawText('John Doe', {
    x: 100,  // X coordinate
    y: 500,  // Y coordinate
    size: 12,
    color: rgb(0, 0, 0),
});

fillPDF('input.pdf', 'output.pdf');
