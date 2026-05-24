/**
 * Extract period dates from a Stripe subscription object.
 * Stripe removed current_period_start/end from the top-level subscription object;
 * they now live on subscription items (items.data[0]).
 */
export function getSubscriptionPeriod(sub: any): { start: number; end: number } | null {
  // Try top-level first (legacy)
  if (sub.current_period_start && sub.current_period_end) {
    return { start: sub.current_period_start, end: sub.current_period_end };
  }
  // Current location: on subscription items
  const item = sub.items?.data?.[0];
  if (item?.current_period_start && item?.current_period_end) {
    return { start: item.current_period_start, end: item.current_period_end };
  }
  return null;
}

export function getInvoicePeriod(invoice: any): { start: Date; end: Date } | null {
  const line = invoice.lines?.data?.[0];
  if (!line?.period?.start || !line?.period?.end) return null;
  return {
    start: new Date(line.period.start * 1000),
    end: new Date(line.period.end * 1000),
  };
}

export function getSubscriptionStatus(stripeStatus: string): 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED' {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return 'ACTIVE';
    case 'past_due':
    case 'incomplete':
      return 'PAST_DUE';
    case 'canceled':
      return 'CANCELED';
    default:
      return 'EXPIRED';
  }
}
