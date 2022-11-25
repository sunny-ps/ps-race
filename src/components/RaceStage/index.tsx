import { FC, useState } from "react";
import dynamic from "next/dynamic";
import { Stage, _ReactPixi } from "@inlet/react-pixi";
import { Application, Rectangle, TextStyle, Loader } from "pixi.js";
import { AnimatedGIFLoader } from "@pixi/gif";

import { useContainerStore } from "src/store";
import { RevenueData } from "@types";
import { useUpdateEffect } from "@hooks";

const RevenueAnimal = dynamic(() => import("../RevenueAnimal/RevenueAnimal"), {
  ssr: false,
});

interface IPixiRevenueRaceProps {
  data: RevenueData[];
}

const RaceStage: FC<IPixiRevenueRaceProps> = ({ data }) => {
  const containerBounds = useContainerStore(
    (state) => state.containerBounds
  ) as Rectangle;

  const [app, setApp] = useState<Application>();

  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

  Loader.registerPlugin(AnimatedGIFLoader);

  useUpdateEffect(() => {
    // if (!dimensions.height && !dimensions.width) {
    if (
      app?.view.parentElement?.clientHeight &&
      app?.view.parentElement.clientWidth
    ) {
      setDimensions({
        height: app?.view.parentElement?.clientHeight!!,
        width: app?.view.parentElement?.clientWidth!!,
      });
    }
    // }
  }, [app?.view.parentElement?.clientHeight]);
  /** Quite a bit going on here. Why are grids so hard in PIXI? Anyways, to ensure to the best of my
   * abilities that each container is spaced equally like in a grid, firstly we get the dimensions
   * the container. We then multiply the number of containers (number of industries) with the
   * height of each container. This gives us the total spacing taken up by all the containers. Eg. if
   * each container has a height of 80px, 5 x 80 = 450px. Finally, we substract the size of the
   * outer container/stage from this number, which gives us the remaing space
   */
  const $remainingSpace =
    dimensions?.height!! - containerBounds.height * data.length;

  /**
   * With the reminaing space, we decide to give each sprite container a gap at the top so that each container
   * is spaced equally. To achieve this, we divide the remaning space with the data length.
   */
  const $gapSize = $remainingSpace / data.length;

  /**
    Temporary value to space the sprites and rect to display the industry text on the side until
    the text within bar is sorted out
  */
  const WIDTH_SPACING_GAP = 150;

  // Resize the renderer
  return (
    <Stage
      height={dimensions.height}
      width={dimensions.width}
      options={{
        backgroundAlpha: 0,
        // resizeTo: screenWindow as Window,
      }}
      style={{
        position: "absolute",
      }}
      onMount={setApp}
    >
      {data.map((item, idx) => {
        const containerAttributes = {
          position: {
            x: 0,
            //  This is where the magic happens, the beight of the container * idx
            // (starting at 0) + the gap between each container. The + number at the end is a
            // manual adjustment as the sprite seems to overflowing. This will requre some adjustment
            // based on the scale (responsiveness)
            y: containerBounds.height * idx + $gapSize * idx,
          },
          anchor: 0.5,
        };

        const mascotAttributes = {
          image: item.image,
          // scale: 0.6,
          width: 85,
          height: 85,
          anchor: { x: 0.5, y: 0 },
          x: 80 + WIDTH_SPACING_GAP,
        };

        const rectangleAttributes = {
          // Convert hex string to hex format
          color: parseInt(item.rectColor.replace(/^#/, ""), 16),
          lineStyle: parseInt(item.rectBorder.replace(/^#/, ""), 16),
          x: 5 + WIDTH_SPACING_GAP,
          width: 80,
          height: 65,
        };

        // TODO: temporary fix for growth markets.
        const headshotAttributes = {
          image: item.headshot,
          industry: item.industry,
          width: item.industry === "Growth Markets" ? 110 : 55,
          height: 55,
          anchor: { x: item.industry === "Growth Markets" ? 0.4 : 0.6, y: 0.5 },
          x: 70,
          y: 40,
        };

        const industryTextAttributes = {
          text: item.industry,
          x: 70,
          y: 80,
          anchor: { x: 0.5, y: 0 },
          style: new TextStyle({
            align: "center",
            fontFamily: "VT323",
            fontSize: 27,
            fill: "#fff",
            wordWrap: true,
            wordWrapWidth: 120,
          }),
        };

        const foodSpriteAttributes = {
          image: "/Race_Assets/Sushi.svg",
          width: 70,
          height: 70,
          x: dimensions.width! - 230,
          anchor: { x: 0, y: -0.2 },
        };

        return (
          <RevenueAnimal
            key={idx}
            industryName={item.industry}
            revenue={item.revenue}
            mascotAttributes={mascotAttributes}
            headshotAttributes={headshotAttributes}
            containerAttributes={containerAttributes}
            rectangleAttributes={rectangleAttributes}
            industryTextAttributes={industryTextAttributes}
            foodSpriteAttributes={foodSpriteAttributes}
          />
        );
      })}
    </Stage>
  );
};

export default RaceStage;
