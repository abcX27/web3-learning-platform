'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';

// Dynamically import Monaco Editor to avoid SSR issues
const CodeEditor = dynamic(() => import('@/components/editor/CodeEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] bg-gray-100 dark:bg-gray-800 rounded-md">
      <p className="text-muted-foreground">Loading editor...</p>
    </div>
  ),
});

type Language = 'solidity' | 'javascript';

const SOLIDITY_TEMPLATE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`;

const JAVASCRIPT_TEMPLATE = `// JavaScript Example
console.log("Hello, Web3 Learning Platform!");

// Calculate factorial
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log("Factorial of 5:", factorial(5));

// Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);`;

export default function EditorPage() {
  const [language, setLanguage] = useState<Language>('solidity');
  const [code, setCode] = useState(SOLIDITY_TEMPLATE);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(newLanguage === 'solidity' ? SOLIDITY_TEMPLATE : JAVASCRIPT_TEMPLATE);
    setOutput('');
  };

  const handleCompile = async () => {
    if (language !== 'solidity') return;

    try {
      setIsLoading(true);
      setOutput('Compiling...\n');

      const response = await api.post('/api/editor/compile', { code });

      if (response.success && response.data) {
        const result = response.data;

        if (result.success) {
          let outputText = '✅ Compilation successful!\n\n';
          
          if (result.warnings && result.warnings.length > 0) {
            outputText += '⚠️ Warnings:\n';
            result.warnings.forEach((warning: string) => {
              outputText += warning + '\n';
            });
            outputText += '\n';
          }

          outputText += '📝 Contract ABI:\n';
          outputText += JSON.stringify(result.abi, null, 2) + '\n\n';
          outputText += '📦 Bytecode length: ' + (result.bytecode?.length || 0) + ' characters\n';

          setOutput(outputText);
        } else {
          let errorText = '❌ Compilation failed!\n\n';
          if (result.errors && result.errors.length > 0) {
            errorText += 'Errors:\n';
            result.errors.forEach((error: string) => {
              errorText += error + '\n';
            });
          }
          setOutput(errorText);
        }
      }
    } catch (error: any) {
      setOutput('❌ Error: ' + (error.error?.message || 'Failed to compile'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    if (language !== 'javascript') return;

    try {
      setIsLoading(true);
      setOutput('Executing...\n');

      const response = await api.post('/api/editor/execute', { code });

      if (response.success && response.data) {
        const result = response.data;

        if (result.success) {
          setOutput('✅ Execution successful!\n\n' + result.output);
        } else {
          setOutput('❌ Execution failed!\n\n' + result.error);
        }
      }
    } catch (error: any) {
      setOutput('❌ Error: ' + (error.error?.message || 'Failed to execute'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRun = () => {
    if (language === 'solidity') {
      handleCompile();
    } else {
      handleExecute();
    }
  };

  const handleClear = () => {
    setCode(language === 'solidity' ? SOLIDITY_TEMPLATE : JAVASCRIPT_TEMPLATE);
    setOutput('');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">在线代码编辑器</h1>
        <p className="text-muted-foreground">
          编写和测试 Solidity 智能合约或 JavaScript 代码
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>代码编辑器</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={language === 'solidity' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('solidity')}
                >
                  Solidity
                </Button>
                <Button
                  variant={language === 'javascript' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange('javascript')}
                >
                  JavaScript
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <CodeEditor
                value={code}
                onChange={(value) => setCode(value || '')}
                language={language}
                height="500px"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRun}
                disabled={isLoading || !code.trim()}
                className="flex-1"
              >
                {isLoading ? '处理中...' : language === 'solidity' ? '编译' : '运行'}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading}
              >
                清空
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardHeader>
            <CardTitle>输出</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm h-[500px] overflow-auto">
              {output ? (
                <pre className="whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-gray-500">
                  {language === 'solidity'
                    ? '点击"编译"按钮编译 Solidity 代码'
                    : '点击"运行"按钮执行 JavaScript 代码'}
                </p>
              )}
            </div>
            
            {language === 'solidity' && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💡 提示：编译成功后，您可以将合约部署到测试网络。部署功能将在后续版本中添加。
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Solidity 编辑器</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>支持 Solidity 语法高亮</li>
                <li>实时编译智能合约</li>
                <li>显示编译错误和警告</li>
                <li>查看合约 ABI 和字节码</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">JavaScript 编辑器</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>支持 JavaScript 语法高亮</li>
                <li>沙箱环境执行代码</li>
                <li>捕获 console.log 输出</li>
                <li>显示运行时错误</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
