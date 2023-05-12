import { FC, useState, useEffect, useRef, useCallback } from "react";
import {
  Graphics,
  Container,
  Sprite,
  Text,
  useApp,
  useTick,
  _ReactPixi,
} from "@inlet/react-pixi";
import {
  Graphics as PIXIGraphics,
  Container as PIXIContainer,
  Sprite as PIXISprite,
  TextStyle,
} from "pixi.js";
import shallow from "zustand/shallow";

import { useUpdateEffect, useInterval } from "@hooks";
import { useRacingStore, useContainerStore, useConfettiStore } from "src/store";
import { normalizeValue, denormalizeValue, findPercentage } from "@utils/calc";

import type { Industries, Revenue } from "@types";

export interface RectangleAttributes extends _ReactPixi.ISprite {
  color: number;
  lineStyle: number;
}

export interface HeadshotAttributes extends _ReactPixi.ISprite {
  industry: Industries;
}

interface IRevenueAnimal {
  mascotAttributes: _ReactPixi.ISprite;
  headshotAttributes: HeadshotAttributes;
  foodSpriteAttributes: _ReactPixi.ISprite;
  containerAttributes: _ReactPixi.IContainer;
  rectangleAttributes: RectangleAttributes;
  industryTextAttributes: _ReactPixi.IText;
  industryName: Industries;
  revenue: Revenue;
}

