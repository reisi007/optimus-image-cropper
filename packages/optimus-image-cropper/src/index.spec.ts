import { describe, it, expect } from 'vitest';
import { OIC_VERSION } from './index';

describe('OIC_VERSION', () => {
  it('should export the version string', () => {
    expect(OIC_VERSION).toBe('0.0.1');
  });
});
