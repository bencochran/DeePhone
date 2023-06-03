import { PrismaClient } from '@prisma/client';
import { prismaConnectionHelpers } from '@pothos/plugin-prisma';
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';

import { buildBuilder } from '../builder';

const phoneUtil = PhoneNumberUtil.getInstance()

function formatPhoneNumber(phoneNumber: string, countryCode?: string) {
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
  return phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
}

function maskPhoneNumber(phoneNumber: string) {
  const match = phoneNumber.match(/^(.*)(\d{4})$/);
  if (!match) {
    // Couldn’t find last 4, just obscure the whole thing
    return phoneNumber.replaceAll(/\d/g, 'X');
  }
  const [_, first, second] = match;
  return first + second.replaceAll(/\d/g, 'X');
}

export function addCallToBuilder(builder: ReturnType<typeof buildBuilder>, prisma: PrismaClient) {
  const Call = builder.prismaNode('Call', {
    id: { field: 'id' },
    fields: (t) => ({
      identifier: t.exposeInt('id'),
      phoneNumber: t.string({
        resolve: (call) => maskPhoneNumber(formatPhoneNumber(call.phoneNumber, call.callerCountry ?? undefined)),
      }),
      startDate: t.expose('startDate', {
        type: 'DateTime',
      }),
      endDate: t.expose('endDate', {
        type: 'DateTime',
        nullable: true,
      }),
      callerCountry: t.exposeString('callerCountry', { nullable: true }),
      duration: t.exposeInt('callDuration', { nullable: true }),
      events: t.relatedConnection('events', {
        cursor: 'date_id',
        args: {
          oldestFirst: t.arg.boolean(),
        },
        query: (args) => ({
          orderBy: { date: args.oldestFirst ? 'asc' : 'desc' },
        }),
      }),
      episode: t.prismaField({
        type: 'Episode',
        nullable: true,
        select: {
          events: {
            where: { type: 'INTRODUCING_EPISODE' },
            orderBy: { date: 'desc' },
            take: 1,
            select: {
              download: {
                select: {
                  episode: true,
                }
              }
            }
          }
        },
        resolve: (_select, call) => call.events.at(0)?.download.episode,
      }),

      // TODO: Re-expose these once we have authz
      callerName: t.string({
        nullable: true,
        resolve: () => null,
      }),
      callerCity: t.string({
        nullable: true,
        resolve: () => null,
      }),
      callerState: t.string({
        nullable: true,
        resolve: () => null,
      }),
      callerZip: t.string({
        nullable: true,
        resolve: () => null,
      }),
    })
  });

  const downloadCallConnectionHelpers = prismaConnectionHelpers(
    builder,
    'CallEvent',
    {
      cursor: 'date_id',
      select: (nodeSelection) => ({
        call: nodeSelection({
        }),
      }),
      resolveNode: (callEvent) => callEvent.call,
    },
  );

  builder.prismaObjectField('EpisodeDownload', 'calls', (t) =>
    t.connection({
      type: Call,
      select: (args, ctx, nestedSelection) => ({
        callEvents: {
          ...downloadCallConnectionHelpers.getQuery(args, ctx, nestedSelection),
          where: { type: 'INTRODUCING_EPISODE' },
          orderBy: { date: 'desc' },
        }
      }),
      resolve: (download, args, ctx) => downloadCallConnectionHelpers.resolve(
        download.callEvents,
        args,
        ctx
      ),
    })
  )

  builder.queryFields((t) => ({
    call: t.prismaField({
      type: 'Call',
      nullable: true,
      args: {
        identifier: t.arg.int({ required: true }),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.call.findUnique({
          ...query,
          where: { id: args.identifier },
        })
    }),
    calls: t.prismaConnection({
      type: 'Call',
      cursor: 'startDate_id',
      args: {
        onlyInProgress: t.arg.boolean(),
        onlyComplete: t.arg.boolean(),
        episodeIdentifier: t.arg.int(),
      },
      resolve: (query, _parent, args, _ctx, _info) =>
        prisma.call.findMany({
          ...query,
          where: { AND: [
            args.episodeIdentifier ? { events: { some: { download: { episode: { id: args.episodeIdentifier } } } } } : { },
            args.onlyInProgress ? { endDate: null } : { },
            args.onlyComplete ? { NOT: { endDate: null } } : { },
          ] },
          orderBy: { startDate: 'desc' }
        })
    }),
  }));
}
