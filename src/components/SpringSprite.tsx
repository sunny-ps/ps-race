// import { useState } from "react";
// import { Stage, Sprite } from "@inlet/react-pixi";
// import { Spring } from "react-spring";
// import { Texture, utils } from "pixi.js";
//
// const width = 400;
// const height = 400;
//
// // helper to convert string or rgb values to hex
// // so PIXI can handle it
// const toHex = (color) =>
//   /^#/.test(color)
//     ? utils.string2hex(color)
//     : utils.rgb2hex(
//         color
//           .replace(/^rgba?\(|\s+|\)$/g, "")
//           .split(",")
//           .map((val) => val / 255)
//       );
//
// const set = () => ({
//   x: Math.random() * width,
//   y: Math.random() * height,
//   rotation: Math.random() * 10,
//   scale: Math.max(1, Math.random() * 10),
//   tint: "#" + Math.floor(Math.random() * 16777215).toString(16),
// });
//
const SpringSprite = () => {
  // const [props, setProps] = useState(set);
  //
  return (
    //     <Stage
    //       width={width}
    //       height={height}
    //       options={{ backgroundColor: 0x37425a, antialias: true }}
    //       onPointerUp={() => setProps(set)}
    //     >
    //       <Spring to={props}>
    //         {({ tint, ...props }) => (
    //           <Sprite
    //             anchor={0.5}
    //             width={100}
    //             height={100}
    //             texture={Texture.WHITE}
    //             tint={tint.to((color) => toHex(color))}
    //             {...props}
    //           />
    //         )}
    //       </Spring>
    //     </Stage>
    <></>
  );
};
//
export default SpringSprite;
