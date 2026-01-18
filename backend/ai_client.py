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
        """Generate using Google Gemini API."""
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
            types.Part.from_text(full_prompt),
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
    
    async def _generate_gemini_text(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float,
        system_instruction: Optional[str]
    ) -> str:
        """Generate text using Google Gemini API."""
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
