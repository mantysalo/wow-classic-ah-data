import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import got, { OptionsOfTextResponseBody } from "got";

export const fetch = TE.tryCatchK((url: string, options?: OptionsOfTextResponseBody) => {
  console.log("fetching", url);
  return got(url, { retry: { limit: 10 }, ...options }).json();
}, E.toError);
