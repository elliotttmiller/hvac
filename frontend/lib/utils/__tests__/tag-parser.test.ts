/**
 * Test suite for ISA-5.1 Tag Parser
 * Validates positional logic parsing against real-world examples
 */

import { parseISATag, describeISATag, looksLikeISATag, EXAMPLE_TAGS } from '../tag-parser';

describe('ISA-5.1 Tag Parser', () => {
  describe('parseISATag - Positional Logic', () => {
    test('PDIT - Pressure Differential Indicating Transmitter', () => {
      const result = parseISATag('PDIT-101');
      
      expect(result.measuredVariable).toBe('P');
      expect(result.measuredVariableName).toBe('Pressure');
      expect(result.modifier).toBe('D');
      expect(result.modifierName).toBe('Differential');
      expect(result.functions).toEqual([
        { letter: 'I', name: 'Indicator' },
        { letter: 'T', name: 'Transmitter' }
      ]);
      expect(result.loopNumber).toBe('101');
      expect(result.description).toBe('Pressure Differential Indicator Transmitter');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('FIT - Flow Indicating Transmitter', () => {
      const result = parseISATag('FIT-202');
      
      expect(result.measuredVariable).toBe('F');
      expect(result.measuredVariableName).toBe('Flow');
      expect(result.modifier).toBeNull(); // 'I' is NOT a modifier, it's a function
      expect(result.functions).toEqual([
        { letter: 'I', name: 'Indicator' },
        { letter: 'T', name: 'Transmitter' }
      ]);
      expect(result.description).toBe('Flow Indicator Transmitter');
    });

    test('LAL - Level Alarm Low', () => {
      const result = parseISATag('LAL-303');
      
      expect(result.measuredVariable).toBe('L');
      expect(result.measuredVariableName).toBe('Level');
      expect(result.modifier).toBeNull(); // 'A' is NOT a modifier
      expect(result.functions).toEqual([
        { letter: 'A', name: 'Alarm' },
        { letter: 'L', name: 'Low' }
      ]);
      expect(result.description).toBe('Level Alarm Low');
    });

    test('TT - Temperature Transmitter (dual T)', () => {
      const result = parseISATag('TT-909');
      
      expect(result.measuredVariable).toBe('T');
      expect(result.measuredVariableName).toBe('Temperature');
      expect(result.modifier).toBeNull();
      expect(result.functions).toEqual([
        { letter: 'T', name: 'Transmitter' }
      ]);
      // Second 'T' is Transmitter (function), not Temperature
      expect(result.description).toBe('Temperature Transmitter');
    });

    test('PSH - Pressure Switch High', () => {
      const result = parseISATag('PSH-505');
      
      expect(result.measuredVariable).toBe('P');
      expect(result.modifier).toBeNull(); // 'S' could be modifier, but only if Safety context
      expect(result.functions).toEqual([
        { letter: 'S', name: 'Switch' },
        { letter: 'H', name: 'High' }
      ]);
      expect(result.description).toBe('Pressure Switch High');
    });

    test('PDSH - Pressure Differential Switch High', () => {
      const result = parseISATag('PDSH-606');
      
      expect(result.measuredVariable).toBe('P');
      expect(result.modifier).toBe('D'); // 'D' in position 1 IS a modifier
      expect(result.modifierName).toBe('Differential');
      expect(result.functions).toEqual([
        { letter: 'S', name: 'Switch' },
        { letter: 'H', name: 'High' }
      ]);
      expect(result.description).toBe('Pressure Differential Switch High');
    });

    test('FV - Flow Valve', () => {
      const result = parseISATag('FV-707');
      
      expect(result.measuredVariable).toBe('F');
      expect(result.modifier).toBeNull();
      expect(result.functions).toEqual([
        { letter: 'V', name: 'Valve/Damper' }
      ]);
      expect(result.description).toBe('Flow Valve/Damper');
    });

    test('HS - Hand Switch', () => {
      const result = parseISATag('HS-111');
      
      expect(result.measuredVariable).toBe('H');
      expect(result.measuredVariableName).toBe('Hand (Manual)');
      expect(result.functions).toEqual([
        { letter: 'S', name: 'Switch' }
      ]);
      expect(result.description).toBe('Hand (Manual) Switch');
    });
  });

  describe('parseISATag - Edge Cases', () => {
    test('Tag without loop number', () => {
      const result = parseISATag('PDIT');
      
      expect(result.measuredVariable).toBe('P');
      expect(result.loopNumber).toBeNull();
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    test('Tag with suffix', () => {
      const result = parseISATag('FIT-202A');
      
      expect(result.loopNumber).toBe('202');
      expect(result.suffix).toBe('A');
    });

    test('Tag with spaces', () => {
      const result = parseISATag('PI T 101');
      
      expect(result.cleaned).toBe('PIT-101');
      expect(result.measuredVariable).toBe('P');
    });

    test('Invalid tag', () => {
      const result = parseISATag('XYZ123');
      
      // Should still parse but with lower confidence
      expect(result.confidence).toBeLessThan(1.0);
    });

    test('Empty tag', () => {
      const result = parseISATag('');
      
      expect(result.confidence).toBe(0);
    });
  });

  describe('describeISATag', () => {
    test('Generate human-readable descriptions', () => {
      expect(describeISATag('PDIT-101')).toBe('Pressure Differential Indicator Transmitter');
      expect(describeISATag('FIT-202')).toBe('Flow Indicator Transmitter');
      expect(describeISATag('LAL-303')).toBe('Level Alarm Low');
      expect(describeISATag('TT-909')).toBe('Temperature Transmitter');
    });
  });

  describe('looksLikeISATag', () => {
    test('Valid ISA tag patterns', () => {
      expect(looksLikeISATag('PDIT-101')).toBe(true);
      expect(looksLikeISATag('FIT202')).toBe(true);
      expect(looksLikeISATag('LAL')).toBe(true);
      expect(looksLikeISATag('TT-909A')).toBe(true);
    });

    test('Invalid patterns', () => {
      expect(looksLikeISATag('NotATag')).toBe(false);
      expect(looksLikeISATag('123')).toBe(false);
      expect(looksLikeISATag('')).toBe(false);
    });
  });

  describe('Example Tags Documentation', () => {
    test('All example tags should parse correctly', () => {
      Object.keys(EXAMPLE_TAGS).forEach(tag => {
        const result = parseISATag(tag);
        expect(result.confidence).toBeGreaterThan(0.8);
        expect(result.measuredVariable).not.toBeNull();
      });
    });
  });

  describe('Positional Logic Validation', () => {
    test('Modifier D only in position 1', () => {
      const pdit = parseISATag('PDIT-101');
      const pit = parseISATag('PIT-101');
      
      // PDIT: P[0]=Pressure, D[1]=Differential(modifier), I[2]=Indicator, T[3]=Transmitter
      expect(pdit.modifier).toBe('D');
      expect(pdit.modifierName).toBe('Differential');
      
      // PIT: P[0]=Pressure, I[1]=Indicator(function), T[2]=Transmitter(function)
      expect(pit.modifier).toBeNull();
      expect(pit.functions.length).toBe(2);
    });

    test('Letter T has dual meaning based on position', () => {
      const tt = parseISATag('TT-909');
      
      // First T = Temperature (position 0, measured variable)
      expect(tt.measuredVariable).toBe('T');
      expect(tt.measuredVariableName).toBe('Temperature');
      
      // Second T = Transmitter (position 1, function)
      expect(tt.functions[0].letter).toBe('T');
      expect(tt.functions[0].name).toBe('Transmitter');
    });

    test('Letter V has dual meaning based on position', () => {
      const fv = parseISATag('FV-707');
      
      // V in position 1+ = Valve (function)
      expect(fv.measuredVariable).toBe('F');
      expect(fv.functions[0].letter).toBe('V');
      expect(fv.functions[0].name).toBe('Valve/Damper');
    });
  });
});
