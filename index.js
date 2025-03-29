import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import { rgb } from 'pdf-lib';

async function fillPDF(inputPath, outputPath) {
    try {
        const pdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const page = pdfDoc.getPages()[0];

        page.drawText('John Doe', { x: 100, y: 500, size: 12, color: rgb(0, 0, 0) });

        const pdfBytesUpdated = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytesUpdated);
        console.log("PDF saved successfully at", outputPath);
    } catch (error) {
        console.error("Error filling PDF:", error);
    }
}

const page = pdfDoc.getPages()[0];  // Access the first page

page.drawText('John Doe', {
    x: 100,  // X coordinate
    y: 500,  // Y coordinate
    size: 12,
    color: rgb(0, 0, 0),
});

const pdfBytesUpdated = await pdfDoc.save();
fs.writeFileSync(outputPath, pdfBytesUpdated);

console.log("PDF saved successfully at", outputPath);


const inputPath = process.argv[2] || 'input.pdf';
const outputPath = process.argv[3] || 'output.pdf';
fillPDF('input.pdf', 'output.pdf');
