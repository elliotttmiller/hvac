"""
Configuration management for HVAC Analysis Backend.
Centralizes all environment variables and settings.
"""
import os
from pathlib import Path
from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    # Pydantic v2 configuration: allow extra env vars (e.g., VITE_*) and
    # configure env file selection at the class level to avoid using the
    # legacy inner Config class which conflicts with model_config.
    model_config = {
        # Do not raise on unknown env vars (e.g., VITE_*). We choose 'ignore'
        # so unknown keys are dropped silently (safer than 'allow').
        "extra": "ignore",
        "env_file": ".env.local" if Path(".env.local").exists() else ".env",
        "env_prefix": "",
        "case_sensitive": False,
    }
    
    # Server Configuration
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")
    debug: bool = Field(default=False, description="Debug mode")
    
    # Ollama Configuration
    ollama_base_url: str = Field(
        default="http://localhost:11434/v1",
        description="Ollama API base URL"
    )
    ollama_api_key: str = Field(
        default="ollama",
        description="Ollama API key (dummy for local)"
    )
    model_name: str = Field(
        default="qwen2.5vl",
        description="Vision-language model name"
    )
    
    # Processing Limits
    max_pages_default: int = Field(
        default=20,
        ge=1,
        le=50,
        description="Default maximum pages to process"
    )
    max_file_size_mb: int = Field(
        default=50,
        ge=1,
        le=200,
        description="Maximum upload file size in MB"
    )
    api_timeout: int = Field(
        default=300,
        ge=30,
        le=600,
        description="Global API timeout in seconds"
    )
    
    # Inference Parameters
    extraction_temperature: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Temperature for extraction phase"
    )
    reasoning_temperature: float = Field(
        default=0.1,
        ge=0.0,
        le=1.0,
        description="Temperature for reasoning phase"
    )
    extraction_max_tokens: int = Field(
        default=2000,
        ge=100,
        le=4096,
        description="Max tokens for extraction (increased for detailed extraction)"
    )
    context_window_max_tokens: int = Field(
        default=28000,
        ge=1000,
        le=128000,
        description="Maximum context window tokens"
    )
    
    # PDF Rendering
    pdf_zoom_factor: float = Field(
        default=2.0,
        ge=1.0,
        le=4.0,
        description="PDF to image zoom factor (higher = better quality but larger size)"
    )
    
    # Retry Configuration
    max_retries: int = Field(
        default=2,
        ge=0,
        le=5,
        description="Maximum retry attempts for failed operations"
    )
    retry_initial_delay: float = Field(
        default=2.0,
        ge=0.5,
        le=10.0,
        description="Initial retry delay in seconds"
    )
    retry_backoff_factor: float = Field(
        default=2.0,
        ge=1.0,
        le=5.0,
        description="Backoff multiplier for retries"
    )
    
    # Paths
    upload_dir: str = Field(
        default="backend/uploads",
        description="Upload directory path"
    )
    data_dir: str = Field(
        default="backend/data",
        description="Data directory path"
    )
    
    # CORS - store raw string from env then expose a parsed property
    cors_origins_raw: str = Field(
        default="*",
        description="Raw CORS origins (comma-separated or JSON array)."
    )

    @property
    def cors_origins(self) -> list[str]:
        """Return a list[str] for CORS from the raw env value.

        Accepts:
        - '*' -> ['*']
        - JSON array string -> parsed list
        - comma-separated string -> split list
        - a JSON-encoded list is also handled
        """
        v = self.cors_origins_raw
        if isinstance(v, list):
            return [str(x) for x in v]
        s = (v or "").strip()
        if s == "*":
            return ["*"]
        if s.startswith("[") and s.endswith("]"):
            try:
                import json
                parsed = json.loads(s)
                return [str(x) for x in parsed]
            except Exception:
                pass
        # comma-separated fallback
        return [x.strip() for x in s.split(",") if x.strip()]
    
    # Logging
    log_level: str = Field(
        default="INFO",
        description="Logging level (DEBUG, INFO, WARNING, ERROR)"
    )
    
    # Note: model_config is used above to configure env loading and extra
    # behavior for pydantic v2. No inner Config class is needed.


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings singleton."""
    return settings
