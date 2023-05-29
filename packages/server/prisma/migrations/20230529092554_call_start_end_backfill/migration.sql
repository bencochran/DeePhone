UPDATE "Call"
SET "startDate" = "CallEvent"."date"
FROM "CallEvent"
WHERE "Call"."id" = "CallEvent"."callId"
AND ("Call"."startDate" = 'epoch'::TIMESTAMP OR "Call"."startDate" IS NULL)
AND "CallEvent"."state" = 'FETCHING_EPISODE';

UPDATE "Call"
SET "endDate" = "CallEvent"."date"
FROM "CallEvent"
WHERE "Call"."id" = "CallEvent"."callId"
AND ("Call"."endDate" = 'epoch'::TIMESTAMP OR "Call"."endDate" IS NULL)
AND "CallEvent"."state" = 'ENDED';

UPDATE "Call"
SET "endDate" = 'epoch'::TIMESTAMP
WHERE "endDate" IS NULL;
