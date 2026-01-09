# Implementation Complete - Testing Guide

## Quick Start

### Running the Application

1. **Start the API Server:**
```bash
npm run dev:api
```

2. **Start the Frontend (in a new terminal):**
```bash
npm run dev
```

3. **Open Browser:**
Navigate to `http://localhost:5173` (or the URL shown by Vite)

## What to Test

### 1. Knowledge Base Enhancement (Invisible but Critical)

The AI now has:
- ASHRAE-level HVAC knowledge
- Precise valve geometric definitions
- Geometric disambiguation (prevents "diamond valve" errors)
- 10 engineering first principles

**How to verify:** Upload a P&ID with various valve types and check that the AI correctly identifies:
- Control valves (triangles with stems)
- Ball valves (circles with diagonal lines)
- Check valves (arrows with no actuators)
- No "diamond-shaped valves" in the output

### 2. Two-Stage Pipeline Architecture

**Stage 1 (Fast Visual Analysis):**
- Upload any blueprint/P&ID
- Should see components rendered on canvas within 5-10 seconds
- UI should be fully interactive immediately after Stage 1

**Stage 2 (Background Analysis):**
- Watch for toast notification after Stage 1 completes
- Background analysis runs without blocking UI
- Can interact with visual results while waiting
- Final toast appears when comprehensive report is ready

### 3. Toast Notification System

**Expected Toasts:**

1. **After Stage 1 completes:**
   ```
   ℹ️ Visual analysis complete
   Generating comprehensive report in the background...
   ```
   - Auto-dismisses after 4 seconds
   - Blue/cyan theme

2. **After Stage 2 completes:**
   ```
   ✅ Comprehensive analysis ready
   Click to view the detailed report
   ```
   - Auto-dismisses after 8 seconds
   - Green theme
   - **CLICKABLE** - Click to auto-switch to Analysis tab

3. **On Error:**
   ```
   ❌ Analysis failed
   [Error message]
   ```
   - Auto-dismisses after 6 seconds
   - Red theme

**Toast Locations:**
- Top-right corner of the screen
- Below the main header (80px from top)
- Stack vertically if multiple toasts

### 4. Inspector Panel Tab Switching

**Test the clickable toast:**
1. Start an analysis
2. When Stage 2 completes, click the green success toast
3. Verify that the Inspector Panel automatically switches to the "ANALYSIS" tab
4. Verify that the comprehensive report is displayed

## Visual Reference

### Toast Appearance

The toasts use a glass morphism design matching the existing ProcessingOverlay:
- Dark semi-transparent background
- Blur effect (backdrop-filter)
- Smooth slide-in from right
- Icon on left (checkmark, info, warning, or error)
- Title in white
- Message in gray
- Close button (X) on right
- Hover effects on clickable toasts

### Processing Flow Visual

```
[Upload File]
      ↓
  Processing
  Overlay shown
      ↓
[Stage 1: 5-10s]
  - Classifying
  - Analyzing
  - Refining
      ↓
  Components
  appear on
   canvas
      ↓
    Toast 1:
 "Visual complete"
      ↓
[Stage 2: 15-30s]
 (Background)
      ↓
    Toast 2:
 "Analysis ready"
  (Click me!)
      ↓
  Auto-switch
  to Analysis
     tab
```

## Expected Performance

| Metric | Target | Notes |
|--------|--------|-------|
| Stage 1 | 5-10s | Visual results appear |
| Stage 2 | 15-30s | Background, non-blocking |
| Total Time | 20-40s | Same as before, but... |
| Perceived Speed | 5x faster | User sees results immediately |
| Timeout Errors | 0 | Eliminated completely |

## Common Issues & Solutions

### Toast Not Appearing
- Check browser console for errors
- Verify ToastProvider is wrapping the app (App.tsx)
- Check that useToast hook is being called correctly

### Stage 2 Not Triggering
- Check browser console for "[Stage 2]" logs
- Verify document type is BLUEPRINT or SCHEMATIC
- Ensure components were detected in Stage 1

### Tab Not Switching on Toast Click
- Check for 'switch-to-analysis-tab' event in console
- Verify InspectorPanel is listening for the event
- Check that activeTab state is being updated

## Testing Checklist

- [ ] Upload a simple blueprint (HVAC diagram)
- [ ] Verify Stage 1 completes in < 10 seconds
- [ ] Verify components render on canvas immediately
- [ ] Verify blue "Visual complete" toast appears
- [ ] Verify UI remains responsive
- [ ] Wait for green "Analysis ready" toast
- [ ] Click the green toast
- [ ] Verify Inspector Panel switches to Analysis tab
- [ ] Verify comprehensive report is displayed
- [ ] Test with a complex P&ID (multiple sheets if available)
- [ ] Verify no timeout errors occur
- [ ] Test error handling: upload an invalid file
- [ ] Verify red error toast appears

## Screenshots to Capture

1. **Processing Overlay** during Stage 1
2. **Canvas with detected components** after Stage 1
3. **Blue toast notification** ("Visual complete")
4. **Green toast notification** ("Analysis ready")
5. **Analysis tab** with comprehensive report
6. **Inspector Panel** showing components inventory

## Development Notes

### Adding New Toast Types

```typescript
import { useToastHelpers } from '@/lib/hooks/useToast';

const MyComponent = () => {
  const toast = useToastHelpers();
  
  // Simple toast
  toast.info('Title', 'Message');
  
  // With options
  toast.success('Done!', 'Operation completed', {
    duration: 5000,
    clickable: true,
    onClick: () => {
      // Do something
    }
  });
};
```

### Triggering Background Analysis Manually

```typescript
import { generateBackgroundAnalysis } from '@/features/document-analysis/orchestrator';

// After Stage 1
const jobId = await generateBackgroundAnalysis(result, {
  onProgress: (msg) => console.log(msg),
  onComplete: (report) => console.log('Done!', report),
  onError: (err) => console.error(err)
});
```

## Success Criteria

The implementation is successful if:
1. ✅ Visual results appear within 10 seconds
2. ✅ UI remains responsive during background analysis
3. ✅ Toasts appear at the correct times
4. ✅ Clicking the success toast switches tabs
5. ✅ No timeout errors on complex diagrams
6. ✅ Comprehensive report is generated correctly
7. ✅ Error handling works as expected

## Next Steps for Future Enhancements

1. Add WebSocket real-time progress updates
2. Implement job history and status page
3. Add retry logic for failed Stage 2 jobs
4. Allow user cancellation of running jobs
5. Persist job store to database/Redis
6. Add progress bar for Stage 2
