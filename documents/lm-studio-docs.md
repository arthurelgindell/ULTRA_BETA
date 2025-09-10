# lm-studio-docs

**Type:** technical
**Source:** https://lmstudio.ai/docs/app
**Extracted:** 2025-09-09T03:13:09.912Z
**Tags:** lm-studio, llm, local-ai, documentation

## Overview
LM Studio is a platform for running local Large Language Models (LLMs) like Qwen, Mistral, and others. It provides a user-friendly interface for managing models, chats, and integrations with external APIs.

## System Requirements
LM Studio supports Apple Silicon Macs, x64/ARM64 Windows PCs, and x64 Linux PCs. Minimum system requirements include sufficient RAM and storage for model weights and operations.

## Installation
**Platforms:** Local Server
**Steps:**
- Start LM Studio as a server using the command: lms server start
- Load a model using the command: lms load

## Features
### Tool Use
Enable LLMs to interact with external functions and APIs.

### Quick Start
Instructions to start LM Studio as a server and load a model.

### Supported Models
List of models that support tool use.

### Streaming
Support for streaming responses from the API.

### Download LLMs
Download and run Large Language Models like Qwen, Mistral, Gemma, or gpt-oss in LM Studio.

### Model Loader
Load a model to memory from the Chat tab.

### Chat Functionality
Engage in conversations with the loaded model.

### Structured Output
Enforce LLM response formats using JSON schemas.

### Headless Mode
Run LM Studio as a server for programmatic access.

### Idle TTL and Auto-Evict
Manage idle time-to-live and automatic eviction of models.

### Tools and Function Calling
Utilize various tools and function calling capabilities.

### Speculative Decoding
Advanced decoding techniques for improved output.

### Import Models
Import models into LM Studio.

### Per-model Defaults
Set default configurations for individual models.

### Prompt Template
Create templates for prompts to standardize requests.

### Model Context Protocol (MCP)
A protocol for defining and managing models in a standardized way.

### model.yaml
A specification for describing models and their variants in a single portable file.

### Presets
Allows users to create, import, and publish presets for models.

### API Integration
Provides REST endpoints for interacting with the models and functionalities.

### Headless Mode
Allows the application to run without a user interface.

### Structured Output
Enables structured responses from the models.

### Idle TTL and Auto-Evict
Manages idle time-to-live and automatic eviction of models.

### Speculative Decoding
A technique for improving model response times.

### Prompt Template
Allows users to define templates for prompts.

### Chat with Documents
Attach document files (.docx, .pdf, .txt) to chat sessions in LM Studio to provide additional context to LLMs.

### Retrieval-Augmented Generation (RAG)
A technique to extract relevant portions of long documents for LLMs when the document exceeds the model's context size.

### Model Context Protocol (MCP)
A protocol for managing context in LLMs.

### Structured Output
API feature that allows structured responses from LLMs.

### Headless Mode
Run the application without a graphical user interface.

### Idle TTL and Auto-Evict
Manage idle time and automatic eviction of resources.

### Speculative Decoding
A method to enhance the generation process by predicting future tokens.

### Prompt Template
Templates to standardize prompts for LLMs.

### Chat Management
Manage conversation threads with LLMs, create new chats, folders, and duplicate chats.

### Model Downloading
Download various LLMs for local use.

### Chat with Documents
Interact with documents using LLMs.

### Community Support
Engage with other users on the LM Studio Discord server.

### Model Context Protocol (MCP)
Protocol for managing model contexts.

### Presets Management
Import, publish, and manage presets.

### API Integration
Access various API functionalities including structured output and tools.

### User Interface Customization
Customize UI modes and color themes.

### Model Downloader
Built-in model downloader to download any supported model from Hugging Face.

### Model Search
Search for models by keyword or specific user/model string.

### Download Options
Multiple download options for models based on quantization techniques.

### Community Support
Access to LM Studio Discord server for discussions and support.

### Local LLM Support
Download and run local LLMs like gpt-oss or Llama, Qwen.

### Chat Interface
Use a simple and flexible chat interface.

### MCP Integration
Connect MCP servers and use them with local models.

### Search & Download
Search & download functionality via Hugging Face.

### OpenAI-like Endpoints
Serve local models on OpenAI-like endpoints, locally and on the network.

### Model Management
Manage your local models, prompts, and configurations.

## API Usage
### OpenAI Compatible API
LM Studio provides an OpenAI-like REST API for interacting with local models, allowing users to send requests and receive responses in a familiar format.

### REST API
The LM Studio REST API allows for programmatic access to LLMs, enabling functionalities such as model loading, chat management, and tool use.

## Configuration
- Set up tools in the API request to enable function calling.
- Load configuration parameters when loading a model.
- Configure server settings in the Developer tab.
- Set up model parameters in the model.yaml file.
- Adjust API settings for structured output.
- Set up model parameters in model.yaml.
- Configure API settings for integrations.
- Adjust user interface preferences.
- Set up API keys for integrations.
- Configure model settings in model.yaml.
- Configure system prompts for LLMs.
- Adjust user interface settings.
- Change the models directory in the My Models tab.
- Set preferences for model downloads and updates.
- Manage local models and prompts through the LM Studio interface.
- Configure MCP server settings if using MCP integration.

## Integrations
- OpenAI API
- Python SDK
- TS/JS SDK
- CLI Reference
- Hugging Face
- Discord
- MCP servers