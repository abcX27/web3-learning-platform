import { create } from 'zustand';

export type EditorLanguage = 'solidity' | 'javascript';

interface CompileResult {
  success: boolean;
  abi?: any[];
  bytecode?: string;
  errors?: string[];
  warnings?: string[];
}

interface DeployResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

interface ExecuteResult {
  success: boolean;
  output?: string;
  error?: string;
}

interface EditorState {
  language: EditorLanguage;
  code: string;
  output: string;
  isCompiling: boolean;
  isDeploying: boolean;
  isExecuting: boolean;
  compileResult: CompileResult | null;
  deployResult: DeployResult | null;
  executeResult: ExecuteResult | null;
  
  // Actions
  setLanguage: (language: EditorLanguage) => void;
  setCode: (code: string) => void;
  setOutput: (output: string) => void;
  appendOutput: (output: string) => void;
  clearOutput: () => void;
  setCompiling: (isCompiling: boolean) => void;
  setDeploying: (isDeploying: boolean) => void;
  setExecuting: (isExecuting: boolean) => void;
  setCompileResult: (result: CompileResult | null) => void;
  setDeployResult: (result: DeployResult | null) => void;
  setExecuteResult: (result: ExecuteResult | null) => void;
  reset: () => void;
}

const DEFAULT_SOLIDITY_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, Web3!";
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`;

const DEFAULT_JAVASCRIPT_CODE = `// JavaScript code to interact with blockchain
import { ethers } from 'ethers';

// Connect to MetaMask
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

console.log('Connected address:', await signer.getAddress());
`;

export const useEditorStore = create<EditorState>((set) => ({
  language: 'solidity',
  code: DEFAULT_SOLIDITY_CODE,
  output: '',
  isCompiling: false,
  isDeploying: false,
  isExecuting: false,
  compileResult: null,
  deployResult: null,
  executeResult: null,

  setLanguage: (language) =>
    set({
      language,
      code: language === 'solidity' ? DEFAULT_SOLIDITY_CODE : DEFAULT_JAVASCRIPT_CODE,
      output: '',
      compileResult: null,
      deployResult: null,
      executeResult: null,
    }),

  setCode: (code) => set({ code }),

  setOutput: (output) => set({ output }),

  appendOutput: (output) =>
    set((state) => ({
      output: state.output + output + '\n',
    })),

  clearOutput: () => set({ output: '' }),

  setCompiling: (isCompiling) => set({ isCompiling }),

  setDeploying: (isDeploying) => set({ isDeploying }),

  setExecuting: (isExecuting) => set({ isExecuting }),

  setCompileResult: (result) => set({ compileResult: result }),

  setDeployResult: (result) => set({ deployResult: result }),

  setExecuteResult: (result) => set({ executeResult: result }),

  reset: () =>
    set({
      code: DEFAULT_SOLIDITY_CODE,
      output: '',
      isCompiling: false,
      isDeploying: false,
      isExecuting: false,
      compileResult: null,
      deployResult: null,
      executeResult: null,
    }),
}));
