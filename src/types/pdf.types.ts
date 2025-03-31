// src/types/pdf.types.ts
export interface PDFField {
    text: string;
    x: number;
    y: number;
  }
  
  export interface PDFOptions {
    fontSize?: number;
    fontColor?: {
      r: number;
      g: number;
      b: number;
    };
    fontName?: string;
  }
  
  export interface PDFFillRequest {
    templateName: string;
    outputName?: string;
    fields: PDFField[];
    options?: PDFOptions;
  }