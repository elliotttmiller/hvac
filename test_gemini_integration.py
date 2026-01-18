"""
Test script for Gemini integration.
Tests both Ollama and Gemini providers with the AI client abstraction.
"""
import os
import sys
import asyncio
import base64

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.ai_client import AIClient
from backend.config import get_settings


async def test_ollama_provider():
    """Test Ollama provider initialization and basic functionality."""
    print("\n" + "="*60)
    print("TEST 1: Ollama Provider")
    print("="*60)
    
    # Ensure we're using Ollama
    os.environ['AI_PROVIDER'] = 'ollama'
    
    # Force reload of settings
    from importlib import reload
    from backend import config
    reload(config)
    
    # Reset global client
    from backend import ai_client
    ai_client._ai_client = None
    
    try:
        client = AIClient()
        print(f"✓ Ollama client initialized")
        print(f"  Provider: {client.get_provider()}")
        print(f"  Model: {client.get_model_name()}")
        assert client.get_provider() == "ollama"
        assert client.get_model_name() == "qwen2.5vl"
        print("\n✓ All Ollama tests passed!")
        return True
    except Exception as e:
        print(f"✗ Ollama test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_gemini_provider_validation():
    """Test that Gemini provider requires API key."""
    print("\n" + "="*60)
    print("TEST 2: Gemini Provider Validation")
    print("="*60)
    
    # Test with missing API key
    os.environ['AI_PROVIDER'] = 'gemini'
    os.environ['GEMINI_API_KEY'] = ''
    
    # Force reload of settings
    from importlib import reload
    from backend import config
    reload(config)
    
    # Reset global client
    from backend import ai_client
    ai_client._ai_client = None
    
    try:
        client = AIClient()
        print("✗ Should have rejected empty API key")
        return False
    except ValueError as e:
        print(f"✓ Correctly rejected empty API key: {e}")
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test with placeholder API key
    os.environ['GEMINI_API_KEY'] = 'your-gemini-api-key-here'
    
    # Force reload of settings
    from importlib import reload
    from backend import config
    reload(config)
    
    # Reset global client
    from backend import ai_client
    ai_client._ai_client = None
    
    try:
        client = AIClient()
        print("✗ Should have rejected placeholder API key")
        return False
    except ValueError as e:
        print(f"✓ Correctly rejected placeholder API key: {e}")
        print("\n✓ All Gemini validation tests passed!")
        return True
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_gemini_provider_with_api_key():
    """Test Gemini provider with a valid API key format (mock)."""
    print("\n" + "="*60)
    print("TEST 3: Gemini Provider Initialization")
    print("="*60)
    
    # Use a fake but valid-looking API key
    # Note: This won't actually work for API calls, but will test initialization
    os.environ['AI_PROVIDER'] = 'gemini'
    os.environ['GEMINI_API_KEY'] = 'AIzaSyDummyKeyForTesting123456789'
    os.environ['GEMINI_MODEL'] = 'gemini-2.0-flash-exp'
    
    # Force reload of settings
    from importlib import reload
    from backend import config
    reload(config)
    
    # Reset global client
    from backend import ai_client
    ai_client._ai_client = None
    
    try:
        client = AIClient()
        print(f"✓ Gemini client initialized")
        print(f"  Provider: {client.get_provider()}")
        print(f"  Model: {client.get_model_name()}")
        assert client.get_provider() == "gemini"
        assert client.get_model_name() == "gemini-2.0-flash-exp"
        print("\n✓ Gemini initialization test passed!")
        print("  Note: API calls would require a real API key")
        return True
    except Exception as e:
        print(f"✗ Gemini initialization failed: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_provider_switching():
    """Test switching between providers."""
    print("\n" + "="*60)
    print("TEST 4: Provider Switching")
    print("="*60)
    
    results = []
    
    # Test Ollama
    os.environ['AI_PROVIDER'] = 'ollama'
    from importlib import reload
    from backend import config, ai_client
    reload(config)
    ai_client._ai_client = None
    
    try:
        client1 = AIClient()
        assert client1.get_provider() == "ollama"
        print(f"✓ Successfully initialized Ollama: {client1.get_model_name()}")
        results.append(True)
    except Exception as e:
        print(f"✗ Ollama switch failed: {e}")
        results.append(False)
    
    # Test Gemini
    os.environ['AI_PROVIDER'] = 'gemini'
    os.environ['GEMINI_API_KEY'] = 'AIzaSyDummyKeyForTesting123456789'
    reload(config)
    ai_client._ai_client = None
    
    try:
        client2 = AIClient()
        assert client2.get_provider() == "gemini"
        print(f"✓ Successfully switched to Gemini: {client2.get_model_name()}")
        results.append(True)
    except Exception as e:
        print(f"✗ Gemini switch failed: {e}")
        results.append(False)
    
    if all(results):
        print("\n✓ Provider switching test passed!")
        return True
    else:
        print("\n✗ Provider switching test failed")
        return False


async def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("GEMINI INTEGRATION TEST SUITE")
    print("="*60)
    
    results = []
    
    # Run tests
    results.append(await test_ollama_provider())
    results.append(await test_gemini_provider_validation())
    results.append(await test_gemini_provider_with_api_key())
    results.append(await test_provider_switching())
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    passed = sum(results)
    total = len(results)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("\n✅ ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n❌ {total - passed} TEST(S) FAILED")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
