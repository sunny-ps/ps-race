import { FC, useCallback } from "react";
import { getQuarter, getYear } from "date-fns";
import { useRevenueStatus } from "src/store";

import { DBData } from "@types";

interface IRaceHeadingProps {
  dbData: Array<DBData>;
}
const RaceHeading: FC<IRaceHeadingProps> = ({ dbData }) => {
  const totalRevenueGuide = useCallback(
    () =>
      dbData.reduce((acc, curr) => Number(acc) + Number(curr.revenueGuide), 0),
    [dbData]
  );

  const totalWorkSold = useCallback(
    () => dbData.reduce((acc, curr) => Number(acc) + Number(curr.workSold), 0),
    [dbData]
  );

  const revenueType = useRevenueStatus((state) => state.revenueType);

  const currDate = new Date();

  return (
    <div className="max-w-screen z-30">
      <div className="flex flex-col justify-center items-center px-7 pt-3 pb-3">
        <div className="flex justify-between text-white text-3xl mb-1 w-full">
          <p>
            {revenueType === "quarter"
              ? `Quarter ${getQuarter(currDate)} `
              : "Full Year "}
            {getYear(currDate)}
          </p>
          <p>
            {`${revenueType === "quarter" ? "Quarter" : "Full Year"} Target `}
            {`${totalWorkSold().toFixed(1)}m / ${totalRevenueGuide().toFixed(
              1
            )}m`}
          </p>
        </div>
        <div className="w-[60%] h-full relative px-6">
          <img src="/Title.gif" alt="heading" />
        </div>
      </div>
    </div>
  );
};

export default RaceHeading;
