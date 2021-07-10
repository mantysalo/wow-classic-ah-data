import path from "path";
import { URL } from "url";
import * as TE from "fp-ts/TaskEither";
import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import { getToken } from "./getToken";
import { fetchAndValidate } from "../util/fetchAndValidate";

const MediaApiResponse = t.type({
  assets: t.array(
    t.type({
      key: t.string,
      value: t.string,
    })
  ),
});

const buildMediaUrl = (itemid: number) => (token: string) => {
  return `https://eu.api.blizzard.com/data/wow/media/item/${itemid}?namespace=static-classic-eu&locale=en_US&access_token=${token}`;
};

const buildClassicMediaUrl = (itemid: number) => (token: string) => {
  return `https://eu.api.blizzard.com/data/wow/media/item/${itemid}?namespace=static-classic1x-eu&locale=en_US&access_token=${token}`;
};

const parseIconNameFromUrl = (url: string | undefined) =>
  url ? path.parse(new URL(url).pathname).name : "inv_misc_questionmark";

export const getIcon = (itemId: number) => {
  return pipe(
    getToken,
    TE.map(buildMediaUrl(itemId)),
    TE.chain(fetchAndValidate(MediaApiResponse)),
    TE.orElse(() => pipe(getToken, TE.map(buildClassicMediaUrl(itemId)), TE.chain(fetchAndValidate(MediaApiResponse)))),
    TE.map((res) => res.assets.find((asset) => asset.key === "icon")?.value),
    TE.map(parseIconNameFromUrl)
  );
};
