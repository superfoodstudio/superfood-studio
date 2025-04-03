import { builder } from '../builder';
import type { ObjectRef } from '@pothos/core';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Step {
  order: number;
  description: string;
}

builder.prismaObject('Recipe', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),
    ingredients: t.field({
      type: ['Ingredient'],
      resolve: (recipe) => recipe.ingredients as Ingredient[],
    }),
    steps: t.field({
      type: ['Step'],
      resolve: (recipe) => recipe.steps as Step[],
    }),
    videoUrl: t.exposeString('videoUrl', { nullable: true }),
    imageUrl: t.exposeString('imageUrl', { nullable: true }),
    expirationDate: t.expose('expirationDate', { type: 'Date', nullable: true }),
    uploadDate: t.expose('uploadDate', { type: 'Date' }),
    isPublished: t.exposeBoolean('isPublished'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
});

builder.objectType('Ingredient', {
  fields: (t) => ({
    name: t.exposeString('name'),
    quantity: t.exposeString('quantity'),
    unit: t.exposeString('unit'),
  }),
});

builder.objectType('Step', {
  fields: (t) => ({
    order: t.exposeInt('order'),
    description: t.exposeString('description'),
  }),
}); 