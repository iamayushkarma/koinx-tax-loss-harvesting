import HoldingsTable from "./components/HoldingsTable";
import CapitalGainsCard from "./components/CapitalGainsCard";
import Loader from "./components/utility/Loader";
import ErrorState from "./components/utility/ErrorState";
import { useHarvesting } from "./context/HarvestingContext";
import { HarvestingProvider } from "./context/HarvestingContext";
import HomeHeader from "./components/HomeHeader";
import HomeBanner from "./components/HomeBanner";

function TaxPage() {
  const { capitalGains, afterHarvesting, loading, error, retry } =
    useHarvesting();

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
      <HomeHeader />
      {/* disclaimer banner */}
      <HomeBanner />
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
