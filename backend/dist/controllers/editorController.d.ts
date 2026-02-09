import { Request, Response } from 'express';
export declare class EditorController {
    /**
     * Compile Solidity code
     */
    static compile(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Execute JavaScript code
     */
    static execute(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=editorController.d.ts.map