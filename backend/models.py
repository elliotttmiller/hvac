"""
Pydantic models for strict type safety across the HVAC inference pipeline.
All API requests, responses, and MCP tool interactions use these models.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any, Literal
from enum import Enum


class ComplianceStatus(str, Enum):
    """Compliance status enum for equipment analysis."""
    COMPLIANT = "COMPLIANT"
    NON_COMPLIANT = "NON_COMPLIANT"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    EXEMPT_MODULATING = "EXEMPT_MODULATING"  # Modulating equipment exempt from 40% heating limit


class PDFQuality(str, Enum):
    """PDF rendering quality presets."""
    FAST = "fast"  # 1.5x zoom - faster processing
    BALANCED = "balanced"  # 2.0x zoom - default
    DETAILED = "detailed"  # 3.0x zoom - for complex blueprints
    ULTRA = "ultra"  # 4.0x zoom - maximum quality


class AnalyzeRequest(BaseModel):
    """Request payload for document analysis."""
    file_base64: str = Field(..., description="Base64-encoded file data")
    mime_type: str = Field(..., description="MIME type of the file")
    max_pages: Optional[int] = Field(
        20, 
        ge=1, 
        le=100,  # Upper limit can be adjusted in config
        description="Maximum pages to process (development default: 20)"
    )
    quality: Optional[PDFQuality] = Field(PDFQuality.BALANCED, description="PDF rendering quality")
    
    @field_validator('file_base64')
    @classmethod
    def validate_base64(cls, v: str) -> str:
        """Ensure base64 string is not empty."""
        if not v or len(v) < 10:
            raise ValueError("file_base64 must be a valid base64 string")
        return v


class UploadRequest(BaseModel):
    """Request payload for PDF upload."""
    file_base64: str = Field(..., description="Base64-encoded PDF data")
    filename: Optional[str] = Field(None, description="Original filename")
    
    @field_validator('file_base64')
    @classmethod
    def validate_base64(cls, v: str) -> str:
        """Ensure base64 string is not empty."""
        if not v or len(v) < 10:
            raise ValueError("file_base64 must be a valid base64 string")
        return v


class ProjectInfo(BaseModel):
    """Project identification information."""
    project_name: str = Field(default="Unnamed Project")
    climate_zone: str = Field(default="7")
    design_temp_heating_f: int = Field(default=-17)
    design_temp_cooling_f: int = Field(default=89)
    building_type: str = Field(default="residential")
    total_conditioned_area_sqft: float = Field(default=0, ge=0)
    design_humidity_winter_percent: int = Field(default=30, ge=0, le=100)
    design_humidity_summer_percent: int = Field(default=50, ge=0, le=100)


class InfiltrationVentilation(BaseModel):
    """Infiltration and ventilation load components."""
    infiltration_cfm: float = Field(default=0, ge=0)
    infiltration_load_heating_btu: float = Field(default=0, ge=0)
    infiltration_load_cooling_sensible_btu: float = Field(default=0, ge=0)
    infiltration_load_cooling_latent_btu: float = Field(default=0, ge=0)
    ventilation_cfm_required: float = Field(default=0, ge=0)
    ventilation_method: Optional[str] = Field(default=None)


class InternalGains(BaseModel):
    """Internal heat gains from occupants, lighting, and appliances."""
    people_count: int = Field(default=0, ge=0)
    people_load_btu: float = Field(default=0, ge=0)
    lighting_load_btu: float = Field(default=0, ge=0)
    appliances_load_btu: float = Field(default=0, ge=0)
    total_internal_gains_btu: float = Field(default=0, ge=0)


class LoadCalculations(BaseModel):
    """Heating and cooling load calculations."""
    total_heating_load: int = Field(..., ge=0, description="Total heating load in BTU/h")
    total_cooling_load: int = Field(..., ge=0, description="Total cooling load in BTU/h")
    total_cooling_load_sensible: Optional[int] = Field(None, ge=0, description="Sensible cooling load in BTU/h")
    total_cooling_load_latent: Optional[int] = Field(None, ge=0, description="Latent cooling load in BTU/h")
    calculation_method: str = Field(default="Manual J")
    infiltration_ventilation: Optional[InfiltrationVentilation] = Field(default=None)
    internal_gains: Optional[InternalGains] = Field(default=None)


class EquipmentAnalysis(BaseModel):
    """Equipment sizing and compliance analysis."""
    proposed_heating_capacity: int = Field(..., ge=0)
    heating_oversize_percent: float = Field(..., ge=0.0, le=100.0)
    status: ComplianceStatus
    proposed_cooling_capacity: Optional[int] = Field(None, ge=0)
    cooling_oversize_percent: Optional[float] = Field(None, ge=0.0, le=100.0)
    # Enhanced fields for equipment intelligence
    equipment_type: Optional[str] = Field(None, description="Package Unit, Split System, Mini-Split, RTU, etc.")
    equipment_stages: Optional[str] = Field(None, description="single-stage, two-stage, modulating, variable-speed")
    fuel_type: Optional[str] = Field(None, description="natural gas, propane, electric, oil, geothermal")
    equipment_model: Optional[str] = Field(None)
    manufacturer: Optional[str] = Field(None)
    efficiency_heating: Optional[float] = Field(None, description="AFUE% or HSPF")
    efficiency_cooling: Optional[float] = Field(None, description="SEER or SEER2")
    airflow_rated_cfm: Optional[float] = Field(None, ge=0)
    airflow_required_cfm: Optional[float] = Field(None, ge=0)
    airflow_per_ton_cooling: Optional[float] = Field(None, ge=0)


class ComplianceViolation(BaseModel):
    """Individual compliance violation."""
    rule: str = Field(..., description="MN Rule or code reference")
    description: str = Field(..., description="Violation description")
    severity: Literal["critical", "warning", "info"] = Field(default="warning")


class VentilationCompliance(BaseModel):
    """Ventilation compliance status."""
    required_cfm: float = Field(default=0, ge=0)
    provided_cfm: Optional[float] = Field(None, ge=0)
    status: Literal["COMPLIANT", "NON_COMPLIANT", "UNKNOWN"] = Field(default="UNKNOWN")


class EconomizerCompliance(BaseModel):
    """Economizer compliance status."""
    required: bool = Field(default=False)
    provided: Optional[bool] = Field(None)
    status: Literal["COMPLIANT", "NON_COMPLIANT", "NOT_APPLICABLE"] = Field(default="NOT_APPLICABLE")


class ComplianceStatusReport(BaseModel):
    """Overall compliance status with violations."""
    violations: List[ComplianceViolation] = Field(default_factory=list)
    overall_status: ComplianceStatus
    ventilation_compliance: Optional[VentilationCompliance] = Field(default=None)
    economizer_compliance: Optional[EconomizerCompliance] = Field(default=None)


class AnalysisReport(BaseModel):
    """Complete engineering analysis report (strict JSON schema)."""
    project_info: ProjectInfo
    load_calculations: LoadCalculations
    equipment_analysis: EquipmentAnalysis
    compliance_status: ComplianceStatusReport
    request_id: Optional[str] = Field(None, description="Tracing ID for observability")


class AnalyzeResponse(BaseModel):
    """Response from /api/analyze endpoint."""
    report: str = Field(..., description="JSON string of AnalysisReport")
    request_id: str = Field(..., description="Request tracking ID")
    pages_processed: int = Field(..., ge=0)
    processing_time_seconds: Optional[float] = Field(None, ge=0.0)


class UploadResponse(BaseModel):
    """Response from /api/upload endpoint."""
    upload_id: str
    filename: str
    pages: List[str] = Field(..., description="Base64 data URLs for page previews")
    total_pages: int = Field(..., ge=0)
    request_id: str


class ModelStatus(BaseModel):
    """Model availability status."""
    model: str
    loaded: bool
    matched_model: Optional[str] = None
    available: List[str] = Field(default_factory=list)
    error: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    request_id: Optional[str] = Field(None, description="Request tracking ID")


# MCP Tool Models
class PDFMetadata(BaseModel):
    """PDF metadata from split_pdf_metadata tool."""
    total_pages: int = Field(..., ge=0)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None


class PageImageData(BaseModel):
    """Rendered page image from render_page_for_vision tool."""
    image_data: str = Field(..., description="Base64-encoded PNG image")
    page_number: Optional[int] = Field(None, ge=1)
    width: Optional[int] = Field(None, ge=0)
    height: Optional[int] = Field(None, ge=0)
    error: Optional[str] = None


class LoadCalculationInput(BaseModel):
    """Input for Manual J load calculation."""
    area_sqft: float = Field(..., gt=0, description="Area in square feet")
    u_value: float = Field(..., gt=0, description="U-value (thermal transmittance)")
    is_basement: bool = Field(default=False)


class LoadCalculationOutput(BaseModel):
    """Output from load calculation."""
    load_btu: int = Field(..., ge=0, description="Calculated load in BTU/h")
    formula_used: str = Field(default="Area × U-Value × ΔT")


class ComplianceCheckInput(BaseModel):
    """Input for compliance check."""
    load: int = Field(..., gt=0, description="Design load in BTU/h")
    capacity: int = Field(..., gt=0, description="Equipment capacity in BTU/h")


class ComplianceCheckOutput(BaseModel):
    """Output from compliance check."""
    status: Literal["PASS", "FAIL"]
    oversize_pct: float = Field(..., ge=0.0)
    limit_pct: float = Field(default=40.0)
    message: str
