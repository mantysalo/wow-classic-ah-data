import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { sequenceT } from "fp-ts/lib/Apply";
import { getAuctions } from "./battleNetApi/getAuctions";
import { calculateMarketValuesForAuctions } from "./marketvalue/calculateMarketValue";
import { insertAuctions } from "./auction/queries";
import { insertMarketValues } from "./marketvalue/queries";
import { _database } from "./db";
import { addMissingItemsToDb } from "./item/addMissingItemsToDb";
import { CronJob } from "cron";

const sequenceTEither = sequenceT(TE.ApplyPar);

const main = pipe(
  getAuctions,
  TE.chainFirst(addMissingItemsToDb),
  TE.chain((auctionObjects) =>
    sequenceTEither(
      pipe(auctionObjects, insertAuctions),
      pipe(auctionObjects, calculateMarketValuesForAuctions, insertMarketValues)
    )
  ),
  TE.match(console.error, ([auctions, marketValues]) => {
    console.log(`Inserted ${auctions.length} rows in to auctions table.`);
    console.log(`Inserted ${marketValues.length} rows in to market_value_aggregate table.`);
  })
);

new CronJob("*/30 * * * *", function () {
  main();
}).start();
