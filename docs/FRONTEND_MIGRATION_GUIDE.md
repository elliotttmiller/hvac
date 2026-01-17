# Frontend Migration Guide for Enhanced Backend Schema

## Overview

The backend has been enhanced with richer data structures in the analysis output. **The good news: Your frontend will continue to work without any changes** because the backend maintains backward compatibility. However, updating the frontend will allow you to take full advantage of the enhanced features.

## Current Status: ✅ Backward Compatible

**No immediate changes required.** The backend still returns:
- All original fields (`project_info`, `load_calculations`, `equipment_analysis`, `compliance_status`)
- Original data types are preserved
- Existing TypeScript interfaces will continue to work

## What's New in the Backend Response

### 1. Enhanced `project_info`
```typescript
// NEW fields (optional - won't break existing code)
building_type?: "residential" | "commercial"
total_conditioned_area_sqft?: number
```

### 2. Enhanced `load_calculations`
```typescript
// NEW arrays with component-level detail
heating_load_breakdown?: Array<{
  component: string
  area_sqft: number
  u_value: number
  load_btu: number
}>

cooling_load_breakdown?: Array<{
  component: string
  area_sqft: number
  u_value: number
  load_btu: number
}>
```

### 3. Enhanced `equipment_analysis`
```typescript
// NEW: Separate status for heating and cooling
heating_status?: "COMPLIANT" | "NON_COMPLIANT"
cooling_status?: "COMPLIANT" | "NON_COMPLIANT"

// NEW: Equipment model tracking
equipment_model?: string | null
```

### 4. Enhanced `compliance_status.violations`
```typescript
// NEW fields in each violation
severity: "critical" | "warning" | "info"  // NEW
recommendation?: string  // NEW
```

### 5. NEW Top-Level Fields
```typescript
// Completely new sections
additional_observations?: {
  duct_sizing_notes?: string | null
  insulation_notes?: string | null
  safety_concerns?: string | null
  assumptions_made?: string[]
}

confidence_score?: number  // 0.0 to 1.0

reasoning?: string  // Brief explanation of key decisions

_validation?: {  // Added by backend validation
  passed: boolean
  warnings: string[]
  timestamp: number
}
```

## Recommended Frontend Updates (Optional)

### Phase 1: Update TypeScript Interfaces (Low Effort, High Value)

**File: `services/apiTypes.ts`**

```typescript
// Enhanced interfaces
export interface ProjectInfo {
  project_name: string;
  climate_zone: string;
  design_temp_heating: number;
  design_temp_cooling: number;
  // NEW: Optional fields
  building_type?: "residential" | "commercial";
  total_conditioned_area_sqft?: number;
}

export interface LoadBreakdownItem {
  component: string;
  area_sqft: number;
  u_value: number;
  load_btu: number;
}

export interface LoadCalculations {
  total_heating_load: number;
  total_cooling_load: number;
  calculation_method: string;
  // NEW: Component-level breakdowns
  heating_load_breakdown?: LoadBreakdownItem[];
  cooling_load_breakdown?: LoadBreakdownItem[];
}

export interface EquipmentAnalysis {
  proposed_heating_capacity: number;
  heating_oversize_percent: number;
  status: ComplianceStatus;  // Keep for backward compatibility
  proposed_cooling_capacity?: number;
  cooling_oversize_percent?: number;
  // NEW: Separate status per system
  heating_status?: "COMPLIANT" | "NON_COMPLIANT";
  cooling_status?: "COMPLIANT" | "NON_COMPLIANT";
  equipment_model?: string | null;
}

export interface ComplianceViolation {
  rule: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation?: string;  // NEW
}

// NEW interfaces
export interface AdditionalObservations {
  duct_sizing_notes?: string | null;
  insulation_notes?: string | null;
  safety_concerns?: string | null;
  assumptions_made?: string[];
}

export interface ValidationMetadata {
  passed: boolean;
  warnings: string[];
  timestamp: number;
}

export interface BackendAnalysisReport {
  project_info: ProjectInfo;
  load_calculations: LoadCalculations;
  equipment_analysis: EquipmentAnalysis;
  compliance_status: ComplianceStatusReport;
  request_id?: string;
  // NEW fields
  additional_observations?: AdditionalObservations;
  confidence_score?: number;
  reasoning?: string;
  _validation?: ValidationMetadata;
}
```

