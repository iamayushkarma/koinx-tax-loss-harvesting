import { HOLDINGS_DATA } from "../data/Holdings.data";

export interface GainEntry {
  balance: number;
  gain: number;
}
export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainEntry;
  ltcg: GainEntry;
}
const fetchHoldings = (): Promise<Holding[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(HOLDINGS_DATA);
    }, 800);
  });
};

export { fetchHoldings };
