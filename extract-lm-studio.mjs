import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['mcp-firecrawl/dist/index.js'],
    env: {
      ...process.env,
      FIRECRAWL_API_KEY: 'fc-b641c64dbb3b4962909c2f8f04c524ba',
      SKILLS_PATH: '/Volumes/DATA/ULTRA/skills-catalog'
    }
  });
  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  });
  
  try {
    console.log('Connecting to MCP server...');
    await client.connect(transport);
    console.log('Connected successfully\n');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Use FIRE-1 agent to extract all information from LM Studio docs
    console.log('Performing comprehensive extraction of LM Studio documentation...');
    console.log('Target URL: https://lmstudio.ai/docs/app/*');
    console.log('This may take a significant amount of time...\n');
    
    const fire1Result = await client.callTool(
      {
        name: 'extract',
        arguments: {
          urls: ['https://lmstudio.ai/docs/app/*'],
          prompt: 'Extract all technical information from the LM Studio documentation, including all features, installation steps, configuration options, API usage, and information from all sub-pages. Be as comprehensive as possible.',
          agent: { model: 'FIRE-1' },
          schema: {
            type: 'object',
            properties: {
              overview: { type: 'string' },
              system_requirements: { type: 'string' },
              installation: { 
                type: 'object',
                properties: {
                  platforms: { type: 'array', items: { type: 'string' } },
                  steps: { type: 'array', items: { type: 'string' } }
                }
              },
              features: { 
                type: 'array', 
                items: { 
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' }
                  }
                }
              },
              api_usage: { 
                type: 'object',
                properties: {
                  openai_compatible_api: { type: 'string' },
                  rest_api: { type: 'string' }
                }
              },
              configuration: { type: 'array', items: { type: 'string' } },
              integrations: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        timeout: 1200000 // 20 minutes
      }
    );
    
    console.log('\nFIRE-1 extraction completed!');
    const extractedData = JSON.parse(fire1Result.content[0].text);
    console.log('Extracted data preview:', JSON.stringify(extractedData, null, 2).substring(0, 1000) + '...');
    
    // Save the result as a new skill
    console.log('\n\nSaving as a new skill: lm-studio-docs');
    
    const skillName = 'lm-studio-docs';
    const skillData = {
      id: `technical_${skillName.replace(/-/g, '_')}_${Date.now()}`,
      name: skillName,
      type: 'technical',
      content: extractedData,
      metadata: {
        source: 'https://lmstudio.ai/docs/app',
        extractedAt: new Date().toISOString(),
        tags: ['lm-studio', 'llm', 'local-ai', 'documentation']
      }
    };
    
    const skillsPath = '/Volumes/DATA/ULTRA/skills-catalog';
    const jsonPath = path.join(skillsPath, 'json', `${skillName}.json`);
    const mdPath = path.join(skillsPath, 'md', `${skillName}.md`);
    
    await fs.writeFile(jsonPath, JSON.stringify(skillData, null, 2));
    console.log(`Saved JSON skill to: ${jsonPath}`);
    
    const mdContent = `
# ${skillName}

**Type:** ${skillData.type}
**Source:** ${skillData.metadata.source}
**Extracted:** ${skillData.metadata.extractedAt}
**Tags:** ${skillData.metadata.tags.join(', ')}

## Overview
${extractedData.overview}

## System Requirements
${extractedData.system_requirements}

## Installation
**Platforms:** ${(extractedData.installation?.platforms || []).join(', ')}
**Steps:**
${(extractedData.installation?.steps || []).map(s => `- ${s}`).join('\n')}

## Features
${(extractedData.features || []).map(f => `### ${f.name}\n${f.description}`).join('\n\n')}

## API Usage
### OpenAI Compatible API
${extractedData.api_usage?.openai_compatible_api}

### REST API
${extractedData.api_usage?.rest_api}

## Configuration
${(extractedData.configuration || []).map(c => `- ${c}`).join('\n')}

## Integrations
${(extractedData.integrations || []).map(i => `- ${i}`).join('\n')}
`;
    
    await fs.writeFile(mdPath, mdContent.trim());
    console.log(`Saved Markdown skill to: ${mdPath}`);
    
    await transport.close();
    console.log('\n\nExtraction and skill creation completed successfully!');
    
  } catch (error) {
    console.error('Error:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.data) {
      console.error('Error data:', error.data);
    }
    process.exit(1);
  }
}

main().catch(console.error);