const RevenueAnimal: FC<IRevenueAnimal> = ({
  mascotAttributes,
  headshotAttributes,
  foodSpriteAttributes,
  containerAttributes,
  rectangleAttributes,
  industryTextAttributes,
  industryName,
  revenue,
}) => {
  const [rectWidth, setRectWidth] = useState(rectangleAttributes.width);
  const [mascotX, setMascotX] = useState(mascotAttributes.x);
  const [mascotRotation, setMascotRotation] = useState(0);
  const [gapTextPosX, setGapTextPosX] = useState(0);
  const [workSoldTextPosX, setWorkSoldTextPosX] = useState(
    foodSpriteAttributes.x! + 250
  );
  const [trackLimits, setTrackLimits] = useState({
    start: 0,
    finish: 0,
  });

  const app = useApp();

  const containerRef = useRef<PIXIContainer>(null);
  const mascotRef = useRef<PIXISprite>(null);
  const foodRef = useRef<PIXISprite>(null);

  const counter = useRef(0);

  // NOTE: Sprite reaching the sushi/goal (and not the rectangle) will be the determining factor
  // that decides if the industry has reached its goal
  // const mascotX = useRef(mascotAttributes.x);
  const percentTextX = useRef(10);
  const finalPosX = useRef(mascotAttributes.x);
  // initial position of the remaining gap container goes over bounds to keep it hidden

  const speedConstant = useRef(1.5 * (2 / app.renderer.resolution));

  const FONT_FAMILY = "VT323";
  const WORK_SOLD_TEXT_FINAL_POS_X = -10;

  const statsTextStyle = new TextStyle({
    fontFamily: FONT_FAMILY,
    fontSize: 27,
    fill: "#fff",
  });

  const totalGap = (revenue.revenueGuide * 10 - revenue.workSold * 10) / 10;

  const { racingStatus, setIsFinishedRacing, getIsFinishedRacing } =
    useRacingStore(
      (state) => ({
        racingStatus: state.racingStatus,
        setIsFinishedRacing: state.setIsFinishedRacing,
        getIsFinishedRacing: state.getIsFinishedRacing,
      }),
      shallow
    );

  const setContainerBounds = useContainerStore(
    (state) => state.setContainerBounds
  );

  const { confettiIsRunning, launchConfetti } = useConfettiStore(
    (state) => ({
      confettiIsRunning: state.confettiIsRunning,
      launchConfetti: state.launchConfetti,
    }),
    shallow
  );

  useEffect(() => {
    // set the local bounds of the entire container on the intial render
    setContainerBounds(containerRef.current?.getLocalBounds()!);
    // bounds comes up as a weird decimal number, hence we use ceiling
    setTrackLimits({
      // start: Number(mascotRef.current?.getBounds().x!.toFixed()),
      start: Number(mascotAttributes.x),
      finish: Number(foodSpriteAttributes.x!! + 10),
    });
    setGapTextPosX(foodRef.current?.x! + 225);
  }, []);

  useUpdateEffect(() => {
    const workSoldPercent = findPercentage(
      revenue.workSold,
      revenue.revenueGuide
    );

    const finalPosCalc = Number(
      denormalizeValue(
        workSoldPercent,
        trackLimits.start,
        trackLimits.finish
      ).toFixed(0)
    );

    // an industry can earn more than their set goal. This would mean the the mascot would go past
    // the sushi, which is not ideal. Hence we check if the calculated final position (finalPosCalc)
    // exceeds the track limits finish (position of sushi). If it does, reset the finalPosX to the
    // position of the sushi.
    finalPosX.current =
      finalPosCalc > trackLimits.finish ? trackLimits.finish : finalPosCalc;
  }, [trackLimits]);

  useUpdateEffect(() => {
    if (racingStatus[industryName] && mascotX! >= finalPosX.current!) {
      setIsFinishedRacing(industryName);
    }
    // if the mascot has reached its goal, bring out the confetti
    if (
      Math.floor(
        normalizeValue(mascotX!, trackLimits.start, trackLimits.finish)
      ) === 100 &&
      !confettiIsRunning
    )
      launchConfetti();
  }, [rectWidth]);

  useTick((delta) => {
    counter.current += 0.5 * delta;

    if (racingStatus[industryName] && mascotX! < finalPosX.current!) {
      setMascotX(mascotX! + speedConstant.current);
      percentTextX.current! += speedConstant.current;
      setRectWidth((prevX) => prevX && prevX + speedConstant.current!);
    }

    if (mascotX! >= finalPosX.current! && getIsFinishedRacing()) {
      // slide in the work sold text first once the race is completed
      if (workSoldTextPosX > WORK_SOLD_TEXT_FINAL_POS_X) {
        setWorkSoldTextPosX(workSoldTextPosX - 6);
      }

      // slide in the revenue gap after the work sold text is in position
      if (
        workSoldTextPosX <= WORK_SOLD_TEXT_FINAL_POS_X &&
        gapTextPosX > foodRef.current?.x! + 75
      ) {
        setGapTextPosX(gapTextPosX - 2);
      }
    }

    Math.floor(
      normalizeValue(mascotX!, trackLimits.start, trackLimits.finish)
    ) === 100 && setMascotRotation(Math.cos(counter.current * 0.2) * 0.1);
  });

  // scoop out some of the properties for further processing
  const { x, ..._mascotAttributes } = mascotAttributes;

  const rectG = useCallback(
    (g: PIXIGraphics) => {
      g.clear();
      g.lineStyle(5, rectangleAttributes.lineStyle);
      g.position.y = rectangleAttributes.height!! / 7;
      g.beginFill(rectangleAttributes.color).drawRect(
        rectangleAttributes.x!!,
        rectangleAttributes.y!!,
        rectWidth!!,
        rectangleAttributes.height!!
      );
      g.endFill();
    },
    [rectWidth]
  );

  return (
    <Container {...containerAttributes} ref={containerRef}>
      <Sprite {...foodSpriteAttributes} ref={foodRef} />
      {/*
      <Text
        text={`Goal ${revenue.revenueGuide}m`}
        style={statsTextStyle}
        x={foodRef.current?.x! + 80}
        y={foodRef.current?.y! + 10 ?? 0}
        anchor={{ x: 0, y: -0.8 }}
      />
      */}

      <Container x={gapTextPosX} y={foodRef.current?.height! / 2 ?? 0}>
        <Sprite
          image="/Diamond.png"
          scale={0.7}
          x={10}
          anchor={{ x: 0, y: -0.2 }}
        />
        <Text
          text={`Gap ${totalGap < 0 ? 0 : totalGap}m`}
          style={statsTextStyle}
          x={60}
          anchor={{ x: 0, y: -0.5 }}
        />
      </Container>

      <Graphics draw={rectG} />

      <Sprite {...headshotAttributes} />
      <Text {...industryTextAttributes} />

      <Sprite
        x={mascotX!}
        {..._mascotAttributes}
        ref={mascotRef}
        rotation={mascotRotation}
      />

      {/*
      <Text
        x={percentTextX.current}
        y={30}
        text={
          normalizeValue(
            mascotX!,
            trackLimits.start,
            trackLimits.finish
          ).toFixed(0) + "% "
        }
        style={
          new TextStyle({
            align: "center",
            fontFamily: FONT_FAMILY,
            fontSize: 40,
            wordWrap: true,
            wordWrapWidth: 350,
          })
        }
      />
      */}

      <Container x={workSoldTextPosX}>
        <Sprite image="/Coin.svg" x={200} y={89} scale={1.1} />
        <Text
          text={`Work Sold ${revenue.workSold}m`}
          style={statsTextStyle}
          x={245}
          y={95}
        />
      </Container>
    </Container>
  );
};

export default RevenueAnimal;
