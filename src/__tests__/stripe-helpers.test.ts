import { describe, it, expect } from 'vitest';
import {
  getSubscriptionPeriod,
  getSubscriptionStatus,
  getInvoicePeriod,
  getShippingCents,
  hasLivestreamAccess,
} from '@/lib/stripe-helpers';

// =============================================================
// getSubscriptionPeriod
// =============================================================
describe('getSubscriptionPeriod', () => {
  it('returns null when period fields are undefined (the Stripe API migration bug)', () => {
    const sub = {
      id: 'sub_123',
      current_period_start: undefined,
      current_period_end: undefined,
      items: { data: [] },
    };
    expect(getSubscriptionPeriod(sub)).toBeNull();
  });

  it('returns null when subscription has no items', () => {
    expect(getSubscriptionPeriod({ id: 'sub_123' })).toBeNull();
  });

  it('returns null for empty object', () => {
    expect(getSubscriptionPeriod({})).toBeNull();
  });

  it('extracts period from items.data[0] (current Stripe API)', () => {
    const sub = {
      id: 'sub_123',
      items: {
        data: [{
          current_period_start: 1775940477,
          current_period_end: 1778532477,
        }],
      },
    };
    const period = getSubscriptionPeriod(sub);
    expect(period).toEqual({ start: 1775940477, end: 1778532477 });
  });

  it('extracts period from top-level fields (legacy Stripe API)', () => {
    const sub = {
      current_period_start: 1775940477,
      current_period_end: 1778532477,
    };
    const period = getSubscriptionPeriod(sub);
    expect(period).toEqual({ start: 1775940477, end: 1778532477 });
  });

  it('prefers top-level over items when both exist', () => {
    const sub = {
      current_period_start: 100,
      current_period_end: 200,
      items: { data: [{ current_period_start: 300, current_period_end: 400 }] },
    };
    expect(getSubscriptionPeriod(sub)).toEqual({ start: 100, end: 200 });
  });

  it('does not produce Invalid Date from undefined timestamps', () => {
    const sub = {
      current_period_start: undefined,
      current_period_end: undefined,
      items: { data: [{ current_period_start: undefined, current_period_end: undefined }] },
    };
    expect(getSubscriptionPeriod(sub)).toBeNull();
  });

  it('handles partial top-level fields (only start)', () => {
    const sub = { current_period_start: 100 };
    expect(getSubscriptionPeriod(sub)).toBeNull();
  });

  it('handles partial item fields (only end)', () => {
    const sub = { items: { data: [{ current_period_end: 200 }] } };
    expect(getSubscriptionPeriod(sub)).toBeNull();
  });

  it('handles zero timestamps as falsy', () => {
    const sub = { current_period_start: 0, current_period_end: 0 };
    expect(getSubscriptionPeriod(sub)).toBeNull();
  });
});

// =============================================================
// getInvoicePeriod
// =============================================================
describe('getInvoicePeriod', () => {
  it('extracts period from invoice line items', () => {
    const invoice = {
      lines: { data: [{ period: { start: 1775940477, end: 1778532477 } }] },
    };
    const period = getInvoicePeriod(invoice);
    expect(period).not.toBeNull();
    expect(period!.start).toEqual(new Date(1775940477 * 1000));
    expect(period!.end).toEqual(new Date(1778532477 * 1000));
  });

  it('returns null when no line items', () => {
    expect(getInvoicePeriod({ lines: { data: [] } })).toBeNull();
  });

  it('returns null when lines is undefined', () => {
    expect(getInvoicePeriod({})).toBeNull();
  });

  it('returns null when period fields are missing', () => {
    const invoice = {
      lines: { data: [{ period: { start: undefined, end: undefined } }] },
    };
    expect(getInvoicePeriod(invoice)).toBeNull();
  });

  it('returns null when period object is missing', () => {
    const invoice = { lines: { data: [{}] } };
    expect(getInvoicePeriod(invoice)).toBeNull();
  });

  it('returns valid dates (not Invalid Date)', () => {
    const invoice = {
      lines: { data: [{ period: { start: 1775940477, end: 1778532477 } }] },
    };
    const period = getInvoicePeriod(invoice)!;
    expect(period.start.getTime()).not.toBeNaN();
    expect(period.end.getTime()).not.toBeNaN();
  });

  it('converts Unix timestamps to correct Date objects', () => {
    const invoice = {
      lines: { data: [{ period: { start: 0, end: 86400 } }] },
    };
    // start: 0 is falsy, should return null
    expect(getInvoicePeriod(invoice)).toBeNull();
  });
});

