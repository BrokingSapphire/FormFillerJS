import { PDFField, PDFOptions } from '../types/pdf.types.js';
export declare class PDFService {
    private templatesDir;
    private outputDir;
    constructor();
    fillPDF(templateName: string, outputName: string, fields: PDFField[], options?: PDFOptions): Promise<string>;
}
declare const _default: PDFService;
export default _default;
