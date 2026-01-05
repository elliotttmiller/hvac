# Testing Guide - Inference Pipeline Fixes

## Quick Start Testing Procedure

This guide provides step-by-step instructions for manually testing the inference pipeline fixes.

---

## Prerequisites

1. ✅ Platform installed and configured
2. ✅ Valid Gemini API key in `.env`
3. ✅ Sample P&ID images ready for testing
4. ✅ Latest code pulled from `copilot/analyze-full-inference-logs` branch

---

## Test Setup

### 1. Environment Configuration

Ensure your `.env` file includes:

```bash
# Required
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=your_gemini_api_key_here
VITE_AI_MODEL=gemini-2.5-flash

# New configuration (fixes)
VITE_AI_MAX_OUTPUT_TOKENS=8192

# Optional (for testing retry logic)
VITE_RATE_LIMIT_MAX_RETRIES=3
VITE_RATE_LIMIT_DELAY_MS=1000
```

### 2. Start Development Servers

```bash
# Terminal 1: Start backend
npm run dev:api

# Terminal 2: Start frontend
npm run dev
```

**Expected Output**:
```
✅ AI Proxy Initialized. Model: gemini-2.5-flash
🚀 Server running at http://localhost:4000
🎭 Mock Mode: DISABLED (live AI inference)
```

---

## Test Cases

### Test Case 1: Small P&ID (Baseline)
**Objective**: Verify no regression on simple documents

**Steps**:
1. Open browser to `http://localhost:3000`
2. Upload a small P&ID (10-20 components)
3. Click "Analyze Document"
4. Wait for completion

**Expected Results**:
- ✅ Classification: SCHEMATIC (confidence >0.9)
- ✅ Components detected: 10-20
- ✅ No errors in console
- ✅ Response time: <10s
- ✅ All components have bounding boxes

**Success Criteria**: Works exactly as before (no regression)

---

### Test Case 2: Medium P&ID (Critical)
**Objective**: Verify fix resolves truncation on complex documents

**Steps**:
1. Upload a medium P&ID (30-50 components)
2. Click "Analyze Document"
3. Monitor browser console and server logs
4. Wait for completion

**Expected Results**:
- ✅ Classification: SCHEMATIC (confidence >0.9)
- ✅ Components detected: 30-50
- ✅ NO "Invalid JSON" errors
- ✅ Response time: 10-20s
- ✅ All components have valid bounding boxes
- ✅ No truncation warnings in server logs

**Success Criteria**: **THIS SHOULD NOW WORK** (previously failed)

**What to Look For**:
```javascript
// Browser console - Should see:
[Visual Pipeline] Quality Score: 0.85  // Or similar
["Analysis complete:", { components: 35, ... }]

// Server logs - Should NOT see:
❌ "AI Vision Error: Invalid JSON response"
❌ "Response appears truncated"
```

---

### Test Case 3: Large P&ID (Advanced)
**Objective**: Verify grid tiling still works with new config

**Steps**:
1. Upload a large P&ID (80+ components, >500KB)
2. Click "Analyze Document"
3. Wait for tiling and map-reduce

**Expected Results**:
- ✅ Classification: SCHEMATIC
- ✅ Grid tiling triggered (check console: "Using SOTA tiling approach")
- ✅ All tiles processed successfully
- ✅ Components detected: 80+
- ✅ Response time: 30-60s
- ✅ Merge and refine steps complete

**Success Criteria**: Tiling pipeline completes without errors

---

### Test Case 4: Retry Logic (Stress Test)
**Objective**: Verify retry logic activates on failures

**Steps**:
1. Temporarily set `VITE_AI_MAX_OUTPUT_TOKENS=100` (artificially low)
2. Upload medium P&ID
3. Click "Analyze Document"
4. Monitor server logs

**Expected Behavior**:
```
[Server Log]
AI Vision Error: Response appears truncated (attempt 1)
⚠️  Retry attempt 1/3 after 1000ms...
AI Vision Error: Response appears truncated (attempt 2)
⚠️  Retry attempt 2/3 after 2000ms...
AI Vision Error: Response appears truncated (attempt 3)
❌ AI Vision Error (all retries exhausted)
```

**Expected Result**:
- ✅ 3 retry attempts made
- ✅ Exponential backoff (1s, 2s delays)
- ✅ Clear error message explaining truncation
- ✅ Suggestion to increase maxOutputTokens

**Post-Test**: Restore `VITE_AI_MAX_OUTPUT_TOKENS=8192`

---

### Test Case 5: Error Handling (Edge Case)
**Objective**: Verify graceful degradation on bad inputs

**Inputs to Test**:
1. Empty image
2. Corrupted image file
3. Non-engineering document (e.g., photo)
4. Extremely large file (>50MB)

**Expected Results**:
- ✅ Clear error messages (no cryptic crashes)
- ✅ Suggestion for user action
- ✅ No server crash
- ✅ Frontend remains responsive

---

## Monitoring & Validation

### Browser Console Checks

**Look for these positive indicators**:
```javascript
✅ [AI Client] Initialized in Proxy Mode
✅ [Classifier] Raw AI response: {"type":"SCHEMATIC",...}
✅ [Visual Pipeline] Using standard single-pass analysis
✅ [Visual Pipeline] Quality Score: 0.85
✅ Analysis complete: {components: 45, ...}
```

