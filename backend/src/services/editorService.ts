import solc from 'solc';
import * as vm from 'vm';

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

export class EditorService {
  /**
   * Compile Solidity code
   */
  static compileSolidity(sourceCode: string): CompileResult {
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

      const output = JSON.parse(solc.compile(JSON.stringify(input)));

      const errors: string[] = [];
      const warnings: string[] = [];

      if (output.errors) {
        output.errors.forEach((error: any) => {
          if (error.severity === 'error') {
            errors.push(error.formattedMessage);
          } else {
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
    } catch (error: any) {
      return {
        success: false,
        errors: [error.message || 'Compilation failed'],
      };
    }
  }

  /**
   * Execute JavaScript code in sandboxed environment
   */
  static executeJavaScript(code: string): ExecuteResult {
    try {
      // Capture console.log output
      let output = '';
      
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            output += args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ') + '\n';
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Execution failed',
      };
    }
  }
}
