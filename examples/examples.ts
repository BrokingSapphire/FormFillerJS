// examples/example.ts
// This is an example of how to use the PDF filler API programmatically

import { PDFService } from '../src/services/pdfService.js';

// Create new PDF service instance
const pdfService = new PDFService();

// Define fields to fill
const fields = [
  { text: 'John Doe', x: 100, y: 500 },
  { text: '01/01/1990', x: 100, y: 480 },
  { text: '1234-5678-9012', x: 100, y: 460 }
];

// Define options
const options = {
  fontSize: 12,
  fontColor: { r: 0, g: 0, b: 0 }
};

// Fill PDF
async function fillPDFExample() {
  try {
    const outputPath = await pdfService.fillPDF(
      'input.pdf',
      'filled_example.pdf',
      fields,
      options
    );
    
    console.log(`PDF filled successfully at: ${outputPath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

fillPDFExample();