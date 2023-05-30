import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import { PrismaClient } from '@prisma/client';
import { DateTimeResolver, URLResolver } from 'graphql-scalars';
import RelayPlugin from '@pothos/plugin-relay';

export function buildBuilder(prisma: PrismaClient) {
  const builder = new SchemaBuilder<{
    Scalars: {
      DateTime: { Input: Date, Output: Date },
      URL: { Input: URL, Output: String },
    }
    PrismaTypes: PrismaTypes
  }>({
    plugins: [PrismaPlugin, RelayPlugin],
    prisma: { client: prisma },
    relayOptions: {},
  })

  builder.addScalarType('DateTime', DateTimeResolver, {});
  builder.addScalarType('URL', URLResolver, {});

  builder.queryType({
    fields: (t) => ({
      ok: t.boolean({
        resolve: () => true,
      }),
    }),
  });

  return builder;
}
