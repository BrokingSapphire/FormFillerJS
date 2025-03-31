import { Request, Response } from 'express';
export declare class PDFController {
    fillPDF(req: Request, res: Response): Promise<void>;
    downloadPDF(req: Request, res: Response): Promise<void>;
}
declare const _default: PDFController;
export default _default;
