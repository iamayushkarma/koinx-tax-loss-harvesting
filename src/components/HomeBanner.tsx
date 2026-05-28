import { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

const DISCLAIMERS = [
  {
    title: "Price Source Disclaimer",
    content: (
      <>
        Please note that the current price of your coins may differ from the
        prices listed on specific exchanges. This is because we use{" "}
        <span className="font-bold text-white">CoinGecko</span> as our default
        price source for certain exchanges, rather than fetching prices directly
        from the exchange.
      </>
    ),
  },
  {
    title: "Country-specific Availability",
    content: (
      <>
        Tax loss harvesting may{" "}
        <span className="font-bold text-white">
          not be supported in all countries
        </span>
        . We strongly recommend consulting with your local tax advisor or
        accountant before performing any related actions on your exchange.
      </>
    ),
  },
  {
    title: "Utilization of Losses",
    content: (
      <>
        Tax loss harvesting typically allows you to offset capital gains.
        However, if you have{" "}
        <span className="font-bold text-white">
          zero or no applicable crypto capital gains
        </span>
        , the usability of these harvested losses may be limited. Kindly confirm
        with your tax advisor how such losses can be applied in your situation.
      </>
    ),
  },
];

function HomeBanner() {
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  return (
    <div className="mb-6 border border-blue-500/30 rounded-md overflow-hidden">
      <button
        onClick={() => setDisclaimerOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3
          bg-[#132043] hover:bg-[#0f2040] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
          <Info size={16} />
          Important Notes And Disclaimers
        </div>
        {disclaimerOpen ? (
          <ChevronUp size={16} className="text-blue-300" />
        ) : (
          <ChevronDown size={16} className="text-blue-300" />
        )}
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden
          ${disclaimerOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-6 py-4 bg-[#132043] flex flex-col gap-4 text-sm text-gray-300 leading-relaxed">
          {DISCLAIMERS.map((item) => (
            <div key={item.title} className="flex gap-2">
              <span className="mt-0.5">•</span>
              <p>
                <span className="font-bold text-white">{item.title}</span>
                {": "}
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
