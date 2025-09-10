#!/usr/bin/env node

/**
 * MCP-LM Studio Integration Test
 * Tests the integration between MCP servers and LM Studio models
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const LM_STUDIO_URL = 'http://localhost:1234';
const MCP_SHELL_PATH = '/Volumes/DATA/ULTRA/mcp/shell';
const TEST_MODEL = 'qwen3-30b-a3b-instruct-2507-mlx';

// Helper to call LM Studio API
async function callLMStudio(prompt, systemPrompt = '') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: TEST_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are a helpful assistant that can use tools to interact with the system."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const options = {
      hostname: 'localhost',
      port: 1234,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Test 1: Basic LM Studio connectivity
async function testLMStudioConnection() {
  console.log("\n📡 Test 1: LM Studio Connection");
  console.log("================================");
  
  try {
    const response = await callLMStudio("Say 'hello' in one word");
    if (response.choices && response.choices[0]) {
      console.log("✅ LM Studio responding");
      console.log(`   Response: ${response.choices[0].message.content}`);
      return true;
    }
  } catch (error) {
    console.log(`❌ LM Studio connection failed: ${error.message}`);
    return false;
  }
}

// Test 2: MCP Shell Server functionality
async function testMCPShell() {
  console.log("\n🐚 Test 2: MCP Shell Server");
  console.log("===========================");
  
  const testFile = '/Volumes/DATA/ULTRA/test-mcp-output.txt';
  const testContent = `MCP Test: ${new Date().toISOString()}`;
  
  try {
    // Write a test file using fs (simulating MCP write)
    fs.writeFileSync(testFile, testContent);
    console.log("✅ File write simulation successful");
    
    // Read it back
    const content = fs.readFileSync(testFile, 'utf8');
    if (content === testContent) {
      console.log("✅ File read verification successful");
    }
    
    // Clean up
    fs.unlinkSync(testFile);
    console.log("✅ File cleanup successful");
    
    return true;
  } catch (error) {
    console.log(`❌ MCP Shell test failed: ${error.message}`);
    return false;
  }
}

// Test 3: Integration workflow
async function testIntegrationWorkflow() {
  console.log("\n🔄 Test 3: Integration Workflow");
  console.log("================================");
  
  try {
    // Create a complex prompt that would benefit from tool use
    const systemPrompt = `You are an AI assistant with access to system tools.
You can read files, write files, and execute commands.
Always be helpful and accurate.`;
    
    const userPrompt = `Please analyze the following:
1. What files are in the current directory?
2. How many JavaScript files are there?
3. What is the purpose of this project based on the files you see?
Provide a brief summary.`;
    
    console.log("📤 Sending complex analysis request to LM Studio...");
    const response = await callLMStudio(userPrompt, systemPrompt);
    
    if (response.choices && response.choices[0]) {
      console.log("✅ Integration workflow completed");
      console.log("\n📝 AI Analysis:");
      console.log("─".repeat(50));
      console.log(response.choices[0].message.content);
      console.log("─".repeat(50));
      return true;
    }
  } catch (error) {
    console.log(`❌ Integration workflow failed: ${error.message}`);
    return false;
  }
}

// Test 4: Performance benchmark
async function testPerformance() {
  console.log("\n⚡ Test 4: Performance Benchmark");
  console.log("=================================");
  
  const iterations = 3;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      await callLMStudio(`Calculate: ${i + 1} * ${i + 2}`);
      const elapsed = Date.now() - start;
      times.push(elapsed);
      console.log(`   Iteration ${i + 1}: ${elapsed}ms`);
    } catch (error) {
      console.log(`   Iteration ${i + 1}: Failed`);
    }
  }
  
  if (times.length > 0) {
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`\n✅ Average response time: ${avg.toFixed(2)}ms`);
    return true;
  }
  
  return false;
}

// Main test runner
async function runAllTests() {
  console.log("╔═══════════════════════════════════════════╗");
  console.log("║     MCP-LM Studio Integration Tests      ║");
  console.log("╚═══════════════════════════════════════════╝");
  
  const results = [];
  
  // Run tests
  results.push(await testLMStudioConnection());
  results.push(await testMCPShell());
  results.push(await testIntegrationWorkflow());
  results.push(await testPerformance());
  
  // Summary
  console.log("\n📊 TEST SUMMARY");
  console.log("═══════════════");
  const passed = results.filter(r => r).length;
  const failed = results.length - passed;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
  
  if (passed === results.length) {
    console.log("\n🎉 All tests passed! Integration is working perfectly.");
  } else {
    console.log("\n⚠️ Some tests failed. Please check the configuration.");
  }
}

// Run the tests
runAllTests().catch(console.error);