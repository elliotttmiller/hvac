/**
 * Geometry utilities test suite
 * Tests bbox normalization and coordinate conversion
 */

import { normalizeBackendBBox, convertNormalizedToDisplay, convertCoordinateFormat, NormBBox } from '../geometry';

describe('normalizeBackendBBox', () => {
  describe('canonical format (default)', () => {
    it('should preserve canonical [xmin, ymin, xmax, ymax] format by default', () => {
      const input = [0.476, 0.065, 0.563, 0.111];
      const result = normalizeBackendBBox(input);
      expect(result).toEqual([0.476, 0.065, 0.563, 0.111]);
    });

    it('should NOT swap coordinates for wide images where x > y', () => {
      // This was the bug: when x1 > y1 AND x2 > y2, it incorrectly swapped
      const input = [0.476, 0.065, 0.563, 0.111];
      const result = normalizeBackendBBox(input);
      // Should remain unchanged (NOT swap to [0.065, 0.476, 0.111, 0.563])
      expect(result).toEqual([0.476, 0.065, 0.563, 0.111]);
    });

    it('should handle coordinates where x < y without swapping', () => {
      const input = [0.123, 0.252, 0.151, 0.285];
      const result = normalizeBackendBBox(input);
      expect(result).toEqual([0.123, 0.252, 0.151, 0.285]);
    });

    it('should clip values to [0,1] range', () => {
      const input = [-0.1, 0.5, 1.2, 0.8];
      const result = normalizeBackendBBox(input);
      expect(result).toEqual([0, 0.5, 1, 0.8]);
    });

    it('should handle 0-1000 normalized coordinates', () => {
      const input = [476, 65, 563, 111];
      const result = normalizeBackendBBox(input);
      expect(result).toEqual([0.476, 0.065, 0.563, 0.111]);
    });
  });

  describe('explicit order parameter', () => {
    it('should swap when explicitly specified as ymin_xmin_ymax_xmax', () => {
      const input = [0.065, 0.476, 0.111, 0.563];
      const result = normalizeBackendBBox(input, { order: 'ymin_xmin_ymax_xmax' });
      expect(result).toEqual([0.476, 0.065, 0.563, 0.111]);
    });

    it('should NOT swap when explicitly specified as xmin_ymin_xmax_ymax', () => {
      const input = [0.476, 0.065, 0.563, 0.111];
      const result = normalizeBackendBBox(input, { order: 'xmin_ymin_xmax_ymax' });
      expect(result).toEqual([0.476, 0.065, 0.563, 0.111]);
    });
  });

  describe('golden record test cases', () => {
    // Test cases from actual golden-record.json
    const goldenRecordBboxes = [
      { id: 'SOV-301202', bbox: [0.123, 0.252, 0.151, 0.285] },
      { id: 'SOV-301203A', bbox: [0.476, 0.065, 0.563, 0.111] },
      { id: 'SOV-291201A', bbox: [0.476, 0.136, 0.563, 0.18] },
      { id: 'PT-302318', bbox: [0.58, 0.381, 0.662, 0.424] },
      { id: 'TT-302319', bbox: [0.581, 0.685, 0.666, 0.731] },
    ];

    goldenRecordBboxes.forEach(({ id, bbox }) => {
      it(`should preserve golden record bbox for ${id}`, () => {
        const result = normalizeBackendBBox(bbox);
        expect(result).toEqual(bbox);
      });
    });
  });

  describe('edge cases', () => {
    it('should return [0,0,0,0] for empty array', () => {
      const result = normalizeBackendBBox([]);
      expect(result).toEqual([0, 0, 0, 0]);
    });

    it('should return [0,0,0,0] for array with less than 4 elements', () => {
      const result = normalizeBackendBBox([0.1, 0.2]);
      expect(result).toEqual([0, 0, 0, 0]);
    });

    it('should handle NaN values', () => {
      const result = normalizeBackendBBox([NaN, 0.2, 0.3, 0.4]);
      // NaN gets converted to 0 after Math.max/min operations
      expect(result[0]).toBe(0);
    });
  });
});

describe('convertNormalizedToDisplay', () => {
  it('should convert normalized bbox to display coordinates with aspect ratio maintained', () => {
    const norm: NormBBox = [0.5, 0.5, 0.75, 0.75];
    const origSize = { width: 2048, height: 1084 };
    const displaySize = { width: 1024, height: 512 };
    
    const result = convertNormalizedToDisplay(norm, origSize, displaySize, true);
    
    // Should maintain aspect ratio
    expect(result.w).toBeGreaterThan(0);
    expect(result.h).toBeGreaterThan(0);
    expect(result.x).toBeGreaterThanOrEqual(0);
    expect(result.y).toBeGreaterThanOrEqual(0);
  });

  it('should handle wide image (width > height) correctly', () => {
    // Mock image dimensions from problem: 2048x1084
    const norm: NormBBox = [0.476, 0.065, 0.563, 0.111];
    const origSize = { width: 2048, height: 1084 };
    const displaySize = { width: 1024, height: 542 };
    
    const result = convertNormalizedToDisplay(norm, origSize, displaySize, true);
    
    // x should be based on xmin (0.476), not ymin (0.065)
    const expectedX = 0.476 * origSize.width * 0.5; // scale factor 0.5
    expect(Math.abs(result.x - expectedX)).toBeLessThan(1);
  });
});

describe('convertCoordinateFormat', () => {
  it('should convert from gemini format to canonical', () => {
    // Gemini format: [ymin, xmin, ymax, xmax]
    const gemini = [0.065, 0.476, 0.111, 0.563];
    const result = convertCoordinateFormat(gemini, 'gemini', 'canonical');
    
    // Canonical format: [xmin, ymin, xmax, ymax]
    expect(result).toEqual([0.476, 0.065, 0.563, 0.111]);
  });

  it('should convert from canonical to gemini format', () => {
    // Canonical format: [xmin, ymin, xmax, ymax]
    const canonical = [0.476, 0.065, 0.563, 0.111];
    const result = convertCoordinateFormat(canonical, 'canonical', 'gemini');
    
    // Gemini format: [ymin, xmin, ymax, xmax]
    expect(result).toEqual([0.065, 0.476, 0.111, 0.563]);
  });

  it('should convert canonical to absolute pixels', () => {
    const canonical = [0.5, 0.5, 0.75, 0.75];
    const imageSize = { width: 2048, height: 1084 };
    const result = convertCoordinateFormat(canonical, 'canonical', 'absolute', imageSize);
    
    expect(result).toEqual([1024, 542, 1536, 813]);
  });
});
