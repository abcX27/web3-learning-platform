interface CompileResult {
    success: boolean;
    abi?: any;
    bytecode?: string;
    errors?: string[];
    warnings?: string[];
}
interface ExecuteResult {
    success: boolean;
    output?: string;
    error?: string;
}
export declare class EditorService {
    /**
     * Compile Solidity code
     */
    static compileSolidity(sourceCode: string): CompileResult;
    /**
     * Execute JavaScript code in sandboxed environment
     */
    static executeJavaScript(code: string): ExecuteResult;
}
export {};
//# sourceMappingURL=editorService.d.ts.map