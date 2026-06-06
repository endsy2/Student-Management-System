import { describe, expect, it } from 'vitest';
import { apiErrorMessage } from './api';

describe('apiErrorMessage', () => {
  it('falls back to a generic message for unknown errors', () => {
    expect(apiErrorMessage('boom')).toBe('Unexpected error');
  });

  it('reads message from a plain Error', () => {
    expect(apiErrorMessage(new Error('nope'))).toBeDefined();
  });
});
