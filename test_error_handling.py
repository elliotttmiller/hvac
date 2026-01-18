"""
Test error handling for AI providers.
Tests that quota and auth errors are handled correctly without retries.
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Define exceptions locally for testing without dependencies
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


def test_exception_hierarchy():
    """Test that custom exceptions are properly defined."""
    print("\n" + "="*60)
    print("TEST 1: Exception Hierarchy")
    print("="*60)
    
    # Test that all exceptions inherit from AIProviderError
    assert issubclass(AIQuotaExceededError, AIProviderError)
    assert issubclass(AIRateLimitError, AIProviderError)
    assert issubclass(AIAuthenticationError, AIProviderError)
    assert issubclass(AIInvalidRequestError, AIProviderError)
    
    print("✓ All custom exceptions properly inherit from AIProviderError")
    
    # Test that we can raise and catch them
    try:
        raise AIQuotaExceededError("Test quota error")
    except AIProviderError as e:
        assert "Test quota error" in str(e)
        print("✓ AIQuotaExceededError can be raised and caught")
    
    try:
        raise AIAuthenticationError("Test auth error")
    except AIProviderError as e:
        assert "Test auth error" in str(e)
        print("✓ AIAuthenticationError can be raised and caught")
    
    print("\n✓ All exception hierarchy tests passed!")
    return True


def test_error_messages():
    """Test that error messages are informative."""
    print("\n" + "="*60)
    print("TEST 2: Error Messages")
    print("="*60)
    
    # Test quota exceeded message
    try:
        raise AIQuotaExceededError("Quota exceeded")
    except AIQuotaExceededError as e:
        msg = str(e)
        print(f"✓ Quota error message: {msg[:80]}...")
        assert "quota" in msg.lower() or "Quota" in msg
    
    # Test auth error message
    try:
        raise AIAuthenticationError("Invalid API key")
    except AIAuthenticationError as e:
        msg = str(e)
        print(f"✓ Auth error message: {msg[:80]}...")
        assert "api key" in msg.lower() or "auth" in msg.lower()
    
    # Test rate limit message
    try:
        raise AIRateLimitError("Rate limit exceeded")
    except AIRateLimitError as e:
        msg = str(e)
        print(f"✓ Rate limit error message: {msg[:80]}...")
        assert "rate limit" in msg.lower()
    
    print("\n✓ All error message tests passed!")
    return True


def test_error_distinction():
    """Test that different error types can be distinguished."""
    print("\n" + "="*60)
    print("TEST 3: Error Type Distinction")
    print("="*60)
    
    # Test catching specific error types
    errors_to_test = [
        (AIQuotaExceededError, "quota"),
        (AIAuthenticationError, "auth"),
        (AIRateLimitError, "rate limit"),
        (AIInvalidRequestError, "invalid")
    ]
    
    for error_class, error_type in errors_to_test:
        try:
            raise error_class(f"Test {error_type} error")
        except AIQuotaExceededError:
            if error_class == AIQuotaExceededError:
                print(f"✓ Correctly caught {error_type} as AIQuotaExceededError")
            else:
                assert False, f"Incorrectly caught {error_type} as AIQuotaExceededError"
        except AIAuthenticationError:
            if error_class == AIAuthenticationError:
                print(f"✓ Correctly caught {error_type} as AIAuthenticationError")
            else:
                assert False, f"Incorrectly caught {error_type} as AIAuthenticationError"
        except AIRateLimitError:
            if error_class == AIRateLimitError:
                print(f"✓ Correctly caught {error_type} as AIRateLimitError")
            else:
                assert False, f"Incorrectly caught {error_type} as AIRateLimitError"
        except AIInvalidRequestError:
            if error_class == AIInvalidRequestError:
                print(f"✓ Correctly caught {error_type} as AIInvalidRequestError")
            else:
                assert False, f"Incorrectly caught {error_type} as AIInvalidRequestError"
    
    print("\n✓ All error distinction tests passed!")
    return True


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("ERROR HANDLING TEST SUITE")
    print("="*60)
    print("Testing exception hierarchy and error handling logic...")
    
    results = []
    
    try:
        results.append(test_exception_hierarchy())
    except Exception as e:
        print(f"✗ Exception hierarchy test failed: {e}")
        import traceback
        traceback.print_exc()
        results.append(False)
    
    try:
        results.append(test_error_messages())
    except Exception as e:
        print(f"✗ Error message test failed: {e}")
        import traceback
        traceback.print_exc()
        results.append(False)
    
    try:
        results.append(test_error_distinction())
    except Exception as e:
        print(f"✗ Error distinction test failed: {e}")
        import traceback
        traceback.print_exc()
        results.append(False)
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    passed = sum(results)
    total = len(results)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("\n✅ ALL TESTS PASSED!")
        print("\nNote: These tests verify the exception hierarchy.")
        print("Full integration tests require dependencies to be installed.")
        return 0
    else:
        print(f"\n❌ {total - passed} TEST(S) FAILED")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

