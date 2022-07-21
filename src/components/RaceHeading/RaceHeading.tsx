import { FC, useCallback } from "react";
import { getQuarter, getYear } from "date-fns";
import shallow from "zustand/shallow";

import { useRacingStore, useSoundStore } from "src/store";
import { useUpdateEffect } from "@hooks";
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

  const { racingStatus, getIsFinishedRacing } = useRacingStore(
    (state) => ({
      racingStatus: state.racingStatus,
      getIsFinishedRacing: state.getIsFinishedRacing,
      startRacing: state.startRacing,
    }),
    shallow
  );

  const { pauseRaceAudio, playVictoryAudio, isMute, setIsMute } = useSoundStore(
    (state) => ({
      pauseRaceAudio: state.pauseRaceAudio,
      playVictoryAudio: state.playVictoryAudio,
      isMute: state.isMute,
      setIsMute: state.setIsMute,
    }),
    shallow
  );

  // keep checking racing status to determine when to stop the music
  useUpdateEffect(() => {
    if (getIsFinishedRacing()) {
      pauseRaceAudio();
      playVictoryAudio();
    }
  }, [racingStatus]);

  const currDate = new Date();

  return (
    <div className="max-w-screen z-30">
      <div className="flex flex-col justify-center items-center px-7 pt-3 pb-3">
        <div className="flex justify-between text-white text-3xl mb-1 w-full">
          <p>{`Quarter ${getQuarter(currDate)} ${getYear(currDate)}`}</p>
          {/*
          <p>{`${weeksRemaining} week${
            weeksRemaining > 1 ? "s" : ""
          } Remaining`}</p>
          */}
          {/*
            Mute button testing
          <div onClick={() => setIsMute()} className="w-10">
            <img
              src={isMute ? "/sound-off.ico" : "/sound-on.ico"}
              alt="mute-unmute"
            />
          </div>
          */}
          <p>{`Quarter Target ${totalWorkSold().toFixed(
            1
          )}m / ${totalRevenueGuide().toFixed(1)}m`}</p>
        </div>
        <div className="w-[60%] h-full relative px-6">
          <img src="/Title.gif" alt="heading" />
        </div>
      </div>
    </div>
  );
};

export default RaceHeading;
