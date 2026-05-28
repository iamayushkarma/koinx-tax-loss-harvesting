import HoldingsTable from "./components/HoldingsTable/HoldingsTable";
import Loader from "./components/Loader/Loader";
import ErrorState from "./components/ErrorState/ErrorState";
import { useHarvesting } from "./context/HarvestingContext";

function App() {
  const { capitalGains, afterHarvesting, loading, error, retry } =
    useHarvesting();

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  return (
    <>
      <HoldingsTable />
    </>
  );
}

export default App;
