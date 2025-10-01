import type { Dispatch, SetStateAction } from 'react';
import { useEffect } from 'react';
import { COUNT_SECOND, STATE_ACTIVE, STATE_COMPLETE } from '@/App';

const useCountdown = (
  setTimerCount: Dispatch<SetStateAction<number>>,
  timerState: number,
  setTimerState: Dispatch<SetStateAction<number>>,
) => {
  useEffect(() => {
    if (timerState !== STATE_ACTIVE) return;

    const countdown = setInterval(() => {
      setTimerCount((prev: number) => {
        if (prev > 0) {
          return prev - COUNT_SECOND;
        } else {
          clearInterval(countdown);
          setTimerState(STATE_COMPLETE);
          return prev;
        }
      });
    }, COUNT_SECOND * 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [setTimerCount, timerState, setTimerState]);
};

export { useCountdown };
