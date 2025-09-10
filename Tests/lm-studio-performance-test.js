const https = require('http');
const { performance } = require('perf_hooks');

const API_URL = 'http://localhost:1234';
const MODEL = 'qwen/qwen3-30b-a3b-2507';

// Helper function to make API calls
async function callAPI(endpoint, data) {
  const startTime = performance.now();
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1234,
      path: endpoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        try {
          const result = JSON.parse(body);
          resolve({
            result,
            responseTime,
            tokensPerSecond: result.usage ? 
              (result.usage.completion_tokens / (responseTime / 1000)) : null
          });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
}

// Test cases
const testCases = [
  {
    name: "Simple Math",
    messages: [{ role: "user", content: "What is 17 * 23?" }],
    max_tokens: 50
  },
  {
    name: "Code Generation",
    messages: [{ role: "user", content: "Write a Python function to calculate fibonacci numbers recursively." }],
    max_tokens: 200
  },
  {
    name: "Reasoning Task",
    messages: [{ role: "user", content: "If all roses are flowers, and some flowers fade quickly, can we conclude that some roses fade quickly? Explain your reasoning." }],
    max_tokens: 150
  },
  {
    name: "Creative Writing",
    messages: [{ role: "user", content: "Write a haiku about artificial intelligence." }],
    max_tokens: 50
  },
  {
    name: "Long Context Summary",
    messages: [{ 
      role: "user", 
      content: "Summarize this in one sentence: " + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(20) 
    }],
    max_tokens: 100
  },
  {
    name: "JSON Generation",
    messages: [{ 
      role: "user", 
      content: "Generate a JSON object representing a person with name, age, and hobbies array." 
    }],
    max_tokens: 100
  }
];

// Streaming test
async function testStreaming() {
  console.log("\n=== STREAMING PERFORMANCE TEST ===");
  const startTime = performance.now();
  let firstTokenTime = null;
  let tokenCount = 0;
  
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: "Count from 1 to 10 slowly, explaining each number." }],
      stream: true,
      max_tokens: 200
    });

    const options = {
      hostname: 'localhost',
      port: 1234,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      res.on('data', (chunk) => {
        if (!firstTokenTime) {
          firstTokenTime = performance.now();
          console.log(`Time to first token: ${(firstTokenTime - startTime).toFixed(2)}ms`);
        }
        tokenCount++;
      });
      
      res.on('end', () => {
        const totalTime = performance.now() - startTime;
        console.log(`Total streaming time: ${totalTime.toFixed(2)}ms`);
        console.log(`Chunks received: ${tokenCount}`);
        resolve();
      });
    });

    req.write(data);
    req.end();
  });
}

// Main test function
async function runPerformanceTests() {
  console.log("=== LM STUDIO PERFORMANCE TEST ===");
  console.log(`Model: ${MODEL}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  const results = [];

  // Run standard tests
  for (const test of testCases) {
    console.log(`\nTesting: ${test.name}`);
    console.log(`Prompt: "${test.messages[0].content.substring(0, 50)}..."`);
    
    try {
      const response = await callAPI('/v1/chat/completions', {
        model: MODEL,
        messages: test.messages,
        max_tokens: test.max_tokens,
        temperature: 0.7
      });
      
      console.log(`Response time: ${response.responseTime.toFixed(2)}ms`);
      console.log(`Tokens generated: ${response.result.usage.completion_tokens}`);
      console.log(`Tokens/second: ${response.tokensPerSecond.toFixed(2)}`);
      console.log(`Total tokens: ${response.result.usage.total_tokens}`);
      
      results.push({
        test: test.name,
        responseTime: response.responseTime,
        completionTokens: response.result.usage.completion_tokens,
        tokensPerSecond: response.tokensPerSecond
      });
    } catch (error) {
      console.error(`Error in test ${test.name}:`, error.message);
    }
  }

  // Streaming test
  await testStreaming();

  // Summary statistics
  console.log("\n=== PERFORMANCE SUMMARY ===");
  
  const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
  const avgTokensPerSecond = results.reduce((sum, r) => sum + r.tokensPerSecond, 0) / results.length;
  
  console.log(`Average response time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`Average tokens/second: ${avgTokensPerSecond.toFixed(2)}`);
  
  console.log("\nDetailed results:");
  console.table(results);
}

// Run the tests
runPerformanceTests().catch(console.error);
