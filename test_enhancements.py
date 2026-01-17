#!/usr/bin/env python3
"""
Comprehensive test script for HVAC AI enhancements.
Tests all new features and validates accuracy improvements.
"""

import json
import sys
sys.path.insert(0, 'backend')

from backend.models import *
from backend.utils import validate_hvac_analysis_output
from backend.constants import MN_HVAC_SYSTEM_INSTRUCTION, BLUEPRINT_EXTRACTION_PROMPT
from backend.mcp_servers.engineering_server import (
    calculate_ventilation_requirement,
    calculate_solar_heat_gain,
    validate_equipment_type,
    check_economizer_requirement
)

def test_enhanced_models():
    """Test enhanced Pydantic models with new fields."""
    print("\n=== Testing Enhanced Models ===")
    
    # Test ProjectInfo with new fields
    proj = ProjectInfo(
        project_name="Test Project",
        total_conditioned_area_sqft=2500,
        design_temp_heating_f=-17,
        design_temp_cooling_f=89,
        design_humidity_winter_percent=30,
        design_humidity_summer_percent=50
    )
    assert proj.design_humidity_winter_percent == 30
    print("✓ ProjectInfo with humidity tracking works")
    
    # Test InfiltrationVentilation model
    infiltration = InfiltrationVentilation(
        infiltration_cfm=75,
        infiltration_load_heating_btu=6525,
        ventilation_cfm_required=90,
        ventilation_method="ERV"
    )
    assert infiltration.ventilation_method == "ERV"
    print("✓ InfiltrationVentilation model works")
    
    # Test InternalGains model
    gains = InternalGains(
        people_count=4,
        people_load_btu=1000,
        lighting_load_btu=400,
        appliances_load_btu=800,
        total_internal_gains_btu=2200
    )
    assert gains.total_internal_gains_btu == 2200
    print("✓ InternalGains model works")
    
    # Test enhanced EquipmentAnalysis
    eq = EquipmentAnalysis(
        proposed_heating_capacity=80000,
        heating_oversize_percent=33.3,
        status=ComplianceStatus.EXEMPT_MODULATING,
        equipment_type="Split System",
        equipment_stages="modulating",
        fuel_type="natural gas",
        manufacturer="Carrier",
        equipment_model="59MN7",
        efficiency_heating=96.5,
        efficiency_cooling=16.0,
        airflow_rated_cfm=1600,
        airflow_required_cfm=1600,
        airflow_per_ton_cooling=400
    )
    assert eq.equipment_type == "Split System"
    assert eq.status == ComplianceStatus.EXEMPT_MODULATING
    print("✓ EquipmentAnalysis with 10 new fields works")
    
    # Test compliance models
    vent_compliance = VentilationCompliance(
        required_cfm=90,
        provided_cfm=100,
        status="COMPLIANT"
    )
    assert vent_compliance.status == "COMPLIANT"
    print("✓ VentilationCompliance model works")
    
    econ_compliance = EconomizerCompliance(
        required=True,
        provided=True,
        status="COMPLIANT"
    )
    assert econ_compliance.required == True
    print("✓ EconomizerCompliance model works")
    
    print("✅ All model tests passed\n")


def test_mcp_tools():
    """Test new MCP tools."""
    print("=== Testing New MCP Tools ===")
    
    # Test ventilation calculation
    result = calculate_ventilation_requirement(2500, 3)
    data = json.loads(result)
    assert data["total_required_cfm"] == 105.0
    assert "recommendations" in data
    print(f"✓ Ventilation: {data['total_required_cfm']} CFM for 2500 sqft, 3 BR")
    
    # Test solar gain calculation
    result = calculate_solar_heat_gain(100, 'W', 0.40)
    data = json.loads(result)
    assert data["solar_heat_gain_btu"] == 4480.0
    print(f"✓ Solar gain: {data['solar_heat_gain_btu']} BTU/h for 100 sqft west window")
    
    # Test equipment type validation
    result = validate_equipment_type('modulating', 'residential', 'high')
    data = json.loads(result)
    assert data["appropriate"] == True
    assert "Exempt" in data["code_note"] or "exempt" in data["code_note"]
    print(f"✓ Equipment validation: Modulating is {data['appropriate']} for high variability")
    
    # Test economizer requirement
    result = check_economizer_requirement(60000, 7)
    data = json.loads(result)
    assert data["economizer_required"] == True
    print(f"✓ Economizer: Required={data['economizer_required']} for 60k BTU (5 ton)")
    
    # Test with equipment below threshold
    result = check_economizer_requirement(48000, 7)
    data = json.loads(result)
    assert data["economizer_required"] == False
    print(f"✓ Economizer: Required={data['economizer_required']} for 48k BTU (4 ton)")
    
    print("✅ All MCP tool tests passed\n")


