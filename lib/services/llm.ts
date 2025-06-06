/**
 * LLM Service
 * 
 * This service provides functions to interact with language models through OpenRouter API.
 */

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionOptions {
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

interface ChatCompletionResponse {
  response: string;
  model: string;
}

/**
 * Generate a chat completion using OpenRouter API
 * @param options Chat completion options including messages and parameters
 * @returns The AI response and model information
 */
export async function generateChatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
  try {
    // Use Llama 3.1 as default model or get from environment variable
    const model = options.model || process.env.DEFAULT_MODEL || 'meta-llama/llama-3.1-8b-instruct';
    
    console.log('Environment variables check:');
    console.log(`- FALLBACK_MODE: ${process.env.FALLBACK_MODE}`);
    console.log(`- API KEY exists: ${!!process.env.OPENROUTER_API_KEY}`);
    console.log(`- DEFAULT_MODEL: ${process.env.DEFAULT_MODEL}`);
    
    // Check if fallback mode is enabled
    const fallbackMode = process.env.FALLBACK_MODE === 'true';
    
    // Get API key from environment variable
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    
    // If fallback mode is enabled or no API key is available, provide a fallback response
    if (fallbackMode || !apiKey) {
      console.warn(`Using fallback response mode. Fallback mode: ${fallbackMode}, API key exists: ${!!apiKey}`);
      return generateFallbackResponse(options.messages);
    }
    
    // Determine which API to use based on available keys
    const isOpenRouter = !!process.env.OPENROUTER_API_KEY;
    
    // Set up API endpoint and headers
    const endpoint = isOpenRouter 
      ? 'https://openrouter.ai/api/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(isOpenRouter && {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'AI Agent Application'
      })
    };
    
    // Prepare request body - handle differences between OpenRouter and OpenAI format
    let requestBody;
    
    if (isOpenRouter) {
      // OpenRouter specific format
      requestBody = {
        model: model,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        transforms: ["middle-out"], // OpenRouter optimization
        route: "fallback" // Ensure we get a response even if the primary model is busy
      };
      
      console.log('Using OpenRouter format with model:', model);
    } else {
      // Standard OpenAI format
      requestBody = {
        model: model,
        messages: options.messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
      };
    }
    
    // Make API request with retry logic
    let response;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount <= maxRetries) {
      try {
        console.log(`Attempt ${retryCount + 1} - Making API request to: ${endpoint}`);
        console.log(`Using model: ${model}`);
        
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));
        
        break; // If successful, exit the retry loop
      } catch (fetchError) {
        retryCount++;
        console.error(`API request attempt ${retryCount} failed:`, fetchError);
        
        if (retryCount > maxRetries) {
          throw fetchError; // Re-throw after max retries
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      }
    }
    
    if (!response || !response.ok) {
      let errorMessage = `API request failed with status ${response?.status || 'unknown'}`;
      let errorData = {};
      
      try {
        if (response) {
          const responseText = await response.text();
          try {
            errorData = JSON.parse(responseText);
            errorMessage += `: ${JSON.stringify(errorData)}`;
          } catch (parseError) {
            // Handle JSON parse error - use text content instead
            errorMessage += `: ${responseText.substring(0, 100)}`;
            console.warn('Could not parse error response as JSON:', parseError);
          }
        }
      } catch (readError) {
        console.error('Error reading error response:', readError);
      }
      
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    // Parse JSON response with error handling
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON from API response:', jsonError);
      throw new Error('Failed to parse response from AI service');
    }
    
    // Log successful response for debugging
    console.log('API response received, structure:', Object.keys(data));
    
    // Extract the response text with more robust error handling for both OpenAI and OpenRouter formats
    let responseText = '';
    let modelName = model;
    
    // Handle OpenAI/OpenRouter format
    if (data.choices && data.choices.length > 0) {
      if (data.choices[0].message) {
        responseText = data.choices[0].message.content || '';
      } else if (data.choices[0].text) {
        responseText = data.choices[0].text || '';
      }
      modelName = data.model || model;
    } 
    // Handle possible alternative formats
    else if (data.message) {
      responseText = data.message.content || data.message;
    } else if (data.output) {
      // Some providers might use different formats
      responseText = data.output;
    } else if (data.response) {
      // Direct response property
      responseText = data.response;
    }
    
    if (!responseText) {
      console.warn('API response did not contain expected content:', JSON.stringify(data).substring(0, 500));
      responseText = "I'm having trouble understanding the response from my AI provider. Please try again later.";
    } else {
      console.log('Successfully extracted response text, length:', responseText.length);
    }
    
    return {
      response: responseText,
      model: modelName
    };
    
  } catch (error) {
    console.error('Error in LLM service:', error);
    // Provide a fallback response in case of any error
    return generateFallbackResponse(options.messages);
  }
}

/**
 * Generate a fallback response when API is not available
 * @param messages The conversation messages
 * @returns A simulated AI response
 */
function generateFallbackResponse(messages: Message[]): ChatCompletionResponse {
  // Get the last user message
  const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
  const userContent = lastUserMessage?.content || '';
  
  // Generate a simple response based on the user's message
  let response = "I'm sorry, I'm currently in offline mode and can't provide a full response.";
  
  // Add some basic responses for common queries
  if (userContent.toLowerCase().includes('hello') || userContent.toLowerCase().includes('hi')) {
    response = "Hello! I'm currently running in offline mode, but I'm here to help as best I can.";
  } else if (userContent.toLowerCase().includes('help')) {
    response = "I'd like to help, but I'm currently running in offline mode. Please check your API configuration.";
  } else if (userContent.toLowerCase().includes('weather')) {
    response = "I can't check the weather right now as I'm running in offline mode.";
  } else if (userContent.toLowerCase().includes('thank')) {
    response = "You're welcome! Even though I'm in offline mode, I'm glad to assist.";
  }
  
  return {
    response,
    model: 'fallback-model'
  };
}
