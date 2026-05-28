import { useState } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { useHarvesting } from "../../context/HarvestingContext";
import type { Holding } from "../../api/holdings";

// how many rows to show before "View All"
const DEFAULT_ROWS = 5;

// single row gain cell — shows amount and balance below it
const GainCell = ({ gain, balance }: { gain: number; balance: number }) => {
  const isPositive = gain >= 0;
  return (
    <div className="flex flex-col">
      <span
        className={`text-sm font-semibold ${isPositive ? "text-green-400" : "text-red-400"}`}
      >
        {isPositive ? "+" : ""}₹{gain.toFixed(2)}
      </span>
      <span className="text-xs text-gray-500">{balance.toFixed(6)}</span>
    </div>
  );
};

const HoldingsTable = () => {
  const { holdings, selectedCoins, toggleCoin, toggleAll } = useHarvesting();
  const [showAll, setShowAll] = useState(false);
  const [sortKey, setSortKey] = useState<"stcg" | "ltcg" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // unique key per holding since coin symbols can repeat (e.g two USDC)
  const getKey = (h: Holding) => `${h.coin}-${h.coinName}`;

  const allKeys = holdings.map(getKey);
  const allSelected =
    allKeys.length > 0 && allKeys.every((k) => selectedCoins.has(k));
  const someSelected = allKeys.some((k) => selectedCoins.has(k));

  // sort holdings by stcg or ltcg gain
  const sorted = [...holdings].sort((a, b) => {
    if (!sortKey) return b.stcg.gain - a.stcg.gain; // default sort by stcg descending
    const valA = sortKey === "stcg" ? a.stcg.gain : a.ltcg.gain;
    const valB = sortKey === "stcg" ? b.stcg.gain : b.ltcg.gain;
    return sortDir === "desc" ? valB - valA : valA - valB;
  });

  const displayed = showAll ? sorted : sorted.slice(0, DEFAULT_ROWS);

  const handleSort = (key: "stcg" | "ltcg") => {
    if (sortKey === key) {
      // flip direction if same column clicked
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: "stcg" | "ltcg" }) => {
    if (sortKey !== col)
      return <ChevronDown size={12} className="text-gray-600" />;
    return sortDir === "desc" ? (
      <ChevronDown size={12} className="text-blue-400" />
    ) : (
      <ChevronUp size={12} className="text-blue-400" />
    );
  };

  return (
    <div className="bg-[#1a1a2e] rounded-2xl p-4 md:p-6 w-full">
      <h2 className="text-white text-base font-bold mb-4">Holdings</h2>

      {/* scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10">
              <th className="pb-3 text-left w-8">
                {/* select all checkbox — shows indeterminate state when some selected */}
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

              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Asset
              </th>

              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Holdings / Avg Buy
              </th>

              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Current Price
              </th>

              {/* sortable short term column */}
              <th
                className="pb-3 text-right text-xs font-semibold uppercase tracking-wider
                  text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("stcg")}
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  Short-Term Gain <SortIcon col="stcg" />
                </span>
              </th>

              {/* sortable long term column */}
              <th
                className="pb-3 text-right text-xs font-semibold uppercase tracking-wider
                  text-gray-500 cursor-pointer select-none"
                onClick={() => handleSort("ltcg")}
              >
                <span className="inline-flex items-center gap-1 justify-end">
                  Long-Term Gain <SortIcon col="ltcg" />
                </span>
              </th>

              <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span className="inline-flex items-center gap-1 justify-end">
                  Amount to Sell
                  {/* tooltip hint */}
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
                    hover:bg-white/5
                    ${isSelected ? "bg-blue-500/10" : ""}`}
                >
                  {/* checkbox */}
                  <td className="py-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCoin(key)}
                      onClick={(e) => e.stopPropagation()} // prevent double toggle
                      className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                    />
                  </td>

                  {/* asset name + logo */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={holding.logo}
                        alt={holding.coin}
                        className="w-8 h-8 rounded-full object-cover bg-gray-700"
                        // fallback if image fails to load
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg";
                        }}
                      />
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {holding.coin}
                        </p>
                        <p className="text-gray-500 text-xs truncate max-w-[120px]">
                          {holding.coinName}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* holdings and avg buy price */}
                  <td className="py-4 text-right">
                    <div className="flex flex-col">
                      <span className="text-white text-sm">
                        {holding.totalHolding.toFixed(6)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        ₹{holding.averageBuyPrice.toFixed(2)}
                      </span>
                    </div>
                  </td>

                  {/* current price */}
                  <td className="py-4 text-right">
                    <span className="text-white text-sm">
                      ₹{holding.currentPrice.toFixed(2)}
                    </span>
                  </td>

                  {/* short term gain */}
                  <td className="py-4 text-right">
                    <GainCell
                      gain={holding.stcg.gain}
                      balance={holding.stcg.balance}
                    />
                  </td>

                  {/* long term gain */}
                  <td className="py-4 text-right">
                    <GainCell
                      gain={holding.ltcg.gain}
                      balance={holding.ltcg.balance}
                    />
                  </td>

                  {/* amount to sell — only shows when selected */}
                  <td className="py-4 text-right">
                    {isSelected ? (
                      <span className="text-blue-400 text-sm font-semibold">
                        {holding.totalHolding.toFixed(6)}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-sm">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* view all / collapse toggle */}
      {holdings.length > DEFAULT_ROWS && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 w-full flex items-center justify-center gap-2 text-blue-400
            text-sm font-semibold py-2 rounded-xl border border-blue-500/30
            hover:bg-blue-500/10 transition-colors"
        >
          {showAll ? (
            <>
              <ChevronUp size={16} /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} /> View All ({holdings.length} assets)
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default HoldingsTable;
