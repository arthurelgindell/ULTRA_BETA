import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { FirecrawlServiceV2 } from './services/firecrawl-v2.js';
import { SkillStorage } from './services/skillStorage.js';
import { config } from './config/index.js';

const server = new Server(
  {
    name: 'mcp-firecrawl',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const firecrawl = new FirecrawlServiceV2(config.firecrawl.apiKey);
const skillStorage = new SkillStorage(config.storage.basePath);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'extract',
      description: 'Extract structured data from URLs using LLMs',
      inputSchema: {
        type: 'object',
        properties: {
          urls: { 
            type: 'array', 
            items: { type: 'string' },
            description: 'An array of one or more URLs to extract data from. Supports wildcards.' 
          },
          prompt: { 
            type: 'string', 
            description: 'A natural language prompt describing the data to extract.' 
          },
          schema: {
            type: 'object', 
            description: 'A more rigid structure if you already know the JSON layout.'
          },
          enableWebSearch: {
            type: 'boolean',
            description: 'When true, extraction can follow links outside the specified domain.',
            default: false
          },
          agent: {
            type: 'object',
            properties: {
              model: { type: 'string', enum: ['FIRE-1'] }
            },
            description: "Use Firecrawl's FIRE-1 agent for extraction."
          },
          timeout: {
            type: 'number',
            description: 'The timeout for the request in milliseconds.'
          },
        },
        required: ['urls'],
      },
    },
    {
      name: 'extract_skills',
      description: 'Extract skills and knowledge from crawled content',
      inputSchema: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'URL to extract skills from' },
          skillType: { 
            type: 'string', 
            enum: ['technical', 'product', 'solution', 'general'],
            description: 'Type of skills to extract' 
          },
          saveToCatalog: { 
            type: 'boolean', 
            description: 'Save extracted skills to catalog',
            default: true 
          },
        },
        required: ['url'],
      },
    },
    {
      name: 'search_skills',
      description: 'Search stored skills catalog',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          skillType: { type: 'string', description: 'Filter by skill type' },
          format: { 
            type: 'string', 
            enum: ['json', 'markdown', 'both'],
            default: 'both' 
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'list_skills',
      description: 'List all skills in the catalog',
      inputSchema: {
        type: 'object',
        properties: {
          skillType: { type: 'string', description: 'Filter by skill type' },
          format: { 
            type: 'string', 
            enum: ['json', 'markdown', 'both'],
            default: 'both' 
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  console.error(`[${new Date().toISOString()}] Received tool call: ${name}`);

  switch (name) {
    case 'extract': {
      console.error(`[${new Date().toISOString()}] Calling firecrawl.extract with args:`, JSON.stringify(args, null, 2));
      const result = await firecrawl.extract(
        args.urls as string[],
        args.prompt as string,
        args.schema as any,
        args.enableWebSearch as boolean,
        args.agent as { model: string } | undefined,
        args.timeout as number | undefined
      );
      console.error(`[${new Date().toISOString()}] firecrawl.extract returned. Sending response.`);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }
 
     case 'extract_skills': {
      try {
        console.error(`[${new Date().toISOString()}] Calling extract_skills with args:`, JSON.stringify(args, null, 2));
        const { url, skillType = 'general', saveToCatalog = true } = args;

        const schemas = {
          technical: {
            type: 'object',
            properties: {
              technologies: { type: 'array', items: { type: 'string' }, description: 'Technologies, frameworks, and tools mentioned' },
              apis: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, endpoint: { type: 'string' } } } },
              codeExamples: { type: 'array', items: { type: 'object', properties: { language: { type: 'string' }, description: { type: 'string' }, code: { type: 'string' } } } },
              bestPractices: { type: 'array', items: { type: 'string' } },
            }
          },
          product: {
            type: 'object',
            properties: {
              productName: { type: 'string' },
              features: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' } } } },
              pricing: { type: 'object', properties: { tiers: { type: 'array', items: { type: 'string' } }, details: { type: 'string' } } },
              integrations: { type: 'array', items: { type: 'string' } },
              useCases: { type: 'array', items: { type: 'string' } },
            }
          },
          solution: {
            type: 'object',
            properties: {
              problemStatement: { type: 'string' },
              solution: { type: 'string' },
              implementation: { type: 'object', properties: { steps: { type: 'array', items: { type: 'string' } }, requirements: { type: 'array', items: { type: 'string' } } } },
              benefits: { type: 'array', items: { type: 'string' } },
              limitations: { type: 'array', items: { type: 'string' } },
            }
          },
          general: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              summary: { type: 'string' },
              keyPoints: { type: 'array', items: { type: 'string' } },
              concepts: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, definition: { type: 'string' } } } },
              relatedTopics: { type: 'array', items: { type: 'string' } },
            }
          },
        };

        const schema = schemas[skillType as keyof typeof schemas] || schemas.general;
        const prompt = `Extract ${skillType} skills and knowledge from this content. Focus on practical, reusable information that can be applied to projects. Include specific details, examples, and actionable insights.`;

        console.error(`[${new Date().toISOString()}] Calling firecrawl.extract from extract_skills.`);
        const extractedData = await firecrawl.extract([url as string], prompt, schema, false);
        console.error(`[${new Date().toISOString()}] firecrawl.extract returned from extract_skills.`);
 
        if (saveToCatalog) {
        const skillName = new URL(url as string).hostname.replace(/\./g, '_');
        await skillStorage.saveSkill(
          skillName,
          extractedData,
          skillType as string
        );
      }

        console.error(`[${new Date().toISOString()}] extract_skills finished. Sending response.`);
        return { content: [{ type: 'text', text: JSON.stringify(extractedData, null, 2) }] };
      } catch (error) {
        console.error('extract_skills error:', error);
        throw error;
      }
    }
 
    case 'search_skills': {
      const results = await skillStorage.searchSkills(
        args.query as string,
        args.skillType as string,
        args.format as 'json' | 'markdown' | 'both' || 'both'
      );
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }

    case 'list_skills': {
      const skills = await skillStorage.listSkills(
        args.skillType as string,
        args.format as 'json' | 'markdown' | 'both' || 'both'
      );
      return { content: [{ type: 'text', text: JSON.stringify(skills, null, 2) }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Firecrawl server running');
}

main().catch(console.error);