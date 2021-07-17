import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { getAuctions } from "./battleNetApi/getAuctions";
import { calculateMarketValuesForAuctions } from "./marketvalue/calculateMarketValue";
import { insertAuctions } from "./auction/queries";
import { insertMarketValues } from "./marketvalue/queries";
import { addMissingItemsToDb } from "./item/addMissingItemsToDb";
import { CronJob } from "cron";
import pino from "pino";
import { getToken } from "./battleNetApi/getToken";

const log = pino({ prettyPrint: true });

const main = pipe(
  getToken,
  TE.bindTo("token"),
  TE.bind("auctionObjects", ({ token }) => getAuctions(token)),
  TE.chainFirst(({ auctionObjects, token }) => addMissingItemsToDb(auctionObjects, token)),
  TE.bind("insertedAuctions", ({ auctionObjects }) => insertAuctions(auctionObjects)),
  TE.chainFirst(({ insertedAuctions }) => TE.fromIO(() => log.info(`Added ${insertedAuctions.length} auctions.`))),
  TE.chain(({ auctionObjects, insertedAuctions }) => {
    if (insertedAuctions.length > 0) return pipe(auctionObjects, calculateMarketValuesForAuctions, insertMarketValues);
    return TE.of(null);
  }),
  TE.chainFirst((marketValues) =>
    TE.fromIO(() => log.info(`Updated market value for ${marketValues?.length || 0} items.`))
  ),
  TE.mapLeft((err) => log.error(err))
);

new CronJob("*/30 * * * *", function () {
  main();
}).start();
