import { describe, it, expect } from 'vitest';
import {
  getSubscriptionPeriod,
  getSubscriptionStatus,
  getInvoicePeriod,
} from '@/lib/stripe-helpers';

describe('getSubscriptionPeriod', () => {
  it('returns null when period fields are undefined (the bug)', () => {
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
});

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
    expect(getInvoicePeriod({})).toBeNull();
  });

  it('returns null when period fields are missing', () => {
    const invoice = {
      lines: { data: [{ period: { start: undefined, end: undefined } }] },
    };
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
});

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
  });
});
