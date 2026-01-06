# Validation Test Plan
## Inference Accuracy Audit Implementation

### Test Objective
Verify that the three-tier solution successfully prevents shape/type misclassification hallucinations and enforces geometric determinism in P&ID component detection.

---

## Test Suite 1: Tier 1 Prompt Engineering Validation

### Test 1.1: Verify Shape-First Reasoning in AI Output
**Objective**: Confirm AI model follows shape-first paradigm in reasoning

**Test Data**: Use existing test image (`resources/reference_files/test_results/image.png`)

**Expected Behavior**:
- All components should have `shape` field populated
- `meta.reasoning` should start with shape identification (e.g., "Detected circular symbol...")
- Reasoning should follow format: "Detected [SHAPE], which indicates [TYPE]"

**Validation Criteria**:
```javascript
// Check reasoning format
components.forEach(comp => {
  assert(comp.shape !== null, 'Shape field must be populated');
  assert(comp.meta?.reasoning.toLowerCase().includes(comp.shape.toLowerCase()), 
    'Reasoning must mention detected shape');
});
```

### Test 1.2: Verify Circle→Instrument Classification
**Objective**: Confirm circular symbols are never classified as valves

**Test Data**: Components with tags: 1LI-12422, 1LIT-12422A, 1LG-12427

**Expected Behavior**:
- All components with circular shapes should have instrument types
- No component with `shape: "circle"` should have valve types

**Validation Criteria**:
```javascript
const circularComponents = components.filter(c => c.shape === 'circle');
const valveTypes = ['valve_gate', 'valve_control', 'Manual Valve', 'Control Valve', 'Gate Valve'];

circularComponents.forEach(comp => {
  const isValve = valveTypes.some(vt => comp.type.toLowerCase().includes(vt.toLowerCase()));
  assert(!isValve, `Circular component ${comp.label} incorrectly classified as valve: ${comp.type}`);
});
```

### Test 1.3: Verify Bowtie→Valve Classification
**Objective**: Confirm bowtie symbols are classified as valves

**Test Data**: Components with tags: 1VA-120704, 1VA-121271, 1VA-121270

**Expected Behavior**:
- All bowtie shapes should be valve types
- Bowtie with actuator → Control Valve
- Bowtie without actuator → Manual Valve

**Validation Criteria**:
```javascript
const bowtieComponents = components.filter(c => c.shape === 'bowtie');

bowtieComponents.forEach(comp => {
  const isValve = comp.type.toLowerCase().includes('valve');
  assert(isValve, `Bowtie component ${comp.label} not classified as valve: ${comp.type}`);
});
```

---

## Test Suite 2: Tier 2 Schema Validation

### Test 2.1: Verify Shape Field Mandatory Presence
**Objective**: Confirm all components have shape field

**Expected Behavior**:
- Every component must have `shape` field
- Shape must be one of VALID_PID_SHAPES values

**Validation Criteria**:
```javascript
const validShapes = ['circle', 'circle_in_square', 'square', 'diamond', 'bowtie', 
                     'triangle', 'rectangle', 'hexagon', 'cloud', 'line', 'complex_assembly'];

components.forEach(comp => {
  assert(comp.shape, `Component ${comp.label} missing shape field`);
  assert(validShapes.includes(comp.shape), 
    `Component ${comp.label} has invalid shape: ${comp.shape}`);
});
```

### Test 2.2: Verify Reasoning Field Format
**Objective**: Confirm reasoning follows shape-first format

**Expected Behavior**:
- Reasoning should mention the shape explicitly
- Should follow pattern: "Detected [shape] ... which indicates [type]"

