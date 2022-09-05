import { useState } from "react";
import shallow from "zustand/shallow";

import { useRacingStore } from "src/store";
import { useInterval } from "@hooks";

const Counter = () => {
  const [counter, setCounter] = useState(4);

  const { isPaused, setIsPaused, startRacing } = useRacingStore(
    (state) => ({
      isPaused: state.isPaused,
      setIsPaused: state.setIsPaused,
      startRacing: state.startRacing,
    }),
    shallow
  );

  useInterval(
    () => {
      counter > 0 && setCounter((prevState) => (prevState -= 1));

      if (counter < 1) {
        setIsPaused(false);
        startRacing();
      }
    },
    isPaused ? 1000 : null
  );

  return (
    <>
      {counter < 4 && counter > 0 && (
        <div className="h-screen w-screen grid place-items-center fixed">
          <span className="font-[VT323] text-9xl text-white font-bold">
            {counter}
          </span>
        </div>
      )}
    </>
  );
};

export default Counter;
