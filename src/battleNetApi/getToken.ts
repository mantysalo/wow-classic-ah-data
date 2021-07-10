import { pipe } from "fp-ts/lib/function";

import { env } from "../config/env";
import { decodeWith, fetch } from "../util";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import * as t from "io-ts";

const TokenResponse = t.type({
  access_token: t.string,
});

export const getToken = pipe(
  env.OAUTH_CREDENTIALS,
  (credentials: string) =>
    fetch("https://us.battle.net/oauth/token?grant_type=client_credentials", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    }),
  TE.chain(decodeWith(TokenResponse)),
  TE.map(({ access_token }) => access_token)
);
