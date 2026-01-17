# Test Logs: Action Items Checklist

This document provides a prioritized, actionable checklist based on the test logs audit.

---

## 🔴 Critical (Complete This Week)

### 1. Model Performance Optimization
- [ ] **Switch to smaller quantization model**
  - Current: `qwen2.5vl:Q4_K_M`
  - Target: `qwen2.5vl:Q4_0` or `qwen2.5vl:Q3_K_M`
  - Expected improvement: 91s → 30s load time
  - Files to modify: `backend/config.py`
  
  ```python
  # In backend/config.py
  OLLAMA_MODEL = "qwen2.5vl:q4_0"  # Change from default
  ```

- [ ] **Increase model keep-alive time**
  - Current: 5 minutes
  - Target: 30 minutes (dev) / 15 minutes (prod)
  - Files to modify: `.env.example`, startup configuration
  
  ```bash
  # In .env or environment
  OLLAMA_KEEP_ALIVE=30m
  ```

### 2. User Experience
- [ ] **Add model loading progress indicator**
  - Add frontend loading state with progress
  - Display estimated time: "Loading AI model (1-2 minutes)..."
  - Show progress if possible from Ollama API
  - Files to modify: Frontend components, Backend API
  
- [ ] **Implement model preloading**
  - Load model on application startup (not first request)
  - Add startup script that warms model
  - Files to modify: `start.py`, `backend/server.py`
  
  ```python
  # In backend/server.py startup event
  @app.on_event("startup")
  async def preload_model():
      logger.info("Preloading AI model...")
      await ollama_client.generate(model=OLLAMA_MODEL, prompt="test", max_tokens=1)
      logger.info("Model preloaded and ready")
  ```

### 3. Security & Privacy
- [ ] **Sanitize filesystem paths in logs**
  - Current: `D:\AMD\secrets\hvac\extra\hvac` exposed
  - Target: Relative paths or sanitized paths
  - Files to modify: `backend/utils.py`, logging configuration
  
  ```python
  # Add to logging utilities
  def sanitize_path(path: str) -> str:
      """Remove absolute path prefixes from logs"""
      if 'hvac' in path:
          return 'hvac/' + path.split('hvac')[-1].lstrip('\\/') 
      return os.path.basename(path)
  ```

- [ ] **Update README with security notice**
  - Document that LAN access should be restricted for sensitive data
  - Add warning about running on trusted networks only
  - Files to modify: `README.md`

---

## 🟡 High Priority (Complete This Sprint - 2 Weeks)

### 4. Documentation
- [ ] **Document model loading behavior**
  - Add section to README about first-load time (~90s)
  - Explain that subsequent loads are faster
  - Document VRAM requirements and CPU fallback
  - Files to modify: `README.md`, `docs/`

- [ ] **Update minimum requirements**
  - Current: States "8GB VRAM target"
  - Add: "16GB RAM required for CPU inference"
  - Add: "12GB+ VRAM recommended for GPU inference"
  - Files to modify: `README.md`

- [ ] **Create troubleshooting guide**
  - Document slow model loading issue
  - Provide solutions (smaller model, more RAM, etc.)
  - Add FAQ section
  - Create new file: `docs/troubleshooting.md`

### 5. Logging Improvements
- [ ] **Implement log level filtering**
  - Add `--log-level` CLI argument
  - Support DEBUG, INFO, WARN, ERROR levels
  - Filter Ollama verbosity
  - Files to modify: `start.py`, `backend/server.py`
  
  ```python
  # Add to start.py
  parser.add_argument('--log-level', default='INFO', 
                      choices=['DEBUG', 'INFO', 'WARN', 'ERROR'])
  ```

- [ ] **Reduce Ollama log verbosity**
  - Current: 110 entries (70% of logs) for one model load
  - Target: Summarize layer fitting process
  - Show progress at 25%, 50%, 75%, 100%
  - Files to modify: Ollama log handling in `start.py`

- [ ] **Add structured logging**
  - Implement JSON logging option for production
  - Include request IDs in all related logs
  - Add correlation IDs across services
  - Files to modify: `backend/utils.py`

### 6. Monitoring & Metrics
- [ ] **Add resource usage metrics**
  - Track CPU usage during inference
  - Monitor RAM usage
  - Report GPU utilization if available
  - Files to modify: `backend/server.py`, new `backend/monitoring.py`

- [ ] **Implement health check endpoint**
  - Add `/health` endpoint with system status
  - Include model load status
  - Report resource availability
  - Files to modify: `backend/server.py`
  
  ```python
  @app.get("/health")
  async def health_check():
      return {
          "status": "healthy",
          "model_loaded": model_is_loaded(),
          "services": {
              "ollama": check_ollama(),
              "frontend": check_frontend()
          }
      }
  ```

---

## 🟢 Medium Priority (Complete Next Sprint - 4 Weeks)

### 7. Testing
- [ ] **Create error scenario tests**
  - Test invalid PDF uploads
  - Test Ollama service down
  - Test model loading timeout (>2min)
  - Test disk full during upload
  - Create new file: `tests/test_error_scenarios.py`

