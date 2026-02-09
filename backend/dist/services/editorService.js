"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorService = void 0;
const solc_1 = __importDefault(require("solc"));
const vm = __importStar(require("vm"));
class EditorService {
    /**
     * Compile Solidity code
     */
    static compileSolidity(sourceCode) {
        try {
            const input = {
                language: 'Solidity',
                sources: {
                    'contract.sol': {
                        content: sourceCode,
                    },
                },
                settings: {
                    outputSelection: {
                        '*': {
                            '*': ['abi', 'evm.bytecode'],
                        },
                    },
                },
            };
            const output = JSON.parse(solc_1.default.compile(JSON.stringify(input)));
            const errors = [];
            const warnings = [];
            if (output.errors) {
                output.errors.forEach((error) => {
                    if (error.severity === 'error') {
                        errors.push(error.formattedMessage);
                    }
                    else {
                        warnings.push(error.formattedMessage);
                    }
                });
            }
            if (errors.length > 0) {
                return {
                    success: false,
                    errors,
                    warnings,
                };
            }
            // Get the first contract
            const contractFile = output.contracts['contract.sol'];
            const contractName = Object.keys(contractFile)[0];
            const contract = contractFile[contractName];
            return {
                success: true,
                abi: contract.abi,
                bytecode: contract.evm.bytecode.object,
                warnings,
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [error.message || 'Compilation failed'],
            };
        }
    }
    /**
     * Execute JavaScript code in sandboxed environment
     */
    static executeJavaScript(code) {
        try {
            // Capture console.log output
            let output = '';
            const sandbox = {
                console: {
                    log: (...args) => {
                        output += args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') + '\n';
                    },
                },
            };
            // Create context and run code
            const context = vm.createContext(sandbox);
            vm.runInContext(code, context, {
                timeout: 10000, // 10 seconds timeout
            });
            return {
                success: true,
                output: output.trim() || 'Code executed successfully (no output)',
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message || 'Execution failed',
            };
        }
    }
}
exports.EditorService = EditorService;
//# sourceMappingURL=editorService.js.map