import FirecrawlApp from '@mendable/firecrawl-js';

export class FirecrawlServiceV2 {
  private app: FirecrawlApp;

  constructor(apiKey: string) {
    this.app = new FirecrawlApp({ apiKey });
  }

  async extract(urls: string[], prompt: string, schema: any, enableWebSearch: boolean, agent?: { model: string }, timeout?: number) {
    try {
      console.error(`[${new Date().toISOString()}] Firecrawl extract starting...`);
      
      const params: any = {
        prompt: prompt,
        schema: schema,
        enableWebSearch: enableWebSearch,
        timeout: timeout
      };
      
      if (agent) params.agent = agent;
      
      console.error(`[${new Date().toISOString()}] Calling Firecrawl SDK with URLs: ${urls.join(', ')}`);
      const result = await this.app.extract(urls, params);
      console.error(`[${new Date().toISOString()}] Firecrawl SDK call returned.`);
      
      console.error(`[${new Date().toISOString()}] Firecrawl API response success: ${result.success}`);
      
      if (!result) {
        throw new Error('Firecrawl extraction failed: No response received');
      }
      
      if ('error' in result && result.error) {
        console.error('Firecrawl API error:', result.error);
        throw new Error(`Firecrawl extraction failed: ${result.error}`);
      }
      
      if (!result.success && 'error' in result) {
        throw new Error(`Firecrawl extraction failed: ${result.error || 'Unknown error'}`);
      }
      
      return result.data || result;
    } catch (error: any) {
      console.error(`[${new Date().toISOString()}] Firecrawl extract error:`, error);
      if (error?.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }
}
