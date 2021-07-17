import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { db } from "../db";
import { insertItemWithId } from "./queries";
import * as t from "io-ts";

export const addMissingItemsToDb = (
  auctionObjects: {
    auction_id: number;
    item_id: number;
    item_rand: number | undefined;
    item_seed: number | undefined;
    bid: number;
    buyout: number;
    quantity: number;
  }[],
  token: string
): TE.TaskEither<Error, readonly null[]> => {
  const getCurrentItemIds = db.many("SELECT id FROM item", t.array(t.type({ id: t.number })));

  return pipe(
    getCurrentItemIds,
    TE.map((items) => {
      return new Set(items.map((row) => row.id));
    }),
    TE.map((itemIds) => {
      return new Set(
        auctionObjects
          .filter((auctionObject) => !itemIds.has(auctionObject.item_id))
          .map((auctionObject) => auctionObject.item_id)
      );
    }),
    TE.chain((itemIds) => {
      return TE.sequenceSeqArray(Array.from(itemIds).map((id) => insertItemWithId(id, token)));
    })
  );
};
