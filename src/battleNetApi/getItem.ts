import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { getToken } from "./getToken";
import * as TE from "fp-ts/TaskEither";
import { fetchAndValidate } from "../util/fetchAndValidate";
import { getIcon } from "./getIcon";

const ItemApiResponse = t.type({
  id: t.number,
  name: t.string,
  quality: t.type({ type: t.string, name: t.string }),
  level: t.number,
  required_level: t.number,
  item_class: t.type({ key: t.type({ href: t.string }), name: t.string, id: t.number }),
  item_subclass: t.type({ key: t.type({ href: t.string }), name: t.string, id: t.number }),
  inventory_type: t.type({ type: t.string, name: t.string }),
  sell_price: t.number,
});

const buildItemUrl = (itemid: number) => (token: string) => {
  return `https://eu.api.blizzard.com/data/wow/item/${itemid}?namespace=static-classic-eu&locale=en_US&access_token=${token}`;
};

const buildClassicUrl = (itemid: number) => (token: string) => {
  return `https://eu.api.blizzard.com/data/wow/item/${itemid}?namespace=static-classic1x-eu&locale=en_US&access_token=${token}`;
};

export const getItem = (itemId: number) =>
  pipe(
    getToken,
    TE.map(buildItemUrl(itemId)),
    TE.chain(fetchAndValidate(ItemApiResponse)),
    TE.orElse(() => pipe(getToken, TE.map(buildClassicUrl(itemId)), TE.chain(fetchAndValidate(ItemApiResponse)))),
    TE.bindTo("apiResponse"),
    TE.bind("icon", () => getIcon(itemId)),
    TE.map(({ apiResponse, icon }) => {
      return {
        id: apiResponse.id,
        name: apiResponse.name,
        icon,
        class: apiResponse.item_class.name,
        subclass: apiResponse.item_subclass.name,
        vendor_sell_price: apiResponse.sell_price,
        quality: apiResponse.quality.name,
        item_level: apiResponse.level,
        required_level: apiResponse.required_level,
        slot: apiResponse.inventory_type.name,
      };
    })
  );
