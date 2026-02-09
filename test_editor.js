const axios = require('axios');

const API_URL = 'http://localhost:4000';

// Test Solidity compilation
async function testSolidityCompile() {
  console.log('\n=== Testing Solidity Compilation ===\n');
  
  const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`;

  try {
    const response = await axios.post(`${API_URL}/api/editor/compile`, {
      code: solidityCode
    });

    console.log('✅ Compilation successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Compilation failed:', error.response?.data || error.message);
  }
}

// Test JavaScript execution
async function testJavaScriptExecute() {
  console.log('\n=== Testing JavaScript Execution ===\n');
  
  const jsCode = `console.log("Hello, Web3 Learning Platform!");

function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

console.log("Factorial of 5:", factorial(5));

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);`;

  try {
    const response = await axios.post(`${API_URL}/api/editor/execute`, {
      code: jsCode
    });

    console.log('✅ Execution successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Execution failed:', error.response?.data || error.message);
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\n=== Testing Error Handling ===\n');
  
  const invalidCode = `pragma solidity ^0.8.0;
contract Invalid {
    // Missing semicolon
    string public message
}`;

  try {
    const response = await axios.post(`${API_URL}/api/editor/compile`, {
      code: invalidCode
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error response:', error.response?.data || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting Editor API Tests...\n');
  
  await testSolidityCompile();
  await testJavaScriptExecute();
  await testErrorHandling();
  
  console.log('\n✅ All tests completed!\n');
}

runTests();
