import { FC } from "react";

import type { RevenueData } from "@types";

export type BgColor =
  | "bg-[#ffa726]"
  | "bg-[#fdd835]"
  | "bg-[#4fc3f7]"
  | "bg-[#e57373]"
  | "bg-[#b39ddb]";

export interface IIndustryInfoProps extends Partial<RevenueData> {}

const IndustryInfo: FC<IIndustryInfoProps> = ({
  image,
  rectColor,
  revenue,
}) => {
  const { revenueGuide, workSold } = revenue!!;

  return (
    <div
      className={`bg-[${rectColor}] h-[100px] w-52 p-2 flex justify-between items-center`}
    >
      <img className="w-16 h-16" src={image} alt="hi" />
      <div>
        <p>Goal: {Number(revenueGuide)}</p>
        <p>Work sold: {Number(workSold)}</p>
        <p>Gap: {(revenueGuide * 10 - workSold * 10) / 10}</p>
      </div>
    </div>
  );
};

export default IndustryInfo;
