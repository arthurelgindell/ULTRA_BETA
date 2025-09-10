#!/usr/bin/env node

const http = require('http');

// Test inference with both models
async function testModel(modelId, prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: modelId,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond concisely."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 100,
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
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
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

async function runTests() {
  console.log("=== LM STUDIO MODEL INFERENCE TEST ===\n");
  
  const models = [
    { id: 'qwen3-30b-a3b-instruct-2507-mlx', name: 'Qwen3 30B' },
    { id: 'devstral-small-2507-mlx', name: 'Devstral Small' }
  ];
  
  const testPrompt = "What is the capital of France? Answer in one word.";
  
  for (const model of models) {
    console.log(`Testing ${model.name} (${model.id})...`);
    console.log(`Prompt: "${testPrompt}"`);
    
    try {
      const startTime = Date.now();
      const response = await testModel(model.id, testPrompt);
      const endTime = Date.now();
      
      if (response.choices && response.choices[0]) {
        const answer = response.choices[0].message.content;
        const tokens = response.usage ? response.usage.total_tokens : 'N/A';
        
        console.log(`✅ Response: ${answer}`);
        console.log(`   Tokens used: ${tokens}`);
        console.log(`   Time: ${endTime - startTime}ms`);
      } else {
        console.log(`❌ No response received`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('---\n');
  }
  
  console.log("=== TEST COMPLETE ===");
}

// Run the tests
runTests().catch(console.error);