import { useState } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { useHarvesting } from "../context/HarvestingContext";
import type { Holding } from "../api/holdings";
import Tooltip from "./utility/Tooltip";

const DEFAULT_ROWS = 5;

// formats large numbers into K/M/B
const formatGain = (value: number): string => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "+";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
};

const formatPrice = (value: number): string => {
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  if (value < 0.01) return `$${value.toExponential(2)}`;
  return `$${value.toFixed(2)}`;
};

// formats holding balance
const formatBalance = (value: number, coin: string): string => {
  if (Math.abs(value) < 0.000001 && value !== 0)
    return `${value.toExponential(2)} ${coin}`;
  if (Math.abs(value) >= 1000)
    return `${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })} ${coin}`;
  return `${value.toFixed(6)} ${coin}`;
};

const GainCell = ({
  gain,
  balance,
  coin,
}: {
  gain: number;
  balance: number;
  coin: string;
}) => {
  const isPositive = gain >= 0;
  return (
    <Tooltip
      position="top"
      content={
        <div className="flex items-center gap-1 pr-2 text-xs whitespace-nowrap">
          <span className="text-gray-700">Full value:</span>

          <span className="font-bold text-gray-900">₹{gain.toFixed(8)}</span>
        </div>
      }
    >
      <div className="flex flex-col items-end cursor-default">
        <span
          className={`text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
        >
          {formatGain(gain)}
        </span>
        <span className="text-xs text-gray-500 mt-0.5">
          {formatBalance(balance, coin)}
        </span>
      </div>
    </Tooltip>
  );
};
const HoldingsTable = () => {
  const { holdings, selectedCoins, toggleCoin, toggleAll } = useHarvesting();
  const [showAll, setShowAll] = useState(false);
  const [sortKey, setSortKey] = useState<"stcg" | "ltcg" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const getKey = (h: Holding) => `${h.coin}-${h.coinName}`;
  const allKeys = holdings.map(getKey);
  const allSelected =
    allKeys.length > 0 && allKeys.every((k) => selectedCoins.has(k));
  const someSelected = allKeys.some((k) => selectedCoins.has(k));

  const sorted = [...holdings].sort((a, b) => {
    if (!sortKey) return b.stcg.gain - a.stcg.gain;
    const valA = sortKey === "stcg" ? a.stcg.gain : a.ltcg.gain;
    const valB = sortKey === "stcg" ? b.stcg.gain : b.ltcg.gain;
    return sortDir === "desc" ? valB - valA : valA - valB;
  });

  const displayed = showAll ? sorted : sorted.slice(0, DEFAULT_ROWS);

  const handleSort = (key: "stcg" | "ltcg") => {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: "stcg" | "ltcg" }) =>
    sortKey === col ? (
      sortDir === "desc" ? (
        <ChevronDown size={12} className="text-blue-400" />
      ) : (
        <ChevronUp size={12} className="text-blue-400" />
      )
    ) : (
      <ChevronDown size={12} className="text-gray-600" />
    );

  return (
    <div className="bg-[#171823] rounded-2xl w-full overflow-hidden">
      <h2 className="text-white text-base font-bold px-6 pt-6 pb-4">
        Holdings
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="bg-[#0d0d14] border-y border-white/10">
              <th className="py-3 pl-6 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </th>

              <th className="py-3 text-left text-xs font-semibold tracking-wider text-gray-400">
                Asset
              </th>

              <th className="py-3 pr-4 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold tracking-wider text-gray-400">
                    Holdings
                  </span>
                  <span className="text-[10px] text-gray-600">
                    Avg Buy Price
                  </span>
                </div>
              </th>

              <th className="py-3 pr-4 text-right text-xs font-semibold tracking-wider text-gray-400">
                Current Price
              </th>

              <th
                className="py-3 pr-4 text-right text-xs font-semibold tracking-wider
                  text-gray-400 cursor-pointer select-none"
                onClick={() => handleSort("stcg")}
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  <SortIcon col="stcg" /> Short-Term
                </span>
              </th>

              <th
                className="py-3 pr-4 text-right text-xs font-semibold tracking-wider
                  text-gray-400 select-none"
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  Long-Term
                </span>
              </th>

              <th className="py-3 pr-6 text-right text-xs font-semibold tracking-wider text-gray-400">
                <span className="inline-flex items-center gap-1 justify-end">
                  Amount to Sell
                  <div title="Populated when row is selected">
                    <Info size={12} className="text-gray-600" />
                  </div>
                </span>
              </th>
            </tr>
          </thead>

          <tbody>
            {displayed.map((holding) => {
              const key = getKey(holding);
              const isSelected = selectedCoins.has(key);

              return (
                <tr
                  key={key}
                  onClick={() => toggleCoin(key)}
                  className={`border-b border-white/5 cursor-pointer transition-colors
                    hover:bg-[#132043]
                    ${isSelected ? "bg-blue-500/10" : ""}`}
                >
                  {/* checkbox */}
                  <td className="py-4 pl-6 pr-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCoin(key)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                  </td>

                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={holding.logo}
                        alt={holding.coin}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        style={{ background: "#1e2035" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                        }}
                      />
                      <div className="flex flex-col">
                        <p className="text-gray-500 text-xs">{holding.coin}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 pr-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-white text-sm font-medium">
                        {formatBalance(holding.totalHolding, holding.coin)}
                      </span>
                      <span className="text-gray-500 text-xs mt-0.5">
                        ${holding.averageBuyPrice.toFixed(2)}/{holding.coin}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 pr-4 text-right">
                    <Tooltip
                      position="top"
                      content={
                        <div className="flex items-center gap-1 pr-2 text-xs whitespace-nowrap">
                          <span className="text-gray-700">Full price:</span>

                          <span className="font-bold text-gray-900">
                            ${holding.currentPrice.toFixed(8)}
                          </span>
                        </div>
                      }
                    >
                      <span className="text-white text-sm cursor-default">
                        {formatPrice(holding.currentPrice)}
                      </span>
                    </Tooltip>
                  </td>

                  {/* short term */}
                  <td className="py-4 pr-4 text-right">
                    <GainCell
                      gain={holding.stcg.gain}
                      balance={holding.stcg.balance}
                      coin={holding.coin}
                    />
                  </td>

                  {/* long term */}
                  <td className="py-4 pr-4 text-right">
                    <GainCell
                      gain={holding.ltcg.gain}
                      balance={holding.ltcg.balance}
                      coin={holding.coin}
                    />
                  </td>

                  {/* amount to sell */}
                  <td className="py-4 pr-6 text-right">
                    {isSelected ? (
                      <span className="text-blue-400 text-sm font-semibold">
                        {formatBalance(holding.totalHolding, holding.coin)}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > DEFAULT_ROWS && (
        <div className="px-6 py-4 border-t border-white/5">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="flex items-center gap-1 cursor-pointer text-blue-400 text-sm font-medium
              hover:text-blue-300 transition-colors"
          >
            {showAll ? (
              <>
                Show Less
                <ChevronUp size={15} />
              </>
            ) : (
              <>
                View All
                <ChevronDown size={15} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