// =============================================================
// getSubscriptionStatus
// =============================================================
describe('getSubscriptionStatus', () => {
  it('maps active to ACTIVE', () => {
    expect(getSubscriptionStatus('active')).toBe('ACTIVE');
  });

  it('maps trialing to ACTIVE', () => {
    expect(getSubscriptionStatus('trialing')).toBe('ACTIVE');
  });

  it('maps past_due to PAST_DUE', () => {
    expect(getSubscriptionStatus('past_due')).toBe('PAST_DUE');
  });

  it('maps incomplete to PAST_DUE', () => {
    expect(getSubscriptionStatus('incomplete')).toBe('PAST_DUE');
  });

  it('maps canceled to CANCELED', () => {
    expect(getSubscriptionStatus('canceled')).toBe('CANCELED');
  });

  it('maps unknown status to EXPIRED', () => {
    expect(getSubscriptionStatus('unpaid')).toBe('EXPIRED');
    expect(getSubscriptionStatus('incomplete_expired')).toBe('EXPIRED');
    expect(getSubscriptionStatus('whatever')).toBe('EXPIRED');
    expect(getSubscriptionStatus('')).toBe('EXPIRED');
  });
});

// =============================================================
// getShippingCents
// =============================================================
describe('getShippingCents', () => {
  it('returns 500 ($5) for 1 item', () => {
    expect(getShippingCents(1)).toBe(500);
  });

  it('returns 500 ($5) for 5 items (boundary)', () => {
    expect(getShippingCents(5)).toBe(500);
  });

  it('returns 1000 ($10) for 6 items (boundary)', () => {
    expect(getShippingCents(6)).toBe(1000);
  });

  it('returns 1000 ($10) for 100 items', () => {
    expect(getShippingCents(100)).toBe(1000);
  });

  it('returns 500 ($5) for 0 items', () => {
    expect(getShippingCents(0)).toBe(500);
  });
});

// =============================================================
// hasLivestreamAccess
// =============================================================
describe('hasLivestreamAccess', () => {
  it('grants access to ADMIN regardless of subscription', () => {
    expect(hasLivestreamAccess('ADMIN', null)).toBe(true);
    expect(hasLivestreamAccess('ADMIN', 'CANCELED')).toBe(true);
    expect(hasLivestreamAccess('ADMIN', 'EXPIRED')).toBe(true);
  });

  it('grants access to SUBSCRIBER with ACTIVE subscription', () => {
    expect(hasLivestreamAccess('SUBSCRIBER', 'ACTIVE')).toBe(true);
  });

  it('denies access to SUBSCRIBER without ACTIVE subscription', () => {
    expect(hasLivestreamAccess('SUBSCRIBER', 'CANCELED')).toBe(false);
    expect(hasLivestreamAccess('SUBSCRIBER', 'EXPIRED')).toBe(false);
    expect(hasLivestreamAccess('SUBSCRIBER', 'PENDING')).toBe(false);
    expect(hasLivestreamAccess('SUBSCRIBER', 'PAST_DUE')).toBe(false);
    expect(hasLivestreamAccess('SUBSCRIBER', null)).toBe(false);
  });

  it('denies access with no role', () => {
    expect(hasLivestreamAccess(null, null)).toBe(false);
    expect(hasLivestreamAccess(null, 'ACTIVE')).toBe(true); // ACTIVE sub always grants
  });

  it('denies access to PUBLIC users', () => {
    expect(hasLivestreamAccess('PUBLIC', null)).toBe(false);
    expect(hasLivestreamAccess('PUBLIC', 'CANCELED')).toBe(false);
  });
});
