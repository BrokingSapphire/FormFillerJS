// src/cli.ts
import { PDFService } from './services/pdfService.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a new instance of PDFService
const pdfService = new PDFService();

async function runCLI() {
  // Get arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('Usage: node dist/cli.js <templateName> <outputName> <fieldsJsonString>');
    process.exit(1);
  }
  
  const [templateName, outputName, fieldsJson] = args;
  
  try {
    // Parse fields JSON
    const fields = JSON.parse(fieldsJson);
    
    // Fill PDF
    const outputPath = await pdfService.fillPDF(templateName, outputName, fields);
    
    console.log(`PDF filled successfully: ${outputPath}`);
  } catch (error: any) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

runCLI();