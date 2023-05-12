import { useState } from "react";
import { getQuarter, getYear } from "date-fns";

import { useRevenueStatus, useRacingStore } from "src/store";

const StartOverlay = () => {
  const [overlayIsClosed, setOverlayIsClosed] = useState(false);

  const setIsPaused = useRacingStore((state) => state.setIsPaused);
  const revenueType = useRevenueStatus((state) => state.revenueType);

  const currDate = new Date();

  return (
    <div
      className={`h-full w-screen max-h-screen z-40 fixed ${
        overlayIsClosed ? "-top-[2000px]" : "top-0"
      } transition-all duration-500 ease-out`}
      style={{
        backgroundImage: `url('/Backgrounds/Start Background.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="h-4/6 flex items-center justify-center flex-col">
        <h1 className="text-6xl text-[#FDD839] mb-5">
          {revenueType === "quarter"
            ? `Quarter ${getQuarter(currDate)} `
            : "Full Year "}
          {getYear(currDate)}
        </h1>
        <div className="h-auto w-7/12 mb-11">
          <img src="/Start Heading.gif" alt="start heading" />
        </div>
        <button
          onClick={() => {
            setOverlayIsClosed(true);
            setIsPaused(true);
          }}
          className="bg-[#F7C804] px-8 py-2 w-auto border-[#E68F21] border-[6px] text-4xl 
              tracking-widest hover:-translate-y-1 active:translate-y-1"
          style={{
            boxShadow: "7px 7px 0px 0px rgba(0,0,0,0.24)",
          }}
          role="button"
        >
          Lets go!
        </button>
      </div>

      <div className="z-50 relative -bottom-64">
        <img
          src="/Mascots_Big/Kangaroo_big.png"
          className="absolute bottom-40 left-28 w-96 z-[100]"
          alt="kangaroo"
        />
        <img
          src="/Mascots_Big/Koala_big.png"
          className="absolute w-48 bottom-44 left-[440px] z-[110]"
          alt="koala"
        />
        <img
          src="/Mascots_Big/Quoakka_big.png"
          className="absolute bottom-44 right-48 w-60"
          alt="quoakka"
        />
        <img
          src="/Mascots_Big/Spider_big.png"
          className="absolute bottom-40 right-[400px] w-72"
          alt="spider"
        />
        <img
          src="/Mascots_Big/Croc_big.png"
          className="absolute bottom-40 right-80 w-[430px]"
          alt="croc"
        />
        <img
          src="/Mascots_Big/Sushi_big.png"
          className="absolute bottom-36 left-[360px] w-40 z-[120]"
          alt="sushi"
        />
      </div>
    </div>
  );
};

export default StartOverlay;
