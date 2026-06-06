import { loginSchema, registerSchema } from './auth.validators';

describe('auth validators', () => {
  it('accepts a valid registration payload', () => {
    const result = registerSchema.safeParse({
      body: {
        email: 'jane@example.com',
        password: 'secret12',
        firstName: 'Jane',
        lastName: 'Doe',
      },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.body.role).toBe('STUDENT'); // default applied
  });

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      body: { email: 'jane@example.com', password: 'short', firstName: 'J', lastName: 'D' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid login email', () => {
    const result = loginSchema.safeParse({ body: { email: 'not-an-email', password: 'x' } });
    expect(result.success).toBe(false);
  });
});
