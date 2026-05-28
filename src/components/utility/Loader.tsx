import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center gap-3">
      <Loader2 size={36} className="text-blue-500 animate-spin" />
      <p className="text-gray-400 text-sm">Fetching your portfolio...</p>
    </div>
  );
};

export default Loader;