**Validation Criteria**:
```javascript
components.forEach(comp => {
  const reasoning = comp.meta?.reasoning || '';
  const mentionsShape = reasoning.toLowerCase().includes('detected') && 
                       (reasoning.toLowerCase().includes('circle') ||
                        reasoning.toLowerCase().includes('bowtie') ||
                        reasoning.toLowerCase().includes('diamond'));
  
  assert(mentionsShape, `Reasoning for ${comp.label} doesn't mention shape explicitly`);
});
```

---

## Test Suite 3: Tier 3 Post-Processing Validation

### Test 3.1: Shape/Type Compatibility Enforcement
**Objective**: Verify post-processing catches and corrects mismatches

**Test Approach**: Create synthetic test case with intentional mismatch

**Synthetic Test Data**:
```javascript
const testComponent = {
  id: 'TEST-TI-101',
  type: 'Control Valve',  // WRONG - should be Temperature Indicator
  shape: 'circle',
  label: 'TI-101',
  confidence: 0.95,
  meta: { reasoning: 'Test case' }
};
```

**Expected Behavior After Processing**:
```javascript
const processed = validateShapeTypeCompatibility([testComponent])[0];

assert(processed.type === 'Temperature Indicator', 'Type should be auto-corrected');
assert(processed.meta.correction_applied === true, 'Correction flag should be set');
assert(processed.meta.original_type === 'Control Valve', 'Original type should be preserved');
assert(processed.confidence < 0.95, 'Confidence should be reduced after correction');
assert(processed.confidence >= 0.5, 'Confidence should not drop below minimum threshold');
```

### Test 3.2: ISA Tag Pattern Inference
**Objective**: Verify tag-based type inference works correctly

**Test Cases**:
```javascript
const testCases = [
  { tag: '1LI-12422', expectedType: 'Level Indicator' },
  { tag: 'TI-101', expectedType: 'Temperature Indicator' },
  { tag: '1LIT-12422A', expectedType: 'Level Indicating Transmitter' },
  { tag: 'PT-205', expectedType: 'Pressure Transmitter' },
  { tag: 'FT-310', expectedType: 'Flow Transmitter' },
  { tag: '1VA-120704', expectedType: 'Manual Valve' },
  { tag: 'CV-101', expectedType: 'Control Valve' }
];

testCases.forEach(({ tag, expectedType }) => {
  const inferred = inferTypeFromTag(tag);
  assert(inferred === expectedType, 
    `Tag ${tag} inferred as ${inferred}, expected ${expectedType}`);
});
```

### Test 3.3: Confidence Adjustment Verification
**Objective**: Verify confidence scores are adjusted correctly

**Test Data**: Component requiring correction

**Expected Behavior**:
- Auto-corrected components: confidence reduced by AUTO_CORRECTION_PENALTY (0.3)
- Minimum confidence: MIN_CONFIDENCE_AFTER_CORRECTION (0.5)
- Validation errors: confidence reduced by VALIDATION_ERROR_PENALTY (0.5)
- Minimum for errors: MIN_CONFIDENCE_VALIDATION_ERROR (0.3)

**Validation Criteria**:
```javascript
const testComponent = {
  type: 'Control Valve',
  shape: 'circle',
  label: 'TI-101',
  confidence: 0.9
};

const corrected = validateShapeTypeCompatibility([testComponent])[0];

// Should reduce by 0.3, resulting in 0.6 (0.9 - 0.3)
assert(corrected.confidence === 0.6, 
  `Expected confidence 0.6, got ${corrected.confidence}`);
```

### Test 3.4: Logging Verification
**Objective**: Verify comprehensive logging for debugging

**Expected Console Output**:
```
[Shape Sanity Check] CRITICAL: Detected shape/type mismatch for component "TI-101".
  Shape: circle
  Type: Control Valve
  Issue: Circular shapes represent instruments/sensors, NEVER valves
  Attempting auto-correction...
[ISA Inference] Matched pattern "^[0-9]*TI" for tag "TI-101" → Type: Temperature Indicator
[Shape Sanity Check] Auto-corrected: Control Valve → Temperature Indicator (based on tag: TI-101)
```

---

## Test Suite 4: Integration Testing

### Test 4.1: End-to-End Workflow
**Objective**: Verify entire pipeline from AI output to final result

**Test Flow**:
1. Load test image
2. Run visual analysis pipeline
3. Apply enhancements (including validation)
4. Verify results

**Validation Steps**:
```javascript
// 1. All circular symbols should be instruments
const circles = result.components.filter(c => c.shape === 'circle');
circles.forEach(c => {
  assert(!c.type.toLowerCase().includes('valve'), 
    `Circle incorrectly classified as valve: ${c.label}`);
});

