"""
AI Client abstraction layer for HVAC Analysis Backend.
Supports both Ollama (via OpenAI-compatible API) and Google Gemini.
"""
import base64
import asyncio
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI, OpenAIError
from google import genai
from google.genai import types
from backend.config import get_settings
from backend.utils import logger


# Define custom exceptions for AI provider errors
class AIProviderError(Exception):
    """Base exception for AI provider errors."""
    pass


class AIQuotaExceededError(AIProviderError):
    """Raised when API quota is exceeded."""
    pass


class AIRateLimitError(AIProviderError):
    """Raised when rate limit is hit."""
    pass


class AIAuthenticationError(AIProviderError):
    """Raised when authentication fails."""
    pass


class AIInvalidRequestError(AIProviderError):
    """Raised when request is invalid."""
    pass


class AIClient:
    """Unified AI client that works with both Ollama and Gemini."""
    
    def __init__(self):
        # Get fresh settings on each initialization
        settings = get_settings()
        self.provider = settings.ai_provider.lower()
        
        if self.provider == "ollama":
            self.client = AsyncOpenAI(
                base_url=settings.ollama_base_url,
                api_key=settings.ollama_api_key
            )
            self.model_name = settings.model_name
            logger.info(f"Initialized Ollama client with model: {self.model_name}")
            
        elif self.provider == "gemini":
            if not settings.gemini_api_key or settings.gemini_api_key == "your-gemini-api-key-here" or settings.gemini_api_key == "":
                raise ValueError("GEMINI_API_KEY must be set when using gemini provider")
            
            self.client = genai.Client(api_key=settings.gemini_api_key)
            self.model_name = settings.gemini_model
            logger.info(f"Initialized Gemini client with model: {self.model_name}")
            
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}. Use 'ollama' or 'gemini'")
    
    def _handle_gemini_error(self, error: Exception) -> None:
        """
        Convert Gemini API errors to custom exceptions for better handling.
        
        Args:
            error: The original exception from Gemini API
            
        Raises:
            AIQuotaExceededError: When quota is exceeded
            AIRateLimitError: When rate limit is hit
            AIAuthenticationError: When authentication fails
            AIInvalidRequestError: When request is invalid
            AIProviderError: For other API errors
        """
        error_str = str(error).lower()
        error_type = type(error).__name__
        
        # Check for quota exceeded (429 or ResourceExhausted)
        if "quota" in error_str or "resource" in error_str or "429" in error_str:
            raise AIQuotaExceededError(
                f"Gemini API quota exceeded. Please wait before retrying or check your quota at "
                f"https://aistudio.google.com/app/apikey. Original error: {error}"
            )
        
        # Check for rate limiting
        if "rate limit" in error_str or "too many requests" in error_str:
            raise AIRateLimitError(
                f"Gemini API rate limit exceeded. Please wait a moment before retrying. "
                f"Original error: {error}"
            )
        
        # Check for authentication errors
        if "auth" in error_str or "permission" in error_str or "401" in error_str or "403" in error_str:
            raise AIAuthenticationError(
                f"Gemini API authentication failed. Please check your API key at "
                f"https://aistudio.google.com/app/apikey. Original error: {error}"
            )
        
        # Check for invalid request
        if "invalid" in error_str or "400" in error_str or "bad request" in error_str:
            raise AIInvalidRequestError(
                f"Invalid request to Gemini API. Original error: {error}"
            )
        
        # Generic API error
        raise AIProviderError(f"Gemini API error: {error}")
    
    async def generate_with_image(
        self,
        prompt: str,
        image_data_url: str,
        max_tokens: int = 2000,
        temperature: float = 0.0,
        system_instruction: Optional[str] = None
    ) -> str:
        """
        Generate text from image and prompt.
        
        Args:
            prompt: Text prompt
            image_data_url: Image data URL (data:image/png;base64,...)
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            system_instruction: Optional system instruction
            
        Returns:
            Generated text response
        """
        if self.provider == "ollama":
            return await self._generate_ollama_with_image(
                prompt, image_data_url, max_tokens, temperature, system_instruction
            )
        elif self.provider == "gemini":
            return await self._generate_gemini_with_image(
                prompt, image_data_url, max_tokens, temperature, system_instruction
            )
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
    
    async def generate_text(
        self,
        prompt: str,
        max_tokens: int = 8000,
        temperature: float = 0.1,
        system_instruction: Optional[str] = None
    ) -> str:
        """
        Generate text from prompt.
        
        Args:
            prompt: Text prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            system_instruction: Optional system instruction
            
        Returns:
            Generated text response
        """
        if self.provider == "ollama":
            return await self._generate_ollama_text(
                prompt, max_tokens, temperature, system_instruction
            )
        elif self.provider == "gemini":
            return await self._generate_gemini_text(
                prompt, max_tokens, temperature, system_instruction
            )
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
    
    # Ollama implementation
    async def _generate_ollama_with_image(
        self,
        prompt: str,
        image_data_url: str,
        max_tokens: int,
        temperature: float,
        system_instruction: Optional[str]
    ) -> str:
        """Generate using Ollama's OpenAI-compatible API."""
        resp = await self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {"role": "user", "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": image_data_url}}
                ]}
            ],
            max_tokens=max_tokens,
            temperature=temperature
        )
        return resp.choices[0].message.content
    
    async def _generate_ollama_text(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        system_instruction: Optional[str]
    ) -> str:
        """Generate text using Ollama's OpenAI-compatible API."""
        messages = []
        if system_instruction:
            messages.append({"role": "system", "content": system_instruction})
        messages.append({"role": "user", "content": prompt})
        
        resp = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return resp.choices[0].message.content
    
    # Gemini implementation
    async def _generate_gemini_with_image(
        self,
        prompt: str,
        image_data_url: str,
        max_tokens: int,
        temperature: float,
        system_instruction: Optional[str]
    ) -> str:
        """Generate using Google Gemini API with proper error handling."""
        try:
            # Extract base64 image data and determine MIME type
            mime_type = "image/png"  # default
            if "data:" in image_data_url:
                # Extract MIME type from data URL
                header_part = image_data_url.split(",")[0]
                if ";" in header_part:
                    mime_type = header_part.split(":")[1].split(";")[0]
                _, base64_data = image_data_url.split("base64,", 1)
            else:
                base64_data = image_data_url
            
            # Decode base64 to bytes
            image_bytes = base64.b64decode(base64_data)
            
            # Build content with system instruction if provided
            full_prompt = prompt
            if system_instruction:
                full_prompt = f"{system_instruction}\n\n{prompt}"
            
            # Configure generation
            generation_config = types.GenerateContentConfig(
                max_output_tokens=max_tokens,
                temperature=temperature
            )
            
            # Create content parts: text + image
            contents = [
                types.Part.from_text(text=full_prompt),
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ]
            
            # Generate content using async executor
            loop = asyncio.get_event_loop()
            
            def _sync_generate():
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=contents,
                    config=generation_config
                )
                return response.text
            
            result = await loop.run_in_executor(None, _sync_generate)
            return result
        except Exception as e:
            # Convert to custom exception for better handling
            self._handle_gemini_error(e)
    
    async def _generate_gemini_text(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        system_instruction: Optional[str]
    ) -> str:
        """Generate text using Google Gemini API with proper error handling."""
        try:
            # Build content with system instruction if provided
            full_prompt = prompt
            if system_instruction:
                full_prompt = f"{system_instruction}\n\n{prompt}"
            
            # Configure generation
            generation_config = types.GenerateContentConfig(
                max_output_tokens=max_tokens,
                temperature=temperature
            )
            
            # Generate content using async executor
            loop = asyncio.get_event_loop()
            
            def _sync_generate():
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=full_prompt,
                    config=generation_config
                )
                return response.text
            
            result = await loop.run_in_executor(None, _sync_generate)
            return result
        except Exception as e:
            # Convert to custom exception for better handling
            self._handle_gemini_error(e)
    
    def get_model_name(self) -> str:
        """Get the current model name."""
        return self.model_name
    
    def get_provider(self) -> str:
        """Get the current provider name."""
        return self.provider


# Global AI client instance
_ai_client: Optional[AIClient] = None


def get_ai_client() -> AIClient:
    """Get or create the global AI client instance."""
    global _ai_client
    if _ai_client is None:
        _ai_client = AIClient()
    return _ai_client
