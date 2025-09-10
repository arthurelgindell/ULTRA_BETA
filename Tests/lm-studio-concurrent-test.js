const http = require('http');
const { performance } = require('perf_hooks');

const API_URL = 'http://localhost:1234';
const MODEL = 'qwen/qwen3-30b-a3b-2507';

// Make a single API request
async function makeRequest(id, prompt) {
  const startTime = performance.now();
  
  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.7
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
      
      res.on('end', () => {
        const endTime = performance.now();
        try {
          const result = JSON.parse(body);
          resolve({
            id,
            success: true,
            responseTime: endTime - startTime,
            tokens: result.usage?.completion_tokens || 0
          });
        } catch (e) {
          resolve({
            id,
            success: false,
            responseTime: endTime - startTime,
            error: e.message
          });
        }
      });
    });

    req.on('error', (e) => {
      resolve({
        id,
        success: false,
        responseTime: performance.now() - startTime,
        error: e.message
      });
    });

    req.write(data);
    req.end();
  });
}

// Test concurrent requests
async function testConcurrent(numRequests, description) {
  console.log(`\n=== ${description} ===`);
  console.log(`Sending ${numRequests} concurrent requests...`);
  
  const prompts = [
    "What is 2+2?",
    "Name a color.",
    "Count to 3.",
    "Say hello.",
    "What day is it?",
    "Name a fruit.",
    "What is AI?",
    "Pick a number.",
    "Name a country.",
    "What is coding?"
  ];
  
  const startTime = performance.now();
  
  // Create array of promises for concurrent requests
  const promises = [];
  for (let i = 0; i < numRequests; i++) {
    const prompt = prompts[i % prompts.length];
    promises.push(makeRequest(i + 1, prompt));
  }
  
  // Wait for all requests to complete
  const results = await Promise.all(promises);
  const totalTime = performance.now() - startTime;
  
  // Analyze results
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const avgResponseTime = successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length;
  const maxResponseTime = Math.max(...successful.map(r => r.responseTime));
  const minResponseTime = Math.min(...successful.map(r => r.responseTime));
  
  console.log(`\nResults:`);
  console.log(`- Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`- Successful: ${successful.length}/${numRequests}`);
  console.log(`- Failed: ${failed.length}`);
  console.log(`- Average response time: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`- Min response time: ${minResponseTime.toFixed(2)}ms`);
  console.log(`- Max response time: ${maxResponseTime.toFixed(2)}ms`);
  console.log(`- Requests per second: ${(numRequests / (totalTime / 1000)).toFixed(2)}`);
  
  if (failed.length > 0) {
    console.log(`\nErrors:`);
    failed.forEach(f => console.log(`  Request ${f.id}: ${f.error}`));
  }
  
  return {
    numRequests,
    successful: successful.length,
    failed: failed.length,
    avgResponseTime,
    totalTime,
    requestsPerSecond: numRequests / (totalTime / 1000)
  };
}

// Main test
async function runConcurrentTests() {
  console.log("=== LM STUDIO CONCURRENT REQUEST TEST ===");
  console.log(`Model: ${MODEL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  
  const results = [];
  
  // Test different concurrency levels
  const testCases = [
    { count: 1, desc: "Single request (baseline)" },
    { count: 3, desc: "Low concurrency" },
    { count: 5, desc: "Medium concurrency" },
    { count: 10, desc: "High concurrency" }
  ];
  
  for (const { count, desc } of testCases) {
    const result = await testConcurrent(count, desc);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log("\n=== CONCURRENCY TEST SUMMARY ===");
  console.table(results.map(r => ({
    'Concurrent Requests': r.numRequests,
    'Success Rate': `${((r.successful / r.numRequests) * 100).toFixed(0)}%`,
    'Avg Response (ms)': r.avgResponseTime.toFixed(2),
    'Total Time (ms)': r.totalTime.toFixed(2),
    'Requests/sec': r.requestsPerSecond.toFixed(2)
  })));
  
  // Performance insights
  console.log("\n=== PERFORMANCE INSIGHTS ===");
  const baseline = results[0].avgResponseTime;
  results.forEach((r, i) => {
    if (i > 0) {
      const overhead = ((r.avgResponseTime / baseline) - 1) * 100;
      console.log(`${r.numRequests} concurrent: ${overhead.toFixed(1)}% overhead vs baseline`);
    }
  });
}

// Run tests
runConcurrentTests().catch(console.error);
