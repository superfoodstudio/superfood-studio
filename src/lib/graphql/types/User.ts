import { builder } from '../builder';
import type { InputFieldBuilder, OutputFieldBuilder } from '@pothos/core';

builder.prismaObject('User', {
  fields: (t: OutputFieldBuilder<'User'>) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    firstName: t.exposeString('firstName', { nullable: true }),
    lastName: t.exposeString('lastName', { nullable: true }),
    role: t.expose('role', { type: Role }),
    billingAddress: t.expose('billingAddress', { type: Address, nullable: true }),
    shippingAddress: t.expose('shippingAddress', { type: Address, nullable: true }),
    subscription: t.relation('subscription'),
    orders: t.relation('orders'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
});

const Role = builder.enumType('Role', {
  values: ['ADMIN', 'SUBSCRIBER', 'PUBLIC'] as const,
});

interface AddressType {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const Address = builder.objectRef<AddressType>('Address').implement({
  fields: (t: OutputFieldBuilder<'Address'>) => ({
    street: t.exposeString('street'),
    city: t.exposeString('city'),
    state: t.exposeString('state'),
    zipCode: t.exposeString('zipCode'),
    country: t.exposeString('country'),
  }),
}); 