// 2. All bowtie symbols should be valves
const bowties = result.components.filter(c => c.shape === 'bowtie');
bowties.forEach(c => {
  assert(c.type.toLowerCase().includes('valve'), 
    `Bowtie not classified as valve: ${c.label}`);
});

// 3. Check for any corrections applied
const corrections = result.components.filter(c => c.meta?.correction_applied);
console.log(`Applied ${corrections.length} auto-corrections`);

// 4. Verify reasoning quality
const hasShapeReasoning = result.components.every(c => 
  c.meta?.reasoning?.toLowerCase().includes('detected')
);
assert(hasShapeReasoning, 'All components should have shape-first reasoning');
```

### Test 4.2: Regression Testing
**Objective**: Ensure existing correct detections remain unchanged

**Test Data**: Use known-good test results

**Validation**:
- Components correctly classified before should remain correct
- No decrease in overall confidence scores for correct detections
- ISA detection rate should remain stable or improve
- Connection inference should not be affected

---

## Test Suite 5: Edge Cases & Robustness

### Test 5.1: Ball and Butterfly Valves
**Objective**: Verify rotary valves with circular elements are handled correctly

**Note**: Ball valves and butterfly valves may have circular elements but distinct symbols

**Expected Behavior**:
- Should not be misidentified as instruments
- ISA tags should help disambiguate (e.g., "BV-" for ball valve)

### Test 5.2: Complex Assemblies
**Objective**: Verify complex shapes don't trigger false positives

**Test Data**: Components with `shape: 'complex_assembly'`

**Expected Behavior**:
- Validation should skip complex assemblies
- Should not attempt auto-correction
- Should preserve AI's original classification

### Test 5.3: Missing or Unclear Tags
**Objective**: Verify system handles cases where ISA tag inference fails

**Test Data**: Component with shape/type mismatch but no clear tag pattern

**Expected Behavior**:
- Should flag as validation error
- Should not apply incorrect auto-correction
- Should reduce confidence significantly
- Should add `validation_error: true` to metadata

### Test 5.4: Rotated and Occluded Symbols
**Objective**: Verify system handles difficult-to-read symbols

**Expected Behavior**:
- Lower confidence for occluded symbols
- Rotation should not affect shape identification
- If uncertain, should flag with lower confidence rather than hallucinate

---

## Performance Metrics

### Accuracy Metrics to Track:
1. **Classification Accuracy Rate**: % of components correctly classified
2. **False Positive Rate (Circles as Valves)**: Should be 0%
3. **False Negative Rate (Valves as Instruments)**: Should be minimal
4. **Auto-Correction Success Rate**: % of misclassifications successfully corrected
5. **Reasoning Quality Score**: % of components with shape-first reasoning

### Baseline Goals:
- Circle→Valve misclassification: **0%** (CRITICAL)
- Overall classification accuracy: **>95%**
- Auto-correction success rate: **>80%**
- Reasoning quality (shape-first format): **100%**

---

## Manual Validation Checklist

### Pre-Deployment Checklist:
- [ ] Build passes without errors (`npm run build`)
- [ ] TypeScript compilation successful
- [ ] No security vulnerabilities (CodeQL passed)
- [ ] Code review feedback addressed
- [ ] Constants extracted for maintainability
- [ ] Comprehensive logging implemented

### Post-Deployment Validation:
- [ ] Run analysis on test P&ID image
- [ ] Review console logs for sanity check warnings
- [ ] Verify no circular symbols classified as valves
- [ ] Verify reasoning logs include shape-first explanations
- [ ] Check correction metadata for any auto-corrections
- [ ] Review confidence score distributions
- [ ] Validate ISA detection still functioning
- [ ] Confirm control loop detection unaffected

---

## Test Execution Instructions

### Running Manual Tests:
1. Start development server: `npm run dev`
2. Upload test image: `resources/reference_files/test_results/image.png`
3. Run detection and wait for results
4. Open browser console to view logs
5. Export results JSON for analysis

### Analyzing Results:
```javascript
// In browser console after analysis completes
const result = /* copy result from UI */;

