import { createContext, useContext, useEffect, useState } from "react";
import { fetchCapitalGains, type CapitalGainsData } from "../api/capitalGains";
import { fetchHoldings, type Holding } from "../api/holdings";

interface HarvestingContextType {
  capitalGains: CapitalGainsData | null;
  holdings: Holding[];
  selectedCoins: Set<string>;
  afterHarvesting: CapitalGainsData | null;
  toggleCoin: (coin: string) => void;
  toggleAll: (selectAll: boolean) => void;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const HarvestingContext = createContext<HarvestingContextType | null>(null);

export const HarvestingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [capitalGains, setCapitalGains] = useState<CapitalGainsData | null>(
    null,
  );
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [selectedCoins, setSelectedCoins] = useState<Set<string>>(new Set());
  const [afterHarvesting, setAfterHarvesting] =
    useState<CapitalGainsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetching both api when site mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const [gainsRes, holdingsRes] = await Promise.all([
          fetchCapitalGains(),
          fetchHoldings(),
        ]);

        setCapitalGains(gainsRes.capitalGains);
        setAfterHarvesting(gainsRes.capitalGains);
        setHoldings(holdingsRes);
      } catch (error) {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [retryCount]);

  // recalculate after harvesting whenever selection changes

  useEffect(() => {
    if (!capitalGains) return;

    let stcgProfits = capitalGains.stcg.profits;
    let stcgLosses = capitalGains.stcg.losses;
    let ltcgProfits = capitalGains.ltcg.profits;
    let ltcgLosses = capitalGains.ltcg.losses;

    holdings.forEach((holding) => {
      // useing coin+coinName as unique key to handle duplicate coin symbols if there are any.
      const key = `${holding.coin}-${holding.coinName}`;
      if (!selectedCoins.has(key)) return;

      if (holding.stcg.gain > 0) stcgProfits += holding.stcg.gain;
      else stcgLosses += Math.abs(holding.stcg.gain);

      if (holding.ltcg.gain > 0) ltcgProfits += holding.ltcg.gain;
      else ltcgLosses += Math.abs(holding.ltcg.gain);
    });

    setAfterHarvesting({
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    });
  }, [selectedCoins, holdings, capitalGains]);

  const toggleCoin = (key: string) => {
    setSelectedCoins((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleAll = (selectAll: boolean) => {
    if (selectAll) {
      const allKeys = holdings.map((h) => `${h.coin}-${h.coinName}`);
      setSelectedCoins(new Set(allKeys));
    } else {
      setSelectedCoins(new Set());
    }
  };

  return (
    <HarvestingContext.Provider
      value={{
        capitalGains,
        holdings,
        selectedCoins,
        afterHarvesting,
        toggleCoin,
        toggleAll,
        loading,
        error,
        retry: () => {
          setError(null);
          setLoading(true);
          setRetryCount((c) => c + 1);
        },
      }}
    >
      {children}
    </HarvestingContext.Provider>
  );
};

export const useHarvesting = () => {
  const ctx = useContext(HarvestingContext);
  if (!ctx)
    throw new Error("useHarvesting must be used inside HarvestingProvider");
  return ctx;
};
