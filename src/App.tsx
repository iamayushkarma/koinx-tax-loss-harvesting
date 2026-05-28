import { useState } from "react";
import { Info, ChevronDown } from "lucide-react";
import HoldingsTable from "./components/HoldingsTable/HoldingsTable";
import CapitalGainsCard from "./components/CapitalGainsCard/CapitalGainsCard";
import Loader from "./components/Loader/Loader";
import ErrorState from "./components/ErrorState/ErrorState";
import { useHarvesting } from "./context/HarvestingContext";
import { HarvestingProvider } from "./context/HarvestingContext";
import Tooltip from "./components/Tooltip/Tooltip";

function TaxPage() {
  const { capitalGains, afterHarvesting, loading, error, retry } =
    useHarvesting();
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!capitalGains || !afterHarvesting) return null;

  const preRealised =
    capitalGains.stcg.profits -
    capitalGains.stcg.losses +
    (capitalGains.ltcg.profits - capitalGains.ltcg.losses);

  return (
    <div className="min-h-screen px-4 py-6 md:px-10 md:py-8">
      {/* header */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-white text-2xl font-bold">Tax Optimisation</h1>
        <Tooltip
          position="bottom"
          content={
            <div className="flex flex-col gap-3 pr-4">
              <ul className="flex flex-col gap-2 text-gray-700">
                <li>
                  • See your capital gains for FY 2024-25 in the left card
                </li>
                <li>
                  • Check boxes for assets you plan on selling to reduce your
                  tax liability
                </li>
                <li>
                  • Instantly see your updated tax liability in the right card
                </li>
              </ul>
              <p className="text-gray-800">
                <span className="font-bold">Pro tip:</span> Experiment with
                different combinations of your holdings to optimize your tax
                liability
              </p>
            </div>
          }
        >
          <span className="text-blue-400 text-sm font-medium hover:underline cursor-pointer">
            How it works?
          </span>
        </Tooltip>
      </div>

      {/* disclaimer banner */}
      <div className="mb-6 border border-blue-500/30 rounded-xl overflow-hidden">
        <button
          onClick={() => setDisclaimerOpen((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3
            bg-[#0f1a2e] hover:bg-[#0f2040] transition-colors"
        >
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium">
            <Info size={16} />
            Important Notes And Disclaimers
          </div>
          <ChevronDown
            size={16}
            className={`text-blue-300 transition-transform ${disclaimerOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* expandable content */}
        {disclaimerOpen && (
          <div className="px-4 py-3 bg-[#0a1525] text-gray-400 text-sm leading-relaxed">
            Tax loss harvesting involves selling assets at a loss to offset
            capital gains. This tool provides estimates only and does not
            constitute financial or tax advice. Please consult a qualified tax
            professional before making any decisions.
          </div>
        )}
      </div>

      {/* capital gains cards — stack on mobile, side by side on md+ */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <CapitalGainsCard title="Pre Harvesting" data={capitalGains} />
        </div>
        <div className="w-full md:w-1/2">
          <CapitalGainsCard
            title="After Harvesting"
            data={afterHarvesting}
            isAfter
            preRealisedGains={preRealised}
          />
        </div>
      </div>

      {/* holdings table */}
      <HoldingsTable />
    </div>
  );
}

function App() {
  return (
    <HarvestingProvider>
      <TaxPage />
    </HarvestingProvider>
  );
}

export default App;
