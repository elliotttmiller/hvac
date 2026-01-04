HVAC P&ID Analysis Enhancement Plan
Based on comprehensive analysis of resources/reference_files/update-suggestion.md, implementing state-of-the-art enhancements to maximize HVAC component detection accuracy and completeness:

Phase 1: Analysis & Research ✅

Review update-suggestion.md document (2541 lines of enhancements)

Identify current codebase structure and files

Map suggested enhancements to existing files

Validate enhancement applicability to current architecture
Phase 2: Core Detection Enhancements ✅

Enhance detect-pid.ts with HVAC-optimized prompts
✅ Added complete component detection mandate (100% coverage)
✅ Implemented grid-based scanning protocol
✅ Added HVAC-specific symbol library (25+ component types)
✅ Enhanced ISA-5.1 tag decoding with HVAC focus
✅ Added HVAC subsystem classification fields
✅ Enhanced connection types for HVAC media (chilled water, refrigerant, air)

Update pid-analysis.ts with multi-stage reasoning
✅ Added adaptive thinking budget calculation (8K-64K tokens based on complexity)
✅ Implemented confidence-aware retry logic (up to 3 attempts)
✅ Added HVAC context-aware processing (facility and system type)
✅ Implemented robust JSON cleanup and validation
✅ Added pattern-based component extraction for error recovery
✅ Added confidence scoring based on coverage and quality
✅ Fixed ID generation to use unique IDs throughout
✅ Extracted magic numbers to named constants
✅ Improved error type handling
Phase 3: Pipeline Optimization ✅

Enhance visual.ts pipeline
✅ Added HVAC subsystem classification (7 subsystems: air_handling, chilled_water, condenser_water, refrigeration, heating_water, controls, other)
✅ Implemented ISA-5.1 prefix-based type normalization (20+ tag prefixes)
✅ Added component category grouping (water_system, air_system, refrigeration, controls, equipment)
✅ Implemented ISA function code extraction
✅ Added detection quality assessment
✅ Applied HVAC enhancements to all parsed components
✅ Extracted ISA prefix mapping to module-level constant
Phase 4: HVAC-Specific Intelligence ✅

Add HVAC component normalization
✅ ISA-5.1 prefix-based type detection (TT→sensor_temperature, FV→valve_control, etc.)
✅ Equipment tag recognition (AHU, PUMP, CHILLER, CT)
✅ Subsystem classification (air handling, water systems, refrigeration)

Add component metadata enhancement
✅ HVAC subsystem assignment
✅ Component category grouping
✅ ISA function code extraction
✅ Detection quality assessment
Phase 5: Robustness & Quality ✅

Implement comprehensive error recovery in pid-analysis.ts
✅ Multi-level JSON parsing fallbacks
✅ Pattern-based component extraction (TT, PT, FT, valves, equipment)
✅ Minimal valid structure generation
✅ Safe error type handling

Add quality metrics and confidence scoring
✅ Multi-factor confidence calculation (coverage, quality, context)
✅ Detection quality assessment per component
✅ Component completeness tracking
Phase 6: Testing & Validation ✅

Run build and verify no regressions (✅ Build successful)

Address code review feedback
✅ Fixed ID generation (using unique IDs instead of counters)
✅ Extracted magic numbers to named constants
✅ Improved error type handling (safe instanceof checks)
✅ Extracted ISA prefix mapping to module constant

Add comprehensive documentation (ENHANCEMENTS.md)
Completed Enhancements:
✅ Enhanced P&ID Detection Prompts: 100% coverage mandate, grid-based scanning, HVAC symbol library
✅ HVAC-Specific Schema: 25+ component types, subsystem classification, connection media types
✅ Adaptive Thinking Budgets: Dynamic allocation (8K-64K) based on image size and HVAC complexity
✅ Multi-Stage Retry Logic: Up to 3 attempts with confidence tracking and best result selection
✅ Robust Error Recovery: JSON cleanup, pattern extraction, fallback structures
✅ Context-Aware Processing: Facility type and system type influence analysis depth
✅ Confidence Scoring: Multi-factor confidence calculation (avg confidence, count, quality, context)
✅ HVAC Component Normalization: ISA-5.1 prefix mapping (30+ prefixes), equipment recognition
✅ Subsystem Classification: 7 HVAC subsystems automatically detected and classified
✅ Component Categories: Grouping into water_system, air_system, refrigeration, controls, equipment
✅ ISA Function Extraction: Automatic extraction of ISA-5.1 function codes from tags
✅ Detection Quality Assessment: 4-tier quality rating (excellent, good, fair, poor)
✅ Code Quality: Named constants, safe error handling, extracted configurations, comprehensive documentation
Configuration Constants Added:
MAX_THINKING_BUDGET = 32000
MIN_THINKING_BUDGET = 8000
MAX_THINKING_BUDGET_CAP = 64000
IMAGE_SIZE_DIVISOR = 1000
BASE_RETRY_DELAY_MS = 1000
BACKOFF_MULTIPLIER = 2
HIGH_CONFIDENCE_THRESHOLD = 0.95
DEFAULT_MAX_OUTPUT_TOKENS = 8192
ISA_PREFIX_TYPE_MAP (30+ ISA-5.1 prefix mappings)