**Impact**: ✅ Zero breaking changes - all new fields are optional

### Phase 2: Display Enhanced Data (Medium Effort, High Value)

Create a structured report viewer instead of just markdown rendering.

**Suggested Component: `components/EnhancedReportViewer.tsx`**

```typescript
import React from 'react';
import { BackendAnalysisReport } from '../services/apiTypes';

interface Props {
  report: BackendAnalysisReport;
}

export const EnhancedReportViewer: React.FC<Props> = ({ report }) => {
  return (
    <div className="space-y-6">
      {/* Project Info Card */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h3 className="text-sm font-bold text-gray-200 mb-3">Project Information</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-500">Project:</span>
            <span className="text-gray-200 ml-2">{report.project_info.project_name}</span>
          </div>
          <div>
            <span className="text-gray-500">Climate Zone:</span>
            <span className="text-gray-200 ml-2">{report.project_info.climate_zone}</span>
          </div>
          {report.project_info.building_type && (
            <div>
              <span className="text-gray-500">Type:</span>
              <span className="text-gray-200 ml-2 capitalize">{report.project_info.building_type}</span>
            </div>
          )}
          {report.project_info.total_conditioned_area_sqft && (
            <div>
              <span className="text-gray-500">Area:</span>
              <span className="text-gray-200 ml-2">{report.project_info.total_conditioned_area_sqft.toLocaleString()} ft²</span>
            </div>
          )}
        </div>
      </div>

      {/* Load Calculations with Breakdown */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h3 className="text-sm font-bold text-gray-200 mb-3">Load Calculations</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Heating Load</span>
              <span className="text-sm font-bold text-orange-400">
                {report.load_calculations.total_heating_load.toLocaleString()} BTU/h
              </span>
            </div>
            
            {/* NEW: Component breakdown */}
            {report.load_calculations.heating_load_breakdown && (
              <div className="mt-2 space-y-1">
                {report.load_calculations.heating_load_breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-zinc-800/50 rounded px-2 py-1">
                    <span className="text-gray-400">{item.component}</span>
                    <span className="text-gray-300">{item.load_btu.toLocaleString()} BTU/h</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">Cooling Load</span>
              <span className="text-sm font-bold text-blue-400">
                {report.load_calculations.total_cooling_load.toLocaleString()} BTU/h
              </span>
            </div>
            
            {/* NEW: Component breakdown */}
            {report.load_calculations.cooling_load_breakdown && (
              <div className="mt-2 space-y-1">
                {report.load_calculations.cooling_load_breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-zinc-800/50 rounded px-2 py-1">
                    <span className="text-gray-400">{item.component}</span>
                    <span className="text-gray-300">{item.load_btu.toLocaleString()} BTU/h</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Analysis */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h3 className="text-sm font-bold text-gray-200 mb-3">Equipment Analysis</h3>
        
        <div className="space-y-3">
          {/* Heating */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-gray-400">Heating Capacity</div>
              <div className="text-sm text-gray-200">
                {report.equipment_analysis.proposed_heating_capacity.toLocaleString()} BTU/h
                <span className="text-xs text-orange-400 ml-2">
                  (+{report.equipment_analysis.heating_oversize_percent.toFixed(1)}%)
                </span>
              </div>
            </div>
            {/* NEW: Separate heating status */}
            <StatusBadge status={report.equipment_analysis.heating_status || report.equipment_analysis.status} />
          </div>

          {/* Cooling */}
          {report.equipment_analysis.proposed_cooling_capacity && (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-400">Cooling Capacity</div>
                <div className="text-sm text-gray-200">
                  {report.equipment_analysis.proposed_cooling_capacity.toLocaleString()} BTU/h
                  <span className="text-xs text-blue-400 ml-2">
                    (+{report.equipment_analysis.cooling_oversize_percent?.toFixed(1)}%)
                  </span>
                </div>
              </div>
              {/* NEW: Separate cooling status */}
              <StatusBadge status={report.equipment_analysis.cooling_status} />
            </div>
          )}

          {/* NEW: Equipment model */}
          {report.equipment_analysis.equipment_model && (
            <div className="text-xs text-gray-400 mt-2">
              Model: <span className="text-gray-300">{report.equipment_analysis.equipment_model}</span>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h3 className="text-sm font-bold text-gray-200 mb-3">Compliance Status</h3>
        
        {report.compliance_status.violations.length > 0 ? (
          <div className="space-y-2">
            {report.compliance_status.violations.map((violation, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded border ${
                  violation.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                  violation.severity === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-bold uppercase ${
                    violation.severity === 'critical' ? 'text-red-400' :
                    violation.severity === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {violation.severity}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-200">{violation.rule}</div>
                    <div className="text-xs text-gray-400 mt-1">{violation.description}</div>
                    {/* NEW: Recommendation */}
                    {violation.recommendation && (
                      <div className="text-xs text-gray-300 mt-2 italic">
                        💡 {violation.recommendation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-green-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            All compliance checks passed
          </div>
        )}
      </div>

      {/* NEW: Additional Observations */}
      {report.additional_observations && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <h3 className="text-sm font-bold text-gray-200 mb-3">Additional Observations</h3>
          <div className="space-y-3 text-xs">
            {report.additional_observations.duct_sizing_notes && (
              <div>
                <span className="text-gray-400 font-medium">Duct Sizing:</span>
                <p className="text-gray-300 mt-1">{report.additional_observations.duct_sizing_notes}</p>
              </div>
            )}
            {report.additional_observations.insulation_notes && (
              <div>
                <span className="text-gray-400 font-medium">Insulation:</span>
                <p className="text-gray-300 mt-1">{report.additional_observations.insulation_notes}</p>
              </div>
            )}
            {report.additional_observations.safety_concerns && (
              <div className="bg-red-500/10 border border-red-500/20 rounded p-2">
                <span className="text-red-400 font-medium">⚠️ Safety Concerns:</span>
                <p className="text-gray-300 mt-1">{report.additional_observations.safety_concerns}</p>
              </div>
            )}
            {report.additional_observations.assumptions_made && report.additional_observations.assumptions_made.length > 0 && (
              <div>
                <span className="text-gray-400 font-medium">Assumptions:</span>
                <ul className="list-disc list-inside text-gray-300 mt-1 space-y-1">
                  {report.additional_observations.assumptions_made.map((assumption, idx) => (
                    <li key={idx}>{assumption}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW: Confidence Score */}
      {report.confidence_score !== undefined && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Analysis Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    report.confidence_score >= 0.8 ? 'bg-green-500' :
                    report.confidence_score >= 0.6 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${report.confidence_score * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-200">
                {(report.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Reasoning */}
      {report.reasoning && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <h3 className="text-sm font-bold text-gray-200 mb-2">Analysis Reasoning</h3>
          <p className="text-xs text-gray-300 leading-relaxed">{report.reasoning}</p>
        </div>
      )}

      {/* NEW: Validation Warnings */}
      {report._validation && report._validation.warnings.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <h3 className="text-sm font-bold text-yellow-400 mb-2">⚠️ Validation Warnings</h3>
          <ul className="space-y-1">
            {report._validation.warnings.map((warning, idx) => (
              <li key={idx} className="text-xs text-gray-300">• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StatusBadge: React.FC<{ status?: string }> = ({ status }) => {
  if (!status) return null;
  
  const isCompliant = status === 'COMPLIANT';
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${
      isCompliant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
    }`}>
      {isCompliant ? '✓ COMPLIANT' : '✗ NON-COMPLIANT'}
    </span>
  );
};
```

### Phase 3: Update Usage (Low Effort)

**File: `features/RightPanel.tsx`**

Replace the markdown renderer with the enhanced viewer:

```typescript
// Replace this:
<MarkdownRenderer content={aiAnalysis} />

