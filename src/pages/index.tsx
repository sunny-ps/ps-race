import { useEffect } from "react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { map } from "ramda";
import { getSession } from "next-auth/react";

import { RaceHeading, StartOverlay, Counter, Confetti } from "@components";
import { shuffleArray2 } from "@utils/shuffleArray";

import { useRevenueStatus } from "src/store";

import { DBData, RevenueData } from "@types";

import { revenueData } from "src/data";

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
  const router = useRouter();

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

  const { data: statusData, error: statusDataError } = useSWR(
    "/api/admin-data",
    fetcher
  );

  const { setRevenueType } = useRevenueStatus((state) => ({
    setRevenueType: state.setRevenueType,
  }));

  useEffect(() => {
    statusData && setRevenueType(statusData[0].revenueType);
  }, []);

  // reload window on resize
  useEffect(() => {
    const reload = () => router.reload();
    window.addEventListener("resize", reload);

    return () => window.removeEventListener("resize", reload);
  });

  useEffect(() => {}, [dbData]);

  if (dbDataError) {
    return (
      <div className="h-screen w-screen flex flex-col px-40 pb-24">
        <div className="shrink h-full">
          <p>Failed to load.</p>
        </div>
      </div>
    );
  }

  if (!dbData) {
    return (
      <div className="h-screen grid place-items-center">
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
    <div>
      <Counter />
      <StartOverlay />

      <div className="h-screen max-w-screen flex flex-col">
        <RaceHeading dbData={dbData} />
        <div className="pl-20 pr-24 pb-12 h-full w-full">
          <div className="h-full /border-black /border">
            <RaceStage data={shuffledData} />
          </div>
        </div>
      </div>
      <Confetti />
    </div>
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
