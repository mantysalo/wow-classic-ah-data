import pgp from "pg-promise";
import { env } from "./config/env";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as t from "io-ts";
import { decodeWith } from "./util";
import { pipe } from "fp-ts/lib/function";

export const pg = pgp({ capSQL: true });

export const _database = pg(env.DATABASE_URL);

export const db = {
  none: (query: pgp.QueryParam, values?: any) =>
    pipe(
      TE.tryCatch(() => _database.none(query, values), E.toError),
      TE.chain(decodeWith(t.null))
    ),
  one: <T>(query: pgp.QueryParam, decoder: t.Decoder<unknown, T>, values?: any) =>
    pipe(
      TE.tryCatch(() => _database.one(query, values), E.toError),
      TE.chain(decodeWith(decoder))
    ),
  oneOrNone: <T>(query: pgp.QueryParam, decoder: t.Decoder<unknown, T | null>, values?: any) =>
    pipe(
      TE.tryCatch(() => _database.oneOrNone(query, values), E.toError),
      TE.chain(decodeWith(decoder))
    ),
  many: <T>(query: pgp.QueryParam, decoder: t.Decoder<unknown, T[]>, values?: any) =>
    pipe(
      TE.tryCatch(() => _database.many(query, values), E.toError),
      TE.chain(decodeWith(decoder))
    ),
  manyOrNone: <T>(query: pgp.QueryParam, decoder: t.Decoder<unknown, T[]>, values?: any) =>
    pipe(
      TE.tryCatch(() => _database.manyOrNone(query, values), E.toError),
      TE.chain(decodeWith(decoder))
    ),
};

export type Database = typeof _database;
