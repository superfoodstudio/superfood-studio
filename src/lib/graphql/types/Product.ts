import { builder } from '../builder';

builder.prismaObject('Product', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    photoUrl: t.exposeString('photoUrl'),
    videoUrl: t.exposeString('videoUrl', { nullable: true }),
    price: t.exposeFloat('price'),
    category: t.exposeString('category'),
    tags: t.exposeStringList('tags'),
    inventory: t.exposeInt('inventory'),
    isActive: t.exposeBoolean('isActive'),
    orderItems: t.relation('orderItems'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
}); 