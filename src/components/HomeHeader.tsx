import Tooltip from "./utility/Tooltip";

function HomeHeader() {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h1 className="text-white text-2xl font-bold">Tax Optimisation</h1>
      <Tooltip
        position="bottom"
        content={
          <div className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1 leading-5 text-gray-700">
              <li>• See your capital gains for FY 2024-25 in the left card</li>
              <li>
                • Check boxes for assets you plan on selling to reduce your tax
                liability
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
        <span className="text-blue-400 select-none text-sm font-medium hover:underline cursor-pointer">
          How it works?
        </span>
      </Tooltip>
    </div>
  );
}

export default HomeHeader;