// With this:
{(() => {
  try {
    const parsedReport = JSON.parse(aiAnalysis);
    return <EnhancedReportViewer report={parsedReport} />;
  } catch (e) {
    // Fallback to markdown if parsing fails
    return <MarkdownRenderer content={aiAnalysis} />;
  }
})()}
```

## Migration Timeline

### Immediate (No Changes Required)
- ✅ Continue using existing code
- ✅ Backend returns all original fields
- ✅ TypeScript interfaces still valid

### Short-Term (Optional, Recommended)
1. **Update TypeScript interfaces** (1-2 hours)
   - Add optional fields to existing interfaces
   - Zero breaking changes
   - Better IDE autocomplete

2. **Add validation warning display** (30 minutes)
   - Show `_validation.warnings` if present
   - Helps with debugging

### Medium-Term (Optional, High Value)
3. **Create enhanced report viewer** (4-6 hours)
   - Structured display of load breakdowns
   - Separate heating/cooling status badges
   - Confidence score visualization
   - Additional observations section
   - Much better UX than plain markdown

4. **Add component-level charts** (2-3 hours)
   - Bar charts for load breakdowns
   - Pie charts for load distribution
   - Visual representation of data

## Testing Strategy

1. **Backward Compatibility Test**
   ```typescript
   // Existing code should work without changes
   const response = await analyzeDocument(file, mimeType);
   const report = JSON.parse(response.report);
   console.log(report.load_calculations.total_heating_load); // ✅ Works
   ```

2. **Enhanced Field Test**
   ```typescript
   // New fields are optional
   const report = JSON.parse(response.report);
   console.log(report.confidence_score); // ✅ May be undefined, that's OK
   console.log(report.load_calculations.heating_load_breakdown); // ✅ May be undefined
   ```

3. **Type Safety Test**
   ```typescript
   // TypeScript should not complain after updating interfaces
   const report: BackendAnalysisReport = JSON.parse(response.report);
   if (report.additional_observations?.safety_concerns) {
     // Show warning
   }
   ```

## FAQ

**Q: Do I need to update my frontend immediately?**  
A: No. The backend is fully backward compatible. All existing fields are still present.

**Q: What happens if I don't update the frontend?**  
A: Your app will continue to work perfectly. You just won't see the new enhanced data (breakdowns, confidence scores, etc.).

**Q: Will old reports in the database still work?**  
A: Yes. The frontend should handle both old and new report formats gracefully using optional chaining (`?.`).

**Q: What if the LLM doesn't return the new fields?**  
A: The backend validation adds `_validation` metadata, but the LLM might not always return all optional fields. Your frontend should handle undefined values gracefully.

**Q: Should I update the stored report format in the database?**  
A: Not necessary. The `content` field in `AnalysisReport` type can continue storing the JSON string. When you parse it, TypeScript will just see some fields as undefined if they're not present.

## Summary

✅ **No breaking changes** - Your frontend works as-is  
✅ **Backward compatible** - All original fields preserved  
✅ **Forward compatible** - New optional fields won't break anything  
✅ **Gradual migration** - Update at your own pace  
✅ **Better UX** - Enhanced display when you're ready  

The backend engineering is complete and running. Your frontend will continue to function perfectly. When you're ready to enhance the UI with the richer data, follow this guide for a smooth migration.
