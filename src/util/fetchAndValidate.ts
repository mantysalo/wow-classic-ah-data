import { pipe } from "fp-ts/lib/function";
import { decodeWith, fetch } from ".";
import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";

export const fetchAndValidate =
  <T>(decoder: t.Decoder<unknown, T>) =>
  (url: string) =>
    pipe(
      url,
      fetch,
      TE.chain((data) => {
        return decodeWith(decoder)(data);
      })
    );
