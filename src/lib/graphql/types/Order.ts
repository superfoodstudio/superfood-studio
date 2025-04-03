import { builder } from '../builder';

builder.prismaObject('Order', {
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.relation('user'),
    items: t.relation('items'),
    status: t.expose('status', { type: OrderStatus }),
    total: t.exposeFloat('total'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
});

builder.prismaObject('OrderItem', {
  fields: (t) => ({
    id: t.exposeID('id'),
    order: t.relation('order'),
    product: t.relation('product'),
    quantity: t.exposeInt('quantity'),
    price: t.exposeFloat('price'),
  }),
});

const OrderStatus = builder.enumType('OrderStatus', {
  values: ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELED'] as const,
}); 