import { useEffect } from 'react';
import type { Settings } from '@/App';
import { COUNT_MINUTE } from '@/App';

const useSettings = (
  settings: Settings,
  setTimerCount: (count: number) => void,
) => {
  useEffect(() => {
    if (settings.limit && settings.limit > 0) {
      setTimerCount(settings.limit * COUNT_MINUTE);
    }
  }, [settings, setTimerCount]);
};

export { useSettings };
