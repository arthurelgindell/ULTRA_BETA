const http = require('http');
const { performance } = require('perf_hooks');

const API_URL = 'http://localhost:1234';
const MODEL = 'qwen/qwen3-30b-a3b-2507';

// Helper function for API calls
async function testContextLength(contextSize, description) {
  // Generate context of specific token count (rough estimate: ~4 chars per token)
  const baseText = "The quick brown fox jumps over the lazy dog. ";
  const estimatedRepeats = Math.floor(contextSize / 10); // ~10 tokens per sentence
  const context = baseText.repeat(estimatedRepeats);
  
  const messages = [
    {
      role: "system",
      content: context
    },
    {
      role: "user",
      content: "Based on the context above, write a single word response: fox"
    }
  ];

  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: messages,
      max_tokens: 10,
      temperature: 0
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
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        try {
          const result = JSON.parse(body);
          if (result.error) {
            resolve({
              contextSize,
              description,
              status: 'ERROR',
              error: result.error.message,
              responseTime
            });
          } else {
            resolve({
              contextSize,
              description,
              status: 'SUCCESS',
              promptTokens: result.usage.prompt_tokens,
              responseTime,
              response: result.choices[0].message.content
            });
          }
        } catch (e) {
          resolve({
            contextSize,
            description,
            status: 'PARSE_ERROR',
            error: e.message,
            responseTime
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        contextSize,
        description,
        status: 'REQUEST_ERROR',
        error: e.message,
        responseTime: performance.now() - startTime
      });
    });

    req.write(data);
    req.end();
  });
}

// Test memory usage
async function testMemoryPattern() {
  console.log("\n=== MEMORY PATTERN TEST ===");
  
  const conversation = [
    { role: "system", content: "You are a helpful assistant. Remember information given to you." },
    { role: "user", content: "My name is Alice and I like blue color." },
    { role: "assistant", content: "Nice to meet you, Alice! I'll remember that you like the color blue." },
    { role: "user", content: "What's my name and favorite color?" }
  ];

  try {
    const response = await new Promise((resolve, reject) => {
      const data = JSON.stringify({
        model: MODEL,
        messages: conversation,
        max_tokens: 50,
        temperature: 0
      });

      const options = {
        hostname: 'localhost',
        port: 1234,
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      });

      req.on('error', reject);
      req.write(data);
      req.end();
    });

    console.log("Memory test response:", response.choices[0].message.content);
    console.log("Context tokens used:", response.usage.prompt_tokens);
  } catch (error) {
    console.error("Memory test error:", error.message);
  }
}

// Main test
async function runContextTests() {
  console.log("=== LM STUDIO CONTEXT HANDLING TEST ===");
  console.log(`Model: ${MODEL}`);
  console.log(`Time: ${new Date().toISOString()}`);

  const contextSizes = [
    { size: 100, desc: "Small context" },
    { size: 500, desc: "Medium context" },
    { size: 1000, desc: "Large context" },
    { size: 2000, desc: "Very large context" },
    { size: 4000, desc: "Extensive context" },
    { size: 8000, desc: "Maximum context test" }
  ];

  console.log("\n=== CONTEXT LENGTH TESTS ===");
  const results = [];

  for (const { size, desc } of contextSizes) {
    console.log(`\nTesting ${desc} (~${size} tokens)...`);
    const result = await testContextLength(size, desc);
    results.push(result);
    
    if (result.status === 'SUCCESS') {
      console.log(`✓ Success - Actual tokens: ${result.promptTokens}, Time: ${result.responseTime.toFixed(2)}ms`);
    } else {
      console.log(`✗ Failed - ${result.error || 'Unknown error'}`);
    }
  }

  // Memory pattern test
  await testMemoryPattern();

  // Summary
  console.log("\n=== CONTEXT TEST SUMMARY ===");
  const successful = results.filter(r => r.status === 'SUCCESS');
  const maxContext = Math.max(...successful.map(r => r.promptTokens || 0));
  
  console.log(`Successful tests: ${successful.length}/${results.length}`);
  console.log(`Maximum context handled: ${maxContext} tokens`);
  console.log("\nDetailed results:");
  console.table(results.map(r => ({
    Description: r.description,
    Status: r.status,
    'Actual Tokens': r.promptTokens || 'N/A',
    'Response Time (ms)': r.responseTime.toFixed(2)
  })));
}

// Run tests
runContextTests().catch(console.error);
