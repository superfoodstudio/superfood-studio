import { builder } from '../builder';

builder.prismaObject('Subscription', {
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.relation('user'),
    status: t.expose('status', { type: SubscriptionStatus }),
    plan: t.expose('plan', { type: Plan }),
    startDate: t.expose('startDate', { type: 'Date' }),
    endDate: t.expose('endDate', { type: 'Date', nullable: true }),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
});

const SubscriptionStatus = builder.enumType('SubscriptionStatus', {
  values: ['ACTIVE', 'CANCELED', 'EXPIRED'] as const,
});

const Plan = builder.enumType('Plan', {
  values: ['MONTHLY', 'YEARLY'] as const,
}); 