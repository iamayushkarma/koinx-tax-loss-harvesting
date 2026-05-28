import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { CapitalGainsData } from "../../api/capitalGains";

interface Props {
  title: string;
  data: CapitalGainsData;
  isAfter?: boolean;
  preRealisedGains?: number;
}

// shows icon based on value sign
const GainIcon = ({ value }: { value: number }) => {
  if (value > 0)
    return <TrendingUp size={14} className="text-green-400 inline ml-1" />;
  if (value < 0)
    return <TrendingDown size={14} className="text-red-400 inline ml-1" />;
  return <Minus size={14} className="text-gray-400 inline ml-1" />;
};

const Row = ({
  label,
  stcg,
  ltcg,
  isAfter,
  showIcon = false,
}: {
  label: string;
  stcg: number;
  ltcg: number;
  isAfter: boolean;
  showIcon?: boolean;
}) => (
  <div className="grid grid-cols-3 items-center py-3 border-b border-white/10 last:border-0">
    <span
      className={`text-sm font-medium ${isAfter ? "text-blue-100" : "text-gray-400"}`}
    >
      {label}
    </span>
    <span className="text-sm font-semibold text-right text-white">
      ₹{stcg.toFixed(2)}
      {showIcon && <GainIcon value={stcg} />}
    </span>
    <span className="text-sm font-semibold text-right text-white">
      ₹{ltcg.toFixed(2)}
      {showIcon && <GainIcon value={ltcg} />}
    </span>
  </div>
);

const CapitalGainsCard = ({
  title,
  data,
  isAfter = false,
  preRealisedGains,
}: Props) => {
  const stcgNet = data.stcg.profits - data.stcg.losses;
  const ltcgNet = data.ltcg.profits - data.ltcg.losses;
  const realised = stcgNet + ltcgNet;

  const savings =
    preRealisedGains !== undefined ? preRealisedGains - realised : 0;
  const showSavings = isAfter && preRealisedGains !== undefined && savings > 0;

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-4 w-full
      ${isAfter ? "bg-[#0052CC]" : "bg-[#1a1a2e]"}`}
    >
      {/* title row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-white text-base font-bold tracking-wide">
          {title}
        </h2>

        {/* savings badge — only on after harvesting card when savings > 0 */}
        {showSavings && (
          <span
            className="flex items-center gap-1 text-xs font-semibold
            bg-green-400/20 text-green-300 px-3 py-1 rounded-full"
          >
            <TrendingDown size={12} />
            You save ₹{savings.toFixed(2)}
          </span>
        )}
      </div>

      {/* column headers */}
      <div className="grid grid-cols-3">
        <span />
        <span
          className={`text-xs font-semibold uppercase tracking-wider text-right
          ${isAfter ? "text-blue-200" : "text-gray-500"}`}
        >
          Short-Term
        </span>
        <span
          className={`text-xs font-semibold uppercase tracking-wider text-right
          ${isAfter ? "text-blue-200" : "text-gray-500"}`}
        >
          Long-Term
        </span>
      </div>

      {/* data rows */}
      <div className="flex flex-col">
        <Row
          label="Profits"
          stcg={data.stcg.profits}
          ltcg={data.ltcg.profits}
          isAfter={isAfter}
        />
        <Row
          label="Losses"
          stcg={data.stcg.losses}
          ltcg={data.ltcg.losses}
          isAfter={isAfter}
        />
        {/* net gains row shows trend icon */}
        <Row
          label="Net Capital Gains"
          stcg={stcgNet}
          ltcg={ltcgNet}
          isAfter={isAfter}
          showIcon
        />
      </div>

      {/* realised gains full width */}
      <div
        className={`flex items-center justify-between rounded-xl px-4 py-3
        ${isAfter ? "bg-white/15" : "bg-white/5"}`}
      >
        <span className="text-white text-sm font-semibold">
          Realised Capital Gains
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white text-base font-bold">
            ₹{realised.toFixed(2)}
          </span>
          <GainIcon value={realised} />
        </div>
      </div>
    </div>
  );
};

export default CapitalGainsCard;
