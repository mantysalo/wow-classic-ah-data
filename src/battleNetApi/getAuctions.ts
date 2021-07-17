import { flow } from "fp-ts/lib/function";
import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import { getToken } from "./getToken";
import { fetchAndValidate } from "../util/fetchAndValidate";

export type AuctionObject = ReturnType<typeof createAuctionObjects>[number];

const TimeLeft = t.keyof({
  SHORT: null,
  MEDIUM: null,
  LONG: null,
  VERY_LONG: null,
});

const Item = t.intersection([t.type({ id: t.number }), t.partial({ rand: t.number, seed: t.number })]);

const AuctionFromApi = t.type({
  id: t.number,
  item: Item,
  bid: t.number,
  buyout: t.number,
  quantity: t.number,
  time_left: TimeLeft,
});

const ApiResponse = t.type({ auctions: t.array(AuctionFromApi) });

const buildUrl = (token: string) => {
  return `https://eu.api.blizzard.com/data/wow/connected-realm/4467/auctions/6?namespace=dynamic-classic-eu&locale=en_US&access_token=${token}`;
};

const createAuctionObjects = (response: t.TypeOf<typeof ApiResponse>) =>
  response.auctions.map((auction) => {
    const { item, id, time_left, ...auctionWithoutItem } = auction;
    return { ...auctionWithoutItem, auction_id: id, item_id: item.id, item_rand: item.rand, item_seed: item.seed };
  });

export const getAuctions = flow(buildUrl, fetchAndValidate(ApiResponse), TE.map(createAuctionObjects));
