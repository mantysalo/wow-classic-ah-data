const formatCopperToGoldSilverCopper = (num: number) => {
  const gold = Math.floor(num / 10000);
  const silver = Math.floor((num % 10000) / 100);
  const copper = Math.round((num % 10000) % 100);

  return [gold, silver, copper];
};
