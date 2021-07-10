import { flow } from "fp-ts/function";
import _ from "lodash";
import { AuctionObject } from "../battleNetApi/getAuctions";

function calculateMean(data: number[]) {
  return data.reduce((a, b) => a + b) / data.length;
}

const firstStep = (data: number[]) => {
  const sortedData = data.sort((a, b) => a - b);
  return sortedData.reduce<number[]>((prev, current, currentIndex, originalArray) => {
    const over15PercentProcessed = currentIndex > Math.floor((originalArray.length - 1) * 0.15);
    const priceIncreaseOver20Percent = current > originalArray[currentIndex - 1] * 1.2;
    const over30PercentProcessed = currentIndex > Math.floor((originalArray.length - 1) * 0.3);

    if (over15PercentProcessed && priceIncreaseOver20Percent) {
      return prev;
    }
    if (over30PercentProcessed) {
      return prev;
    }
    return [...prev, current];
  }, []);
};

const secondStep = (data: number[]) => {
  const mean = calculateMean(data);
  const stdDev = Math.sqrt(data.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / data.length);
  const lowerBound = mean - stdDev * 1.5;
  const upperBound = mean + stdDev * 1.5;
  const numberBetweenLowerAndUpperBound = (number: number) => number >= lowerBound && number <= upperBound;
  return data.filter(numberBetweenLowerAndUpperBound);
};

export const calculateMarketValue = flow(firstStep, secondStep, calculateMean);

export function calculateMarketValuesForAuctions(auctionObjects: AuctionObject[]) {
  const groupedAuctions = _.groupBy(auctionObjects, (auction) => auction.item_id);
  const marketValues = Object.entries(groupedAuctions).reduce<{ item_id: string; market_value: number }[]>(
    (prev, [id, auctions]) => {
      const filteredAuctions = auctions
        .filter((auction) => auction.buyout !== 0)
        .map((auction) => auction.buyout / auction.quantity);
      if (filteredAuctions.length === 0) return prev;
      return [
        ...prev,
        {
          item_id: id,
          market_value: calculateMarketValue(filteredAuctions),
        },
      ];
    },
    []
  );
  return marketValues;
}
