import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';

async function fillPDF(inputPath, outputPath) {
    try {
        const pdfBytes = fs.readFileSync(inputPath);        // Load PDF
        const pdfDoc = await PDFDocument.load(pdfBytes);    // Parse PDF document
        const page = pdfDoc.getPages()[0];                  // Access the first page

        // Draw text at specific coordinates (x, y)
        page.drawText('John Doe', {
            x: 100,
            y: 500,
            size: 12,
            color: rgb(0, 0, 0),
        });

        // Save the modified PDF
        const pdfBytesUpdated = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytesUpdated);      // Write output file
        console.log("PDF saved successfully at", outputPath);
    } catch (error) {
        console.error("Error filling PDF:", error);
    }
}

// Get file paths from command-line arguments or use defaults
const inputPath = process.argv[2] || 'input.pdf';
const outputPath = process.argv[3] || 'output.pdf';

// Call the function
fillPDF(inputPath, outputPath);
