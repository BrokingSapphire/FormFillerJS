import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'; // Import StandardFonts for Arial
import fs from 'fs';

async function fillPDF(inputPath, outputPath, fields, commonSize = 12, commonColor = rgb(0, 0, 0)) {
    try {
        const pdfBytes = fs.readFileSync(inputPath);        // Load the PDF
        const pdfDoc = await PDFDocument.load(pdfBytes);    // Parse the PDF document
        const page = pdfDoc.getPages()[0];                  // Access the first page

        // Embed Arial font (StandardFonts.Helvetica works as a close substitute)
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Iterate over the fields and draw each one with the common font and style
        fields.forEach(field => {
            page.drawText(field.text, {
                x: field.x,
                y: field.y,
                size: commonSize,          // Apply common size
                color: commonColor,        // Apply common color (Black)
                font: font,                // Apply Arial (Helvetica as a close match)
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

// Define common font size and color (size 12, color black)
const commonSize = 12;
const commonColor = rgb(0, 0, 0);  // Black color

// Call the function with the fields, common size, and common color
fillPDF(inputPath, outputPath, fields, commonSize, commonColor);