- [ ] **Implement load testing**
  - Test 5-10 concurrent uploads
  - Test rapid successive requests
  - Measure response time distribution
  - Check for memory leaks
  - Create new file: `tests/load_test.py`

- [ ] **Add integration tests**
  - Test full upload → analysis flow
  - Verify results accuracy
  - Check response times
  - Extend: `test_enhancements.py`

- [ ] **Performance benchmarking**
  - Establish baseline metrics
  - Track improvements over time
  - Create performance regression tests
  - Create new file: `tests/benchmark.py`

### 8. Configuration Management
- [ ] **Make model configurable**
  - Allow selection of small/medium/large models
  - Auto-detect GPU capabilities
  - Recommend appropriate model
  - Files to modify: `backend/config.py`, UI

- [ ] **Add configuration validation**
  - Check VRAM before selecting model
  - Warn if insufficient resources
  - Suggest optimal settings
  - Files to modify: `start.py`

- [ ] **Environment-specific configs**
  - Separate dev/staging/prod configurations
  - Different keep-alive times per environment
  - Adjust log verbosity per environment
  - Create new files: `.env.development`, `.env.production`

### 9. Code Quality
- [ ] **Add type hints to logging functions**
  - Ensure type safety throughout
  - Files to modify: `backend/utils.py`

- [ ] **Implement error handling improvements**
  - Add try-catch blocks for file operations
  - Handle Ollama connection failures gracefully
  - Provide user-friendly error messages
  - Files to modify: `backend/server.py`, `backend/utils.py`

- [ ] **Code review for security**
  - Audit file upload handling
  - Check for path traversal vulnerabilities
  - Validate input sanitization
  - Review: All `backend/*.py` files

---

## 🔵 Low Priority (Future Improvements)

### 10. Advanced Features
- [ ] **Investigate Vulkan support**
  - Test with `OLLAMA_VULKAN=1`
  - Measure performance impact
  - Document findings

- [ ] **Implement caching layer**
  - Cache analysis results
  - Cache rendered PDF pages
  - Reduce duplicate processing
  - Create new file: `backend/cache.py`

- [ ] **Distributed architecture support**
  - Allow Ollama on separate machine
  - Support remote inference endpoints
  - Load balancing for multi-user
  - Major refactor: Multiple files

- [ ] **Model management service**
  - Download and quantize models
  - Switch models without restart
  - Automatic optimization based on hardware
  - Create new file: `backend/model_manager.py`

### 11. Production Deployment
- [ ] **Create Docker configuration**
  - Containerize all services
  - Optimize image sizes
  - Document deployment
  - Create new files: `Dockerfile`, `docker-compose.yml`

- [ ] **Implement log rotation**
  - Prevent unbounded log growth
  - Configure retention policy
  - Files to modify: Logging configuration

- [ ] **Add Prometheus metrics**
  - Export application metrics
  - Monitor in production
  - Create dashboards
  - Create new file: `backend/metrics.py`

- [ ] **CI/CD pipeline**
  - Automated testing
  - Performance regression detection
  - Deployment automation
  - Create new file: `.github/workflows/ci.yml`

---

## Progress Tracking

### Week 1 - Critical Fixes
- [ ] Model optimization (items 1-2)
- [ ] Security fixes (item 3)

### Week 2 - Documentation & Logging
- [ ] Documentation updates (item 4)
- [ ] Logging improvements (item 5)

### Week 3 - Monitoring & Testing
- [ ] Metrics and health checks (item 6)
- [ ] Error scenario tests (item 7)

### Week 4 - Configuration & Quality
- [ ] Config management (item 8)
- [ ] Code quality improvements (item 9)

### Future Sprints
- [ ] Advanced features (item 10)
- [ ] Production deployment (item 11)

---

## Success Metrics

After completing critical and high-priority items, we expect:

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Model Load Time | 91.97s | ~30s | <30s ✅ |
| First Analysis | ~95s | ~35s | <45s ✅ |
| Subsequent Analysis | Unknown | <10s | <15s ✅ |
| Log Clarity | 3/10 | 8/10 | 7+/10 ✅ |
| Security Score | 7/10 | 9/10 | 8+/10 ✅ |
| Documentation | 6/10 | 9/10 | 8+/10 ✅ |
| Test Coverage | 30% | 70% | 60%+ ✅ |

---

## Validation

After implementing changes:

1. [ ] Re-run the application and capture new logs
2. [ ] Compare new logs with `test_logs.md` baseline
3. [ ] Verify model load time improvement
4. [ ] Confirm path sanitization works
5. [ ] Check progress indicator appears
6. [ ] Validate log verbosity reduction
7. [ ] Run new test suite and ensure passing
8. [ ] Update audit report with improvements

---

## Notes

- This checklist is based on the audit of `test_logs.md` from 2026-01-17
- Prioritization assumes single-developer bandwidth
- Adjust timelines based on team size and sprint length
- Mark items as complete with `[x]` instead of `[ ]`
- Add new items as needed during implementation

---

**Last Updated:** January 17, 2026  
**Status:** Initial checklist from audit  
**Next Review:** After Week 1 critical items complete
