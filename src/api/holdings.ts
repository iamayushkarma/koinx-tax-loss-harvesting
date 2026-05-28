import { HOLDINGS_DATA, type Holding } from "../data/Holdings.data";

export interface GainEntry {
  balance: number;
  gain: number;
}
const fetchHoldings = (): Promise<Holding[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(HOLDINGS_DATA);
    }, 800);
  });
};

export { fetchHoldings };
