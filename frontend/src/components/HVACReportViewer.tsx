import React from 'react';
import { BackendAnalysisReport } from '../services/apiTypes';
import { Icons } from './Icons';

interface Props {
  report: BackendAnalysisReport;
}

export const HVACReportViewer: React.FC<Props> = ({ report }) => {
  const formatNumber = (num?: number) => (typeof num === 'number' ? num.toLocaleString() : '—');

  // Defensive defaults: backend may return partial reports. Use safe fallbacks
  // so the viewer doesn't crash when a section is missing.
  const project = report?.project_info ?? {} as any;
  const loads = report?.load_calculations ?? {} as any;
  const equipment = report?.equipment_analysis ?? {} as any;
  const compliance = report?.compliance_status ?? { violations: [] } as any;
  const obs = report?.additional_observations ?? {} as any;

  // Detect missing high-level sections so we can show a helpful banner to the user
  const missingSections: string[] = [];
  if (!report?.project_info) missingSections.push('Project Info');
  if (!report?.load_calculations) missingSections.push('Load Calculations');
  if (!report?.equipment_analysis) missingSections.push('Equipment Analysis');
  if (!report?.compliance_status) missingSections.push('Compliance Status');

  return (
    <div className="space-y-4">
      {/* Project Header */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
        {missingSections.length > 0 && (
          <div className="mb-3 p-2 rounded border border-yellow-400/20 bg-yellow-900/5 text-[12px] text-yellow-200">
            <strong>Partial report:</strong> The analysis returned incomplete data. Missing sections: {missingSections.join(', ')}.
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-200">
            {project.project_name ?? 'Untitled project'}
          </h3>
          <span className="text-xs text-gray-500">
            {project.climate_zone ? `Climate Zone ${project.climate_zone}` : 'Climate Zone —'}
          </span>
        </div>
        {project.total_conditioned_area_sqft != null && (
          <div className="text-xs text-gray-400">
            <span className="font-medium text-gray-300">
              {formatNumber(project.total_conditioned_area_sqft)}
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
                {formatNumber(loads.total_heating_load)} BTU/h
              </span>
            </div>
            {loads.heating_load_breakdown && loads.heating_load_breakdown.length > 0 && (
              <div className="space-y-1 mt-2">
                {loads.heating_load_breakdown.map((item: any, idx: number) => (
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
                {formatNumber(loads.total_cooling_load)} BTU/h
              </span>
            </div>
            {loads.cooling_load_breakdown && loads.cooling_load_breakdown.length > 0 && (
              <div className="space-y-1 mt-2">
                {loads.cooling_load_breakdown.map((item: any, idx: number) => (
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
                {formatNumber(equipment.proposed_heating_capacity)} BTU/h
                <span className={`text-xs ml-2 ${
                  (equipment.heating_oversize_percent || 0) <= 40 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  +{(typeof equipment.heating_oversize_percent === 'number' ? equipment.heating_oversize_percent.toFixed(1) : '0.0')}%
                </span>
              </div>
            </div>
            <ComplianceBadge 
              status={equipment.heating_status || equipment.status} 
            />
          </div>

          {/* Cooling Equipment */}
          {equipment.proposed_cooling_capacity && (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Cooling Capacity</div>
                <div className="text-sm text-gray-200">
                  {formatNumber(equipment.proposed_cooling_capacity)} BTU/h
                  <span className={`text-xs ml-2 ${
                    (equipment.cooling_oversize_percent || 0) <= 15 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    +{(typeof equipment.cooling_oversize_percent === 'number' ? equipment.cooling_oversize_percent.toFixed(1) : '—')}%
                  </span>
                </div>
              </div>
              {equipment.cooling_status && (
                <ComplianceBadge status={equipment.cooling_status} />
              )}
            </div>
          )}

          {/* Equipment Model */}
          {equipment.equipment_model && (
            <div className="pt-2 border-t border-zinc-800">
              <div className="text-xs text-gray-400">
                Model: <span className="text-gray-300 font-mono">
                  {equipment.equipment_model}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compliance Status */}
      {compliance.violations && compliance.violations.length > 0 && (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Code Compliance
          </h3>
          
          <div className="space-y-2">
            {compliance.violations.map((violation: any, idx: number) => (
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