**Should NOT see**:
```javascript
❌ AI Proxy Error: Invalid JSON response
❌ Response appears truncated
❌ Empty response from AI service
```

### Server Log Checks

**Positive indicators**:
```
✅ AI Vision Response (attempt succeeded): {"components":[...
✅ AI Vision Response: [first 200 chars]
```

**Warning signs** (should not appear):
```
❌ AI Vision Error: Invalid JSON response
❌ AI Vision Error: Response appears truncated
❌ Retry attempt 1/3 after 1000ms... (unless stress testing)
```

### Performance Metrics

| Metric | Target | Acceptable |
|--------|--------|------------|
| Small P&ID (10-20) | <5s | <10s |
| Medium P&ID (30-50) | <15s | <20s |
| Large P&ID (80+) | <45s | <60s |
| Success Rate | 100% | >95% |

---

## Common Issues & Troubleshooting

### Issue: "Empty response from AI service"
**Cause**: API key invalid or quota exceeded  
**Fix**: Check API key in `.env`, verify quota on Google AI Studio

### Issue: "Response appears truncated" (even with fix)
**Cause**: Document complexity exceeds 8192 token limit  
**Fix**: Increase to `VITE_AI_MAX_OUTPUT_TOKENS=16384` (if model supports)  
**Alternative**: Document will auto-trigger grid tiling if large enough

### Issue: "Cannot find module 'dotenv'"
**Cause**: Dependencies not installed  
**Fix**: Run `npm install` in project root

### Issue: Components detected but no bounding boxes visible
**Cause**: BBox normalization issue (separate from this fix)  
**Action**: File separate bug report, this is unrelated to token limits

---

## Test Matrix

| Test | Small P&ID | Medium P&ID | Large P&ID | Stress Test | Edge Cases |
|------|------------|-------------|------------|-------------|------------|
| Classification | ✅ | ⚠️ | ✅ | ⚠️ | ✅ |
| Component Detection | ✅ | ⚠️ | ✅ | ❌ | ⚠️ |
| No Truncation Errors | ✅ | ⚠️ | ✅ | ❌ | N/A |
| Retry Logic | N/A | N/A | N/A | ⚠️ | N/A |
| Error Messages | ✅ | ✅ | ✅ | ✅ | ⚠️ |

**Legend**:
- ✅ Should pass (verify)
- ⚠️ **CRITICAL - Must verify this fix works**
- ❌ Expected to fail (by design)
- N/A Not applicable

---

## Success Criteria Summary

### Must Pass (Blockers)
- ⚠️ **Medium P&ID analysis completes without JSON errors**
- ⚠️ **Components detected in range 30-50 for medium documents**
- ⚠️ **No regression on small P&IDs**

### Should Pass (Important)
- ✅ Large P&ID with tiling completes successfully
- ✅ Retry logic activates when configured to fail
- ✅ Error messages are clear and actionable

### Nice to Have
- ✅ Performance metrics within target ranges
- ✅ Cache hit rate maintained
- ✅ UI remains responsive during analysis

---

## Reporting Results

### Success Report Template

```
✅ ALL TESTS PASSED

Test Case 1 (Small P&ID): ✅ PASS
- Components: 15 detected
- Time: 6.3s
- No errors

Test Case 2 (Medium P&ID): ✅ PASS
- Components: 42 detected
- Time: 14.2s
- No truncation errors ✨ (this was broken before)

Test Case 3 (Large P&ID): ✅ PASS
- Components: 87 detected
- Time: 48.1s
- Grid tiling successful

Test Case 4 (Retry): ✅ PASS
- Retries triggered as expected
- Clear error messaging

Test Case 5 (Edge Cases): ✅ PASS
- Graceful error handling

RECOMMENDATION: ✅ APPROVE FOR PRODUCTION
```

### Failure Report Template

```
❌ TEST FAILURE

Test Case: [Test name]
Issue: [Specific error message]
Steps to Reproduce: [...]
Expected: [...]
Actual: [...]

Logs:
[Browser console output]
[Server log output]

Screenshots: [if applicable]
```

---

## Post-Testing Checklist

After all tests pass:

- [ ] Document any unexpected behavior
- [ ] Verify no increase in API costs (check Google AI Studio)
- [ ] Confirm cache hit rate maintained (>70%)
- [ ] Update user documentation if needed
- [ ] Sign off on production deployment

---

## Next Steps After Testing

### If All Tests Pass ✅
1. Get sign-off from tech lead
2. Merge PR to main branch
3. Deploy to production
4. Monitor for 24 hours
5. Celebrate! 🎉

### If Tests Fail ❌
1. Document specific failure
2. File bug report with details
3. Investigate root cause
4. Implement additional fixes
5. Re-test

---

## Questions?

Contact: Engineering team via Slack #hvac-platform

**Documentation**:
- Technical Details: `INFERENCE_CRASH_FIX_2026_01.md`
- Optimization Guide: `OPTIMIZATION_OPPORTUNITIES_2026_01.md`
- Executive Summary: `EXECUTIVE_ANALYSIS_SUMMARY.md`
