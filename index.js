import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';

async function fillPDF(inputPath, outputPath, fields, commonSize = 12, commonColor = rgb(0, 0, 0)) {
    try {
        const pdfBytes = fs.readFileSync(inputPath);        // Load the PDF
        const pdfDoc = await PDFDocument.load(pdfBytes);    // Parse PDF document
        const page = pdfDoc.getPages()[0];                  // Access the first page

        // Iterate over the fields and draw each one
        fields.forEach(field => {
            page.drawText(field.text, {
                x: field.x,
                y: field.y,
                size: commonSize,    // Apply common size
                color: commonColor,  // Apply common color
            });
        });

        // Save the modified PDF
        const pdfBytesUpdated = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytesUpdated);      // Write the updated file
        console.log("PDF saved successfully at", outputPath);
    } catch (error) {
        console.error("Error filling PDF:", error);
    }
}

// Example: Fields to fill in the PDF
const fields = [
    { text: 'John Doe', x: 100, y: 500 },      // Name field
    { text: '01/01/1990', x: 100, y: 450 },    // DOB field
    { text: '1234-5678-9012', x: 100, y: 400 }, // ID field
];

// Get file paths from command-line arguments or use defaults
const inputPath = process.argv[2] || 'input.pdf';
const outputPath = process.argv[3] || 'output.pdf';

// Define common font size and color
const commonSize = 14;
const commonColor = rgb(0.2, 0.2, 0.8);  // Dark Blue

// Call the function with the fields and common styles
fillPDF(inputPath, outputPath, fields, commonSize, commonColor);