def test_validation_logic():
    """Test enhanced validation logic."""
    print("=== Testing Enhanced Validation Logic ===")
    
    # Test modulating equipment exemption
    # The validation doesn't change COMPLIANT status, it just validates NON_COMPLIANT situations
    # So we test that modulating equipment that would be NON_COMPLIANT gets marked as EXEMPT
    test_data = {
        'project_info': {'project_name': 'Test'},
        'load_calculations': {'total_heating_load': 60000, 'total_cooling_load': 36000},
        'equipment_analysis': {
            'proposed_heating_capacity': 100000,  # 67% oversize (would violate 40% limit)
            'heating_oversize_percent': 66.7,
            'heating_status': 'NON_COMPLIANT',  # Start as NON_COMPLIANT
            'equipment_stages': 'modulating',  # But it's modulating so should be exempt
            'proposed_cooling_capacity': 40000,
            'cooling_oversize_percent': 11.1,
            'cooling_status': 'COMPLIANT'
        },
        'compliance_status': {'overall_status': 'PASS', 'violations': []},
        'confidence_score': 0.85
    }
    validated = validate_hvac_analysis_output(test_data)
    assert validated['equipment_analysis']['heating_status'] == 'EXEMPT_MODULATING'
    print("✓ Modulating equipment properly exempt from 40% limit")
    
    # Test single-stage equipment violation
    test_data2 = {
        'project_info': {'project_name': 'Test'},
        'load_calculations': {'total_heating_load': 60000, 'total_cooling_load': 36000},
        'equipment_analysis': {
            'proposed_heating_capacity': 100000,  # 67% oversize
            'heating_oversize_percent': 66.7,
            'heating_status': 'COMPLIANT',  # Wrong, should be NON_COMPLIANT
            'equipment_stages': 'single-stage',  # Not exempt
        },
        'compliance_status': {'overall_status': 'PASS', 'violations': []},
        'confidence_score': 0.85
    }
    validated2 = validate_hvac_analysis_output(test_data2)
    assert validated2['equipment_analysis']['heating_status'] == 'NON_COMPLIANT'
    print("✓ Single-stage equipment violation properly detected")
    
    # Test airflow validation
    test_data3 = {
        'project_info': {'project_name': 'Test'},
        'load_calculations': {'total_heating_load': 60000, 'total_cooling_load': 36000},
        'equipment_analysis': {
            'proposed_heating_capacity': 80000,
            'heating_oversize_percent': 33.3,
            'heating_status': 'COMPLIANT',
            'airflow_per_ton_cooling': 300  # Too low (should be 350-450)
        },
        'compliance_status': {'overall_status': 'PASS', 'violations': []},
        'confidence_score': 0.85
    }
    validated3 = validate_hvac_analysis_output(test_data3)
    assert len(validated3['_validation']['warnings']) > 0
    assert 'Airflow' in str(validated3['_validation']['warnings'])
    print("✓ Airflow per ton validation works")
    
    # Test cooling load component validation
    test_data4 = {
        'project_info': {'project_name': 'Test'},
        'load_calculations': {
            'total_heating_load': 60000,
            'total_cooling_load': 36000,
            'total_cooling_load_sensible': 25000,
            'total_cooling_load_latent': 8000  # 33000 != 36000
        },
        'equipment_analysis': {
            'proposed_heating_capacity': 80000,
            'heating_oversize_percent': 33.3,
            'heating_status': 'COMPLIANT'
        },
        'compliance_status': {'overall_status': 'PASS', 'violations': []},
        'confidence_score': 0.85
    }
    validated4 = validate_hvac_analysis_output(test_data4)
    assert len(validated4['_validation']['warnings']) > 0
    print("✓ Cooling load component validation works")
    
    print("✅ All validation tests passed\n")


def test_prompt_enhancements():
    """Test that prompts have been enhanced."""
    print("=== Testing Prompt Enhancements ===")
    
    # Check system instruction length and content
    assert len(MN_HVAC_SYSTEM_INSTRUCTION) > 7000, "System instruction should be > 7000 chars"
    assert "modulating" in MN_HVAC_SYSTEM_INSTRUCTION.lower()
    assert "infiltration" in MN_HVAC_SYSTEM_INSTRUCTION.lower()
    assert "ventilation" in MN_HVAC_SYSTEM_INSTRUCTION.lower()
    assert "solar" in MN_HVAC_SYSTEM_INSTRUCTION.lower()
    assert "sensible" in MN_HVAC_SYSTEM_INSTRUCTION.lower()
    print(f"✓ System instruction: {len(MN_HVAC_SYSTEM_INSTRUCTION)} chars with comprehensive guidance")
    
    # Check extraction prompt length and content
    assert len(BLUEPRINT_EXTRACTION_PROMPT) > 2500, "Extraction prompt should be > 2500 chars"
    assert "Package Unit" in BLUEPRINT_EXTRACTION_PROMPT
    assert "Split System" in BLUEPRINT_EXTRACTION_PROMPT
    assert "modulating" in BLUEPRINT_EXTRACTION_PROMPT.lower()
    assert "ISA-5.1" in BLUEPRINT_EXTRACTION_PROMPT
    assert "SHGC" in BLUEPRINT_EXTRACTION_PROMPT
    print(f"✓ Extraction prompt: {len(BLUEPRINT_EXTRACTION_PROMPT)} chars with equipment type recognition")
    
    print("✅ All prompt tests passed\n")


def main():
    """Run all tests."""
    print("\n" + "="*60)
    print("HVAC AI Enhancement Comprehensive Test Suite")
    print("="*60)
    
    try:
        test_enhanced_models()
        test_mcp_tools()
        test_validation_logic()
        test_prompt_enhancements()
        
        print("="*60)
        print("✅ ALL TESTS PASSED - ENHANCEMENTS VALIDATED")
        print("="*60)
        print("\nSummary:")
        print("• Enhanced models with 20+ new fields ✓")
        print("• 4 new MCP tools for HVAC calculations ✓")
        print("• Intelligent validation with equipment type awareness ✓")
        print("• Comprehensive prompts with HVAC specialization ✓")
        print("\nVersion 2.2.0 - Ready for Production")
        return 0
    
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        return 1
    except Exception as e:
        print(f"\n❌ UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