// Test 1: Check for circular valves (should be 0)
const circularValves = result.components.filter(c => 
  c.shape === 'circle' && c.type.toLowerCase().includes('valve')
);
console.log('Circular valves found:', circularValves.length, circularValves);

// Test 2: Check auto-corrections
const corrections = result.components.filter(c => c.meta?.correction_applied);
console.log('Auto-corrections applied:', corrections.length);
corrections.forEach(c => console.log(`  ${c.label}: ${c.meta.original_type} → ${c.type}`));

// Test 3: Check reasoning quality
const shapeReasoningCount = result.components.filter(c =>
  c.meta?.reasoning?.toLowerCase().includes('detected')
).length;
console.log(`Components with shape-first reasoning: ${shapeReasoningCount}/${result.components.length}`);

// Test 4: Check validation errors
const validationErrors = result.components.filter(c => c.meta?.validation_error);
console.log('Validation errors:', validationErrors.length, validationErrors);
```

---

## Success Criteria

### Definition of Success:
✅ **Zero circular symbols classified as valves** (Critical requirement)
✅ **All components have shape field populated**
✅ **Reasoning follows shape-first format**
✅ **Auto-correction triggers for mismatches and logs appropriately**
✅ **Confidence scores properly adjusted for corrections**
✅ **No regressions in existing correct classifications**
✅ **Build passes without errors**
✅ **Security scan passes without vulnerabilities**

### Acceptance Criteria Met:
- [x] Audit completed and documented
- [x] Three tiers implemented
- [x] Code review feedback addressed
- [x] Build verification passed
- [x] Security scan passed
- [ ] Integration testing completed (pending test run)
- [ ] Classification accuracy validated (pending test run)
- [ ] Reasoning integrity verified (pending test run)

---

## Next Steps

1. **Execute Integration Test**: Run full analysis on test image
2. **Validate Results**: Use validation scripts above to verify correctness
3. **Generate Metrics Report**: Calculate accuracy metrics
4. **Document Findings**: Update IMPLEMENTATION_SUMMARY.md with test results
5. **User Acceptance**: Present results to stakeholders
6. **Production Deployment**: If tests pass, merge PR and deploy

---

## Troubleshooting Guide

### If circular symbols are still classified as valves:
1. Check console for `[Shape Sanity Check]` warnings
2. Verify shape field is populated by AI
3. Check if auto-correction was attempted
4. Review ISA tag pattern matching
5. Verify SHAPE_TYPE_COMPATIBILITY rules are correct
6. Check if prompt changes are being used (restart server if needed)

### If auto-correction is not working:
1. Verify tag normalization is working (`/[^\w]/g` regex)
2. Check ISA_TAG_PATTERNS dictionary for missing patterns
3. Review console logs for inference failures
4. Verify component has label field populated
5. Check if tag format matches expected patterns

### If confidence scores are incorrect:
1. Verify CONFIDENCE_ADJUSTMENTS constants are used
2. Check calculation logic in validateShapeTypeCompatibility
3. Review penalty values (may need tuning)
4. Verify original confidence is being preserved

---

## Monitoring & Maintenance

### Ongoing Monitoring:
- Watch for `[Shape Sanity Check]` logs in production
- Track correction rate over time
- Monitor confidence score distributions
- Review validation error frequency

### Maintenance Tasks:
- Add new ISA tag patterns as needed
- Update SHAPE_TYPE_COMPATIBILITY rules for new component types
- Tune CONFIDENCE_ADJUSTMENTS based on real-world data
- Extend VALID_PID_SHAPES if new shapes are encountered
