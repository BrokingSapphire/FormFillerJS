export interface PDFField {
    text?: string;
    imageUrl?: string;
    x: number;
    y: number;
    page?: number;
    width?: number;
    height?: number;
    contentType: 'text' | 'image';
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
