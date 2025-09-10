[Firecrawl Docs home page![light logo](https://mintcdn.com/firecrawl/iilnMwCX-8eR1yOO/logo/logo.png?fit=max&auto=format&n=iilnMwCX-8eR1yOO&q=85&s=c45b3c967c19a39190e76fe8e9c2ed5a)![dark logo](https://mintcdn.com/firecrawl/iilnMwCX-8eR1yOO/logo/logo-dark.png?fit=max&auto=format&n=iilnMwCX-8eR1yOO&q=85&s=3fee4abe033bd3c26e8ad92043a91c17)](https://firecrawl.dev/)

v2

Search...

Ctrl KAsk AI

Search...

Navigation

Get Started

Quickstart

[Documentation](https://docs.firecrawl.dev/introduction) [SDKs](https://docs.firecrawl.dev/sdks/overview) [Learn](https://www.firecrawl.dev/blog/category/tutorials) [Integrations](https://www.firecrawl.dev/app) [API Reference](https://docs.firecrawl.dev/api-reference/v2-introduction)

[Playground](https://firecrawl.dev/playground)
[Blog](https://firecrawl.dev/blog)
[Community](https://discord.gg/gSmWdAkdwd)
[Changelog](https://firecrawl.dev/changelog)

##### Get Started

- [Quickstart](https://docs.firecrawl.dev/introduction)
- [MCP Server](https://docs.firecrawl.dev/mcp-server)
- [Migrating from v1 to v2](https://docs.firecrawl.dev/migrate-to-v2)
- [Rate Limits](https://docs.firecrawl.dev/rate-limits)
- [Advanced Scraping Guide](https://docs.firecrawl.dev/advanced-scraping-guide)

##### Standard Features

- Scrape

- [Search](https://docs.firecrawl.dev/features/search)
- [Map](https://docs.firecrawl.dev/features/map)
- Crawl


##### Agentic Features

- [Extract](https://docs.firecrawl.dev/features/extract)

##### Webhooks

- [Overview](https://docs.firecrawl.dev/webhooks/overview)
- [Event Types](https://docs.firecrawl.dev/webhooks/events)
- [Security](https://docs.firecrawl.dev/webhooks/security)
- [Testing & Debugging](https://docs.firecrawl.dev/webhooks/testing)

##### Use Cases

- [Overview](https://docs.firecrawl.dev/use-cases/overview)
- [AI Platforms](https://docs.firecrawl.dev/use-cases/ai-platforms)
- [Lead Enrichment](https://docs.firecrawl.dev/use-cases/lead-enrichment)
- [SEO Platforms](https://docs.firecrawl.dev/use-cases/seo-platforms)
- [Deep Research](https://docs.firecrawl.dev/use-cases/deep-research)
- View more


##### Contributing

- [Open Source vs Cloud](https://docs.firecrawl.dev/contributing/open-source-or-cloud)
- [Running locally](https://docs.firecrawl.dev/contributing/guide)
- [Self-hosting](https://docs.firecrawl.dev/contributing/self-host)

On this page

- [Welcome to Firecrawl](https://docs.firecrawl.dev/introduction#welcome-to-firecrawl)
- [How to use it?](https://docs.firecrawl.dev/introduction#how-to-use-it%3F)
- [API Key](https://docs.firecrawl.dev/introduction#api-key)
- [Features](https://docs.firecrawl.dev/introduction#features)
- [Powerful Capabilities](https://docs.firecrawl.dev/introduction#powerful-capabilities)
- [Installing Firecrawl](https://docs.firecrawl.dev/introduction#installing-firecrawl)
- [Scraping](https://docs.firecrawl.dev/introduction#scraping)
- [Response](https://docs.firecrawl.dev/introduction#response)
- [Crawling](https://docs.firecrawl.dev/introduction#crawling)
- [Usage](https://docs.firecrawl.dev/introduction#usage)
- [Get Crawl Status](https://docs.firecrawl.dev/introduction#get-crawl-status)
- [Response](https://docs.firecrawl.dev/introduction#response-2)
- [JSON mode](https://docs.firecrawl.dev/introduction#json-mode)
- [Search](https://docs.firecrawl.dev/introduction#search)
- [Response](https://docs.firecrawl.dev/introduction#response-3)
- [Extracting without schema](https://docs.firecrawl.dev/introduction#extracting-without-schema)
- [Interacting with the page with Actions](https://docs.firecrawl.dev/introduction#interacting-with-the-page-with-actions)
- [Example](https://docs.firecrawl.dev/introduction#example)
- [Output](https://docs.firecrawl.dev/introduction#output)
- [Open Source vs Cloud](https://docs.firecrawl.dev/introduction#open-source-vs-cloud)
- [Contributing](https://docs.firecrawl.dev/introduction#contributing)

![Hero Light](https://mintcdn.com/firecrawl/vlKm1oZYK3oSRVTM/images/turn-websites-into-llm-ready-data--firecrawl.png?fit=max&auto=format&n=vlKm1oZYK3oSRVTM&q=85&s=4e7b593752a4ff638c1d1dbfddb54a9a)

## [​](https://docs.firecrawl.dev/introduction\#welcome-to-firecrawl)  Welcome to Firecrawl

[Firecrawl](https://firecrawl.dev/?ref=github) is an API service that takes a URL, crawls it, and converts it into clean markdown. We crawl all accessible subpages and give you clean markdown for each. No sitemap required.

## [​](https://docs.firecrawl.dev/introduction\#how-to-use-it%3F)  How to use it?

We provide an easy to use API with our hosted version. You can find the playground and documentation [here](https://firecrawl.dev/playground). You can also self host the backend if you’d like.Check out the following resources to get started:

- [x] **API**: [Documentation](https://docs.firecrawl.dev/api-reference/introduction)
- [x] **SDKs**: [Python](https://docs.firecrawl.dev/sdks/python), [Node](https://docs.firecrawl.dev/sdks/node)
- [x] **LLM Frameworks**: [Langchain (python)](https://python.langchain.com/docs/integrations/document_loaders/firecrawl/), [Langchain (js)](https://js.langchain.com/docs/integrations/document_loaders/web_loaders/firecrawl), [Llama Index](https://docs.llamaindex.ai/en/latest/examples/data_connectors/WebPageDemo/#using-firecrawl-reader), [Crew.ai](https://docs.crewai.com/), [Composio](https://composio.dev/tools/firecrawl/all), [PraisonAI](https://docs.praison.ai/firecrawl/), [Superinterface](https://superinterface.ai/docs/assistants/functions/firecrawl), [Vectorize](https://docs.vectorize.io/integrations/source-connectors/firecrawl)
- [x] **Low-code Frameworks**: [Dify](https://dify.ai/blog/dify-ai-blog-integrated-with-firecrawl), [Langflow](https://docs.langflow.org/), [Flowise AI](https://docs.flowiseai.com/integrations/langchain/document-loaders/firecrawl), [Cargo](https://docs.getcargo.io/integration/firecrawl), [Pipedream](https://pipedream.com/apps/firecrawl/)
- [x] **Community SDKs**: [Go](https://docs.firecrawl.dev/sdks/go), [Rust](https://docs.firecrawl.dev/sdks/rust) (v1)
- [x] **Others**: [Zapier](https://zapier.com/apps/firecrawl/integrations), [Pabbly Connect](https://www.pabbly.com/connect/integrations/firecrawl/)
- [ ]  Want an SDK or Integration? Let us know by opening an issue.

**Self-host:** To self-host refer to guide [here](https://docs.firecrawl.dev/contributing/self-host).

### [​](https://docs.firecrawl.dev/introduction\#api-key)  API Key

To use the API, you need to sign up on [Firecrawl](https://firecrawl.dev/) and get an API key.

### [​](https://docs.firecrawl.dev/introduction\#features)  Features

- [**Scrape**](https://docs.firecrawl.dev/introduction#scraping): scrapes a URL and get its content in LLM-ready format (markdown, summary, structured data via [json mode](https://docs.firecrawl.dev/introduction#json-mode), screenshot, html)
- [**Crawl**](https://docs.firecrawl.dev/introduction#crawling): scrapes all the URLs of a web page and return content in LLM-ready format
- [**Map**](https://docs.firecrawl.dev/features/map): input a website and get all the website urls - extremely fast
- [**Search**](https://docs.firecrawl.dev/features/search): search the web and get full content from results
- [**Extract**](https://docs.firecrawl.dev/features/extract): get structured data from single page, multiple pages or entire websites with AI.

### [​](https://docs.firecrawl.dev/introduction\#powerful-capabilities)  Powerful Capabilities

- **LLM-ready formats**: markdown, summary, structured data, screenshot, HTML, links, metadata
- **The hard stuff**: proxies, anti-bot mechanisms, dynamic content (js-rendered), output parsing, orchestration
- **Lightning fast**: Get results in seconds—built for speed and high-throughput use cases.
- **Customizability**: exclude tags, crawl behind auth walls with custom headers, max crawl depth, etc…
- **Media parsing**: pdfs, docx, images.
- **Reliability first**: designed to get the data you need - no matter how hard it is.
- **Actions**: click, scroll, input, wait and more before extracting data

You can find all of Firecrawl’s capabilities and how to use them in our [documentation](https://docs.firecrawl.dev/api-reference/v2-introduction)

## [​](https://docs.firecrawl.dev/introduction\#installing-firecrawl)  Installing Firecrawl

Python

Node

Copy

Ask AI

```
# pip install firecrawl-py

from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

```

## [​](https://docs.firecrawl.dev/introduction\#scraping)  Scraping

To scrape a single URL, use the `scrape` method. It takes the URL as a parameter and returns the scraped data as a dictionary.

Python

Node

cURL

Copy

Ask AI

```
from firecrawl import Firecrawl

firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")

# Scrape a website:
doc = firecrawl.scrape("https://firecrawl.dev", formats=["markdown", "html"])
print(doc)

```

### [​](https://docs.firecrawl.dev/introduction\#response)  Response

SDKs will return the data object directly. cURL will return the payload exactly as shown below.

Copy

Ask AI

```
{
  "success": true,
  "data" : {
    "markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",\
    "html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"__variable_36bd41 __variable_d7dc5d font-inter ...",\
    "metadata": {\
      "title": "Home - Firecrawl",\
      "description": "Firecrawl crawls and converts any website into clean markdown.",\
      "language": "en",\
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",\
      "robots": "follow, index",\
      "ogTitle": "Firecrawl",\
      "ogDescription": "Turn any website into LLM-ready data.",\
      "ogUrl": "https://www.firecrawl.dev/",\
      "ogImage": "https://www.firecrawl.dev/og.png?123",\
      "ogLocaleAlternate": [],\
      "ogSiteName": "Firecrawl",\
      "sourceURL": "https://firecrawl.dev",\
      "statusCode": 200\
    }\
  }\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#crawling)  Crawling\
\
The crawl feature allows you to automatically discover and extract content from a URL and all of its accessible subpages. With our SDKs, simply call the crawl method—this will submit a crawl job, wait for it to finish, and return the complete results for the entire site.\
\
### [​](https://docs.firecrawl.dev/introduction\#usage)  Usage\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
Ask AI\
\
```\
from firecrawl import Firecrawl\
\
firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")\
\
docs = firecrawl.crawl(url="https://docs.firecrawl.dev", limit=10)\
print(docs)\
\
```\
\
If you’re using our API directly, cURL or `start crawl` functions on SDKs, this will return an `ID` where you can use to check the status of the crawl.\
\
Copy\
\
Ask AI\
\
```\
{\
  "success": true,\
  "id": "123-456-789",\
  "url": "https://api.firecrawl.dev/v2/crawl/123-456-789"\
}\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#get-crawl-status)  Get Crawl Status\
\
Used to check the status of a crawl job and get its result.\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
Ask AI\
\
```\
status = firecrawl.get_crawl_status("<crawl-id>")\
print(status)\
\
```\
\
#### [​](https://docs.firecrawl.dev/introduction\#response-2)  Response\
\
The response will be different depending on the status of the crawl. For not completed or large responses exceeding 10MB, a `next` URL parameter is provided. You must request this URL to retrieve the next 10MB of data. If the `next` parameter is absent, it indicates the end of the crawl data.\
\
Scraping\
\
Completed\
\
Copy\
\
Ask AI\
\
```\
{\
  "status": "scraping",\
  "total": 36,\
  "completed": 10,\
  "creditsUsed": 10,\
  "expiresAt": "2024-00-00T00:00:00.000Z",\
  "next": "https://api.firecrawl.dev/v2/crawl/123-456-789?skip=10",\
  "data": [\
    {\
      "markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",\
      "html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",\
      "metadata": {\
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",\
        "language": "en",\
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",\
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",\
        "ogLocaleAlternate": [],\
        "statusCode": 200\
      }\
    },\
    ...\
  ]\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#json-mode)  JSON mode\
\
With JSON mode, you can easily extract structured data from any URL. We support pydantic schemas to make it easier for you too. Here is how you to use it:\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
Ask AI\
\
```\
from firecrawl import Firecrawl\
from pydantic import BaseModel\
app = Firecrawl(api_key="fc-YOUR-API-KEY")\
\
class JsonSchema(BaseModel):\
    company_mission: str\
    supports_sso: bool\
    is_open_source: bool\
    is_in_yc: bool\
\
result = app.scrape(\
    'https://firecrawl.dev',\
    formats=[{\
      "type": "json",\
      "schema": JsonSchema\
    }],\
    only_main_content=False,\
    timeout=120000\
)\
\
print(result)\
\
```\
\
Output:\
\
JSON\
\
Copy\
\
Ask AI\
\
```\
{\
    "success": true,\
    "data": {\
      "json": {\
        "company_mission": "AI-powered web scraping and data extraction",\
        "supports_sso": true,\
        "is_open_source": true,\
        "is_in_yc": true\
      },\
      "metadata": {\
        "title": "Firecrawl",\
        "description": "AI-powered web scraping and data extraction",\
        "robots": "follow, index",\
        "ogTitle": "Firecrawl",\
        "ogDescription": "AI-powered web scraping and data extraction",\
        "ogUrl": "https://firecrawl.dev/",\
        "ogImage": "https://firecrawl.dev/og.png",\
        "ogLocaleAlternate": [],\
        "ogSiteName": "Firecrawl",\
        "sourceURL": "https://firecrawl.dev/"\
      },\
    }\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#search)  Search\
\
Firecrawl’s search API allows you to perform web searches and optionally scrape the search results in one operation.\
\
- Choose specific output formats (markdown, HTML, links, screenshots)\
- Choose specific sources (web, news, images)\
- Search the web with customizable parameters (location, etc.)\
\
For details, see the [Search Endpoint API Reference](https://docs.firecrawl.dev/api-reference/endpoint/search).\
\
Python\
\
Node\
\
Copy\
\
Ask AI\
\
```\
from firecrawl import Firecrawl\
\
firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")\
\
results = firecrawl.search(\
    query="firecrawl",\
    limit=3,\
)\
print(results)\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#response-3)  Response\
\
SDKs will return the data object directly. cURL will return the complete payload.\
\
JSON\
\
Copy\
\
Ask AI\
\
```\
{\
  "success": true,\
  "data": {\
    "web": [\
      {\
        "url": "https://www.firecrawl.dev/",\
        "title": "Firecrawl - The Web Data API for AI",\
        "description": "The web crawling, scraping, and search API for AI. Built for scale. Firecrawl delivers the entire internet to AI agents and builders.",\
        "position": 1\
      },\
      {\
        "url": "https://github.com/mendableai/firecrawl",\
        "title": "mendableai/firecrawl: Turn entire websites into LLM-ready ... - GitHub",\
        "description": "Firecrawl is an API service that takes a URL, crawls it, and converts it into clean markdown or structured data.",\
        "position": 2\
      },\
      ...\
    ],\
    "images": [\
      {\
        "title": "Quickstart | Firecrawl",\
        "imageUrl": "https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/logo/logo.png",\
        "imageWidth": 5814,\
        "imageHeight": 1200,\
        "url": "https://docs.firecrawl.dev/",\
        "position": 1\
      },\
      ...\
    ],\
    "news": [\
      {\
        "title": "Y Combinator startup Firecrawl is ready to pay $1M to hire three AI agents as employees",\
        "url": "https://techcrunch.com/2025/05/17/y-combinator-startup-firecrawl-is-ready-to-pay-1m-to-hire-three-ai-agents-as-employees/",\
        "snippet": "It's now placed three new ads on YC's job board for “AI agents only” and has set aside a $1 million budget total to make it happen.",\
        "date": "3 months ago",\
        "position": 1\
      },\
      ...\
    ]\
  }\
}\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#extracting-without-schema)  Extracting without schema\
\
You can now extract without a schema by just passing a `prompt` to the endpoint. The llm chooses the structure of the data.\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
Ask AI\
\
```\
from firecrawl import Firecrawl\
\
app = Firecrawl(api_key="fc-YOUR-API-KEY")\
\
result = app.scrape(\
    'https://firecrawl.dev',\
    formats=[{\
      "type": "json",\
      "prompt": "Extract the company mission from the page."\
    }],\
    only_main_content=False,\
    timeout=120000\
)\
\
print(result)\
\
```\
\
Output:\
\
JSON\
\
Copy\
\
Ask AI\
\
```\
{\
    "success": true,\
    "data": {\
      "json": {\
        "company_mission": "AI-powered web scraping and data extraction",\
      },\
      "metadata": {\
        "title": "Firecrawl",\
        "description": "AI-powered web scraping and data extraction",\
        "robots": "follow, index",\
        "ogTitle": "Firecrawl",\
        "ogDescription": "AI-powered web scraping and data extraction",\
        "ogUrl": "https://firecrawl.dev/",\
        "ogImage": "https://firecrawl.dev/og.png",\
        "ogLocaleAlternate": [],\
        "ogSiteName": "Firecrawl",\
        "sourceURL": "https://firecrawl.dev/"\
      },\
    }\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#interacting-with-the-page-with-actions)  Interacting with the page with Actions\
\
Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.Here is an example of how to use actions to navigate to google.com, search for Firecrawl, click on the first result, and take a screenshot.It is important to almost always use the `wait` action before/after executing other actions to give enough time for the page to load.\
\
### [​](https://docs.firecrawl.dev/introduction\#example)  Example\
\
Python\
\
Node\
\
cURL\
\
Copy\
\
Ask AI\
\
```\
from firecrawl import Firecrawl\
\
firecrawl = Firecrawl(api_key="fc-YOUR-API-KEY")\
\
doc = firecrawl.scrape('https://example.com/login', {\
  formats=['markdown'],\
  actions=[\
    { type: 'write', text: 'john@example.com' },\
    { type: 'press', key: 'Tab' },\
    { type: 'write', text: 'secret' },\
    { type: 'click', selector: 'button[type="submit"]' },\
    { type: 'wait', milliseconds: 1500 },\
    { type: 'screenshot', fullPage: true },\
  ],\
});\
\
print(doc.markdown, doc.screenshot);\
\
```\
\
### [​](https://docs.firecrawl.dev/introduction\#output)  Output\
\
JSON\
\
Copy\
\
Ask AI\
\
```\
{\
  "success": true,\
  "data": {\
    "markdown": "Our first Launch Week is over! [See the recap 🚀](blog/firecrawl-launch-week-1-recap)...",\
    "actions": {\
      "screenshots": [\
        "https://alttmdsdujxrfnakrkyi.supabase.co/storage/v1/object/public/media/screenshot-75ef2d87-31e0-4349-a478-fb432a29e241.png"\
      ],\
      "scrapes": [\
        {\
          "url": "https://www.firecrawl.dev/",\
          "html": "<html><body><h1>Firecrawl</h1></body></html>"\
        }\
      ]\
    },\
    "metadata": {\
      "title": "Home - Firecrawl",\
      "description": "Firecrawl crawls and converts any website into clean markdown.",\
      "language": "en",\
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",\
      "robots": "follow, index",\
      "ogTitle": "Firecrawl",\
      "ogDescription": "Turn any website into LLM-ready data.",\
      "ogUrl": "https://www.firecrawl.dev/",\
      "ogImage": "https://www.firecrawl.dev/og.png?123",\
      "ogLocaleAlternate": [],\
      "ogSiteName": "Firecrawl",\
      "sourceURL": "http://google.com",\
      "statusCode": 200\
    }\
  }\
}\
\
```\
\
## [​](https://docs.firecrawl.dev/introduction\#open-source-vs-cloud)  Open Source vs Cloud\
\
Firecrawl is open source available under the [AGPL-3.0 license](https://github.com/mendableai/firecrawl/blob/main/LICENSE).To deliver the best possible product, we offer a hosted version of Firecrawl alongside our open-source offering. The cloud solution allows us to continuously innovate and maintain a high-quality, sustainable service for all users.Firecrawl Cloud is available at [firecrawl.dev](https://firecrawl.dev/) and offers a range of features that are not available in the open source version:![Firecrawl Cloud vs Open Source](https://mintcdn.com/firecrawl/vlKm1oZYK3oSRVTM/images/open-source-cloud.png?fit=max&auto=format&n=vlKm1oZYK3oSRVTM&q=85&s=763a6e92c8605d06294ed7ed45df85d0)\
\
## [​](https://docs.firecrawl.dev/introduction\#contributing)  Contributing\
\
We love contributions! Please read our [contributing guide](https://github.com/mendableai/firecrawl/blob/main/CONTRIBUTING.md) before submitting a pull request.\
\
[Suggest edits](https://github.com/firecrawl/firecrawl-docs/edit/main/introduction.mdx) [Raise issue](https://github.com/firecrawl/firecrawl-docs/issues/new?title=Issue%20on%20docs&body=Path:%20/introduction)\
\
[Firecrawl MCP Server\\
\\
Next](https://docs.firecrawl.dev/mcp-server)\
\
Assistant\
\
Responses are generated using AI and may contain mistakes.\
\
![Hero Light](https://mintcdn.com/firecrawl/vlKm1oZYK3oSRVTM/images/turn-websites-into-llm-ready-data--firecrawl.png?w=840&fit=max&auto=format&n=vlKm1oZYK3oSRVTM&q=85&s=060bf67f6a5b76002c4b416b165d0dce)\
\
![Firecrawl Cloud vs Open Source](https://mintcdn.com/firecrawl/vlKm1oZYK3oSRVTM/images/open-source-cloud.png?w=840&fit=max&auto=format&n=vlKm1oZYK3oSRVTM&q=85&s=e766290156ea4226df484ee815f5036f)