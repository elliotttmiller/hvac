"""
AI Client abstraction layer for HVAC Analysis Backend.
Supports both Ollama (via OpenAI-compatible API) and Google Gemini.
"""
import base64
from typing import List, Dict, Any, Optional
from openai import AsyncOpenAI, OpenAIError
import google.generativeai as genai
from backend.config import get_settings
from backend.utils import logger

settings = get_settings()


class AIClient:
    """Unified AI client that works with both Ollama and Gemini."""
    
    def __init__(self):
        self.provider = settings.ai_provider.lower()
        
        if self.provider == "ollama":
            self.client = AsyncOpenAI(
                base_url=settings.ollama_base_url,
                api_key=settings.ollama_api_key
            )
            self.model_name = settings.model_name
            logger.info(f"Initialized Ollama client with model: {self.model_name}")
            
        elif self.provider == "gemini":
            if not settings.gemini_api_key or settings.gemini_api_key == "your-gemini-api-key-here":
                raise ValueError("GEMINI_API_KEY must be set when using gemini provider")
            
            genai.configure(api_key=settings.gemini_api_key)
            self.model_name = settings.gemini_model
            self.client = genai.GenerativeModel(self.model_name)
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
        # Extract base64 image data
        if "base64," in image_data_url:
            _, base64_data = image_data_url.split("base64,", 1)
        else:
            base64_data = image_data_url
        
        # Decode base64 to bytes
        image_bytes = base64.b64decode(base64_data)
        
        # Create image part for Gemini
        image_part = {
            "mime_type": "image/png",
            "data": image_bytes
        }
        
        # Build content with system instruction if provided
        full_prompt = prompt
        if system_instruction:
            full_prompt = f"{system_instruction}\n\n{prompt}"
        
        # Configure generation
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=max_tokens,
            temperature=temperature
        )
        
        # Generate content
        # Gemini SDK doesn't have native async support for generate_content yet
        # So we'll use the sync version (it's fast enough for our use case)
        import asyncio
        loop = asyncio.get_event_loop()
        
        def _sync_generate():
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(
                [full_prompt, image_part],
                generation_config=generation_config
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
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=max_tokens,
            temperature=temperature
        )
        
        # Generate content
        import asyncio
        loop = asyncio.get_event_loop()
        
        def _sync_generate():
            model = genai.GenerativeModel(self.model_name)
            response = model.generate_content(
                full_prompt,
                generation_config=generation_config
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
