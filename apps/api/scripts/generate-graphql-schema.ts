import path from 'path';
import fs from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import { PrismaClient } from '@prisma/client';

import { buildSchema } from '../src/graphql/schema';

const prisma = new PrismaClient();
const schema = buildSchema(prisma);

const schemaString = printSchema(lexicographicSortSchema(schema));

fs.writeFileSync(path.join(__dirname, '../schema.graphql'), schemaString);
