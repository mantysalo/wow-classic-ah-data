import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { flow } from "fp-ts/function";
import * as t from "io-ts";
import { failure } from "io-ts/PathReporter";

export const decodeWith = <T>(decoder: t.Decoder<unknown, T>) =>
  flow(
    decoder.decode,
    E.mapLeft((e) => new Error(failure(e).join(","))),
    TE.fromEither
  );
