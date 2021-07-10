import { AuctionObject } from "../battleNetApi/getAuctions";
import { db, pg } from "../db";
import * as t from "io-ts";

const AuctionEntity = t.type({
  item_id: t.number,
  item_rand: t.union([t.number, t.null]),
  item_seed: t.union([t.number, t.null]),
  bid: t.number,
  buyout: t.number,
  quantity: t.number,
  auction_id: t.number,
});

export const insertAuctions = (values: AuctionObject[]) => {
  const columnSet = new pg.helpers.ColumnSet(
    ["item_id", "item_rand", "item_seed", "bid", "buyout", "quantity", "auction_id"],
    { table: "auction" }
  );
  const query = () => pg.helpers.insert(values, columnSet) + " ON CONFLICT (auction_id) DO NOTHING RETURNING *;";
  return db.manyOrNone(query, t.array(AuctionEntity));
};
