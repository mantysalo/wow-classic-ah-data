import { db, pg } from "../db";
import * as t from "io-ts";

const MarketValueEntity = t.type({ item_id: t.number, market_value: t.number });

export const insertMarketValues = (
  values: {
    item_id: string;
    market_value: number;
  }[]
) => {
  const columnSet = new pg.helpers.ColumnSet(["item_id", "market_value"], { table: "item_market_value" });
  const query = () => pg.helpers.insert(values, columnSet) + " RETURNING *;";
  return db.many(query, t.array(MarketValueEntity));
};
