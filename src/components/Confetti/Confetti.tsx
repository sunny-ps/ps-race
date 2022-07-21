import React, { CSSProperties, useCallback, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { CreateTypes } from "canvas-confetti";
import shallow from "zustand/shallow";

import { useInterval } from "@hooks";
import { useConfettiStore } from "src/store";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
} as CSSProperties;

function getAnimationSettings(originXA: number, originXB: number) {
  return {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    particleCount: 150,
    origin: {
      x: randomInRange(originXA, originXB),
      y: Math.random() - 0.2,
    },
  };
}

const Confetti = () => {
  const refAnimationInstance = useRef<CreateTypes | null>(null);

  const { confettiIsRunning, resetConfetti } = useConfettiStore(
    (state) => ({
      confettiIsRunning: state.confettiIsRunning,
      resetConfetti: state.resetConfetti,
    }),
    shallow
  );

  // ref instance of canvas-confetti
  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  useInterval(nextTickAnimation, confettiIsRunning ? 450 : null);

  useInterval(
    () => {
      resetConfetti();
    },
    confettiIsRunning ? 5500 : null
  );

  return (
    <>
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
    </>
  );
};

export default Confetti;
