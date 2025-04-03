import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import RelayPlugin from '@pothos/plugin-relay';
import { prisma } from '../prisma';
import type { PrismaTypes } from '@pothos/plugin-prisma/generated';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Scalars: {
    Date: { Input: Date; Output: Date };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  prisma: {
    client: prisma,
    dmmf: prisma._dmmf,
    // Enable all Prisma field capabilities
    filterConnectionTotalCount: true,
    extensions: {
      addConnectionFilterOperators: true,
    },
  },
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: 'omit',
    cursorType: 'String',
  },
});

// Add Date scalar
builder.scalarType('Date', {
  serialize: (value) => (value instanceof Date ? value.toISOString() : value),
  parseValue: (value) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }
      return date;
    }
    throw new Error('Invalid date value');
  },
}); 