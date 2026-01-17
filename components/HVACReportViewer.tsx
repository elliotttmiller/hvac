import React from 'react';
import { BackendAnalysisReport, LoadBreakdownItem } from '../services/apiTypes';
import { Icons } from './Icons';

interface Props {
  report: BackendAnalysisReport;
}

export const HVACReportViewer: React.FC<Props> = ({ report }) => {
  const formatNumber = (num: number) => num.toLocaleString();
  
  return (
    <div className="space-y-4">
      {/* Project Header */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-200">
            {report.project_info.project_name}
          </h3>
          <span className="text-xs text-gray-500">
            Climate Zone {report.project_info.climate_zone}
          </span>
        </div>
        {report.project_info.total_conditioned_area_sqft && (
          <div className="text-xs text-gray-400">
            <span className="font-medium text-gray-300">
              {formatNumber(report.project_info.total_conditioned_area_sqft)}
            </span>{' '}
            ft² conditioned area
          </div>
        )}
      </div>

      {/* Load Calculations */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Load Calculations
        </h3>
        
        <div className="space-y-3">
          {/* Heating Load */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Heating Load</span>
              <span className="text-sm font-bold text-orange-400">
                {formatNumber(report.load_calculations.total_heating_load)} BTU/h
              </span>
            </div>
            {report.load_calculations.heating_load_breakdown && 
             report.load_calculations.heating_load_breakdown.length > 0 && (
              <div className="space-y-1 mt-2">
                {report.load_calculations.heating_load_breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-zinc-800/50 rounded px-2 py-1.5">
                    <span className="text-gray-400">{item.component}</span>
                    <span className="text-gray-300 font-mono">
                      {formatNumber(item.load_btu)} BTU/h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cooling Load */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Cooling Load</span>
              <span className="text-sm font-bold text-blue-400">
                {formatNumber(report.load_calculations.total_cooling_load)} BTU/h
              </span>
            </div>
            {report.load_calculations.cooling_load_breakdown && 
             report.load_calculations.cooling_load_breakdown.length > 0 && (
              <div className="space-y-1 mt-2">
                {report.load_calculations.cooling_load_breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-zinc-800/50 rounded px-2 py-1.5">
                    <span className="text-gray-400">{item.component}</span>
                    <span className="text-gray-300 font-mono">
                      {formatNumber(item.load_btu)} BTU/h
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Analysis */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Equipment Sizing
        </h3>
        
        <div className="space-y-3">
          {/* Heating Equipment */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">Heating Capacity</div>
              <div className="text-sm text-gray-200">
                {formatNumber(report.equipment_analysis.proposed_heating_capacity)} BTU/h
                <span className={`text-xs ml-2 ${
                  report.equipment_analysis.heating_oversize_percent <= 40 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  +{report.equipment_analysis.heating_oversize_percent.toFixed(1)}%
                </span>
              </div>
            </div>
            <ComplianceBadge 
              status={report.equipment_analysis.heating_status || report.equipment_analysis.status} 
            />
          </div>

          {/* Cooling Equipment */}
          {report.equipment_analysis.proposed_cooling_capacity && (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Cooling Capacity</div>
                <div className="text-sm text-gray-200">
                  {formatNumber(report.equipment_analysis.proposed_cooling_capacity)} BTU/h
                  <span className={`text-xs ml-2 ${
                    (report.equipment_analysis.cooling_oversize_percent || 0) <= 15 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    +{report.equipment_analysis.cooling_oversize_percent?.toFixed(1)}%
                  </span>
                </div>
              </div>
              {report.equipment_analysis.cooling_status && (
                <ComplianceBadge status={report.equipment_analysis.cooling_status} />
              )}
            </div>
          )}

          {/* Equipment Model */}
          {report.equipment_analysis.equipment_model && (
            <div className="pt-2 border-t border-zinc-800">
              <div className="text-xs text-gray-400">
                Model: <span className="text-gray-300 font-mono">
                  {report.equipment_analysis.equipment_model}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Status */}
      {report.compliance_status.violations && report.compliance_status.violations.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Code Compliance
          </h3>
          
          <div className="space-y-2">
            {report.compliance_status.violations.map((violation, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded border ${
                  violation.severity === 'critical' 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : violation.severity === 'warning'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    violation.severity === 'critical' 
                      ? 'bg-red-500/20 text-red-300' 
                      : violation.severity === 'warning'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {violation.severity}
                  </span>
                  <span className="text-xs font-medium text-gray-300">
                    {violation.rule}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {violation.description}
                </p>
                {violation.recommendation && (
                  <div className="mt-2 pt-2 border-t border-zinc-700/50">
                    <p className="text-xs text-gray-300">
                      <span className="font-medium">Recommendation:</span> {violation.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Observations */}
      {report.additional_observations && (
        <>
          {/* Safety Concerns - Always show prominently if present */}
          {report.additional_observations.safety_concerns && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <Icons.AlertCircle width={16} height={16} className="text-red-400 shrink-0 mt-0.5" />
                <h3 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                  Safety Concerns
                </h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {report.additional_observations.safety_concerns}
              </p>
            </div>
          )}

          {/* Other Observations */}
          {(report.additional_observations.duct_sizing_notes || 
            report.additional_observations.insulation_notes ||
            (report.additional_observations.assumptions_made && 
             report.additional_observations.assumptions_made.length > 0)) && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Technical Notes
              </h3>
              
              <div className="space-y-3 text-xs">
                {report.additional_observations.duct_sizing_notes && (
                  <div>
                    <span className="text-gray-400 font-medium">Duct Sizing:</span>
                    <p className="text-gray-300 mt-1 leading-relaxed">
                      {report.additional_observations.duct_sizing_notes}
                    </p>
                  </div>
                )}
                
                {report.additional_observations.insulation_notes && (
                  <div>
                    <span className="text-gray-400 font-medium">Insulation:</span>
                    <p className="text-gray-300 mt-1 leading-relaxed">
                      {report.additional_observations.insulation_notes}
                    </p>
                  </div>
                )}
                
                {report.additional_observations.assumptions_made && 
                 report.additional_observations.assumptions_made.length > 0 && (
                  <div>
                    <span className="text-gray-400 font-medium">Design Assumptions:</span>
                    <ul className="list-disc list-inside text-gray-300 mt-1 space-y-1">
                      {report.additional_observations.assumptions_made.map((assumption, idx) => (
                        <li key={idx} className="leading-relaxed">{assumption}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Engineering Analysis */}
      {report.reasoning && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            Engineering Analysis
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            {report.reasoning}
          </p>
        </div>
      )}
    </div>
  );
};

const ComplianceBadge: React.FC<{ status: string }> = ({ status }) => {
  const isCompliant = status === 'COMPLIANT';
  
  return (
    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
      isCompliant 
        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
        : 'bg-red-500/20 text-red-400 border border-red-500/30'
    }`}>
      {isCompliant ? '✓ Pass' : '✗ Fail'}
    </div>
  );
};
