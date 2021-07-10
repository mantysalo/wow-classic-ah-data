import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import got from "got";

export const fetch = TE.tryCatchK((url: string) => {
  console.log("fetching", url);
  return got(url, { retry: { limit: 10 } }).json();
}, E.toError);
