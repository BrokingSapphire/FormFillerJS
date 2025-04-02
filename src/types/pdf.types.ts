// src/types/pdf.types.ts
export interface PDFField {
  text?: string;
  imageUrl?: string; // Added this property for image URLs
  x: number;
  y: number;
  page?: number;
  width?: number; // For image sizing
  height?: number; // For image sizing
  contentType: 'text' | 'image'; // New field to determine content type
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