import { pipe } from "fp-ts/lib/function";
import { db } from "../db";
import { getItem } from "../battleNetApi/getItem";
import * as TE from "fp-ts/TaskEither";

export const insertItemWithId = (itemId: number) => {
  const insertItem = (item: {
    id: number;
    name: string;
    icon: string;
    class: string;
    subclass: string;
    vendor_sell_price: number;
    quality: string;
    item_level: number;
    required_level: number;
    slot: string;
  }) =>
    db.none("INSERT INTO item VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [
      item.id,
      item.name,
      item.icon,
      item.class,
      item.subclass,
      item.vendor_sell_price,
      item.quality,
      item.item_level,
      item.required_level,
      item.slot,
    ]);
  return pipe(itemId, getItem, TE.chain(insertItem));
};
