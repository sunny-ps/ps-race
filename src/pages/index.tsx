import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import type { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { map } from "ramda";

import { RaceHeading, StartOverlay, Counter, Confetti } from "@components";
import { shuffleArray2 } from "@utils/shuffleArray";
import { DBData, RevenueData } from "@types";

import { revenueData } from "src/data";
import { getSession } from "next-auth/react";

const RaceStage = dynamic(() => import("../components/RaceStage"), {
  ssr: false,
});

export const mergeData = (
  xs: Array<RevenueData>,
  ys: Array<DBData>
): RevenueData[] => {
  const transformedYS = map(
    (y) => ({
      industry: y.industry,
      revenue: {
        workSold: y.workSold,
        revenueGuide: y.revenueGuide,
      },
    }),
    ys
  );

  // @ts-ignore
  const result: Array<RevenueData> = Object.values(
    []
      // @ts-ignore
      .concat(xs, transformedYS)
      .reduce(
        // @ts-ignore
        (r, c) => ((r[c.industry] = Object.assign(r[c.industry] || {}, c)), r),
        {}
      )
  );
  return result;
};

const Home: NextPage = () => {
  // instead of using the whole window, we'll put our stage into a container div and use the computed
  // dimensions of the container instead
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const fetcher = async (
    input: RequestInfo,
    init: RequestInit,
    ...args: any[]
  ) => {
    const res = await fetch(input, init);
    return res.json();
  };

  const { data: dbData, error: dbDataError } = useSWR("/api/rev-data", fetcher);
  // const dbData = revenueData;

  const router = useRouter()


  // reload window on resize
  useEffect(() => {
    window.addEventListener('resize', () => router.reload())
  })

  useEffect(() => {
    console.log("rendered");
    const container = document.querySelector(".stage-container");

    if (container) {
      const containerWidth = Number(
        window
          .getComputedStyle(container as HTMLDivElement)
          .getPropertyValue("width")
          .replace(/[^\d.]/g, "")
      );

      const containerHeight = Number(
        window
          .getComputedStyle(container as HTMLDivElement)
          .getPropertyValue("height")
          .replace(/[^\d.]/g, "")
      );

      setContainerDimensions({
        width: containerWidth,
        height: containerHeight,
      });
    }
  }, [dbData]);

  if (dbDataError) {
    return (
      <div className="h-screen w-screen flex flex-col px-40 pb-24">
        <div className="stage-container shrink h-full /border-black /border-4">
          <p>Failed to load.</p>
        </div>
      </div>
    );
  }

  if (!dbData) {
    return (
      <div className="stage-container h-screen grid place-items-center">
        <img
          src="/Loading.gif"
          alt="loading icon"
          className="h-[250px] w-[250px]"
        />
      </div>
    );
  }

  const transformedData = mergeData(revenueData, dbData);
  const shuffledData = shuffleArray2(transformedData);
  // const shuffledData = shuffleArray2(revenueData);

  return (
    <>
      <div className="h-screen w-screen grid place-items-center absolute">
        <Counter />
      </div>
      <div className="h-screen w-screen flex flex-col font-[VT323]">
        <StartOverlay />
        <RaceHeading dbData={dbData} />
        <div className="pl-20 pr-24 pb-12 h-full">
          <div className="stage-container shrink h-full /border-black /border">
            <RaceStage dimensions={containerDimensions} data={shuffledData} />
          </div>
        </div>
        <Confetti />
      </div>
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req } = ctx;

  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  return {
    props: { session },
  };
}

export default Home;
