import {
  ArrowPathIcon,
  Cog8ToothIcon,
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCountdown } from '@/components/useCountdown';
import { useSettings } from '@/components/useSettings';
import { cn } from '@/lib/utils';

export const COUNT_SECOND = 1;
export const COUNT_MINUTE = COUNT_SECOND * 60;
export const COUNT_HOUR = COUNT_MINUTE * 60;

export const STATE_COMPLETE = 0;
export const STATE_PAUSE = 1;
export const STATE_ACTIVE = 2;

export interface Settings {
  limit: number;
  alert: number[];
}

function App() {
  const [timerCount, setTimerCount] = useState<number>(0);
  const [settings, setSettings] = useState<Settings>({ limit: 10, alert: [3] });
  const [timerState, setTimerState] = useState(STATE_COMPLETE);

  useCountdown(setTimerCount, timerState, setTimerState);
  useSettings(settings, setTimerCount);

  const toggleState = () => {
    if (timerState === STATE_ACTIVE) {
      setTimerState(STATE_PAUSE);
    } else {
      setTimerState(STATE_ACTIVE);
      setSettings({
        ...settings,
        alert: settings.alert?.toSorted((a, b) => a - b),
      });
    }
  };

  const reset = () => {
    setTimerState(STATE_COMPLETE);
    setTimerCount(settings.limit * COUNT_MINUTE);
  };

  const formatTime = (milliseconds: number) => {
    const mm = Math.floor((milliseconds % COUNT_HOUR) / COUNT_MINUTE);
    const ss = Math.floor((milliseconds % COUNT_MINUTE) / COUNT_SECOND);

    return [mm, ss].map((val) => String(val).padStart(2, '0')).join(':');
  };

  return (
    <div
      className={cn(
        'relative grid min-h-svh place-content-center place-items-center gap-4 bg-lime-400',
        settings.alert.length > 2 &&
          settings.alert[2] > 0 &&
          timerCount < settings.alert[2] * COUNT_MINUTE &&
          'bg-yellow-400',
        settings.alert.length > 1 &&
          settings.alert[1] > 0 &&
          timerCount < settings.alert[1] * COUNT_MINUTE &&
          'bg-orange-400',
        settings.alert.length > 0 &&
          settings.alert[0] > 0 &&
          timerCount < settings.alert[0] * COUNT_MINUTE &&
          'bg-red-400',
      )}
    >
      <span className="font-black text-[40vw] leading-none">
        {formatTime(timerCount)}
      </span>
      <div className="flex items-center justify-center gap-2">
        <Button size="lg" onClick={toggleState}>
          {timerState === STATE_ACTIVE ? (
            <>
              <PauseIcon />
              中断
            </>
          ) : (
            <>
              <PlayIcon />
              開始
            </>
          )}
        </Button>
        <Button size="lg" onClick={reset}>
          <ArrowPathIcon />
          リセット
        </Button>
      </div>
      <Drawer direction="top">
        <DrawerTrigger className="absolute top-2 right-2 size-12 p-2">
          <Cog8ToothIcon />
        </DrawerTrigger>
        <DrawerContent className="py-10">
          <DrawerHeader className="py-0">
            <DrawerTitle>設定</DrawerTitle>
          </DrawerHeader>
          <div className="mt-4 grid grid-cols-[fit-content(10rem)_auto_auto_auto_auto] place-content-center place-items-center gap-x-3 gap-y-2 text-xl">
            <div className="col-span-5 grid grid-cols-subgrid items-center">
              <Label htmlFor="limit" className="col-span-2">
                時間
              </Label>
              <Input
                id="limit"
                inputMode="numeric"
                value={settings.limit}
                className="w-[3em]"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    limit: Number(event.currentTarget.value),
                  })
                }
                readOnly={timerState > STATE_COMPLETE}
              />
              <span>分</span>
            </div>
            <div className="col-span-5 grid grid-cols-subgrid items-center">
              <Label>アラート</Label>
              <Button
                onClick={() => {
                  const alert = [...settings.alert];
                  alert[alert.length] = 0;
                  setSettings({ ...settings, alert });
                }}
                className={cn(settings.alert.length > 2 && 'opacity-0')}
              >
                <PlusIcon />
              </Button>
              {settings.alert?.map((value, i) => {
                return (
                  <div
                    className={cn(
                      'col-span-3 col-start-3 grid grid-cols-subgrid items-center gap-1',
                      i === 0 && settings.alert.length === 2 && 'row-start-2',
                      i === 0 && settings.alert.length === 3 && 'row-start-3',
                      i === 1 && settings.alert.length === 3 && 'row-start-2',
                    )}
                    key={i}
                  >
                    <Input
                      inputMode="numeric"
                      value={value}
                      className="w-[3em]"
                      onChange={(event) => {
                        const alert = [...settings.alert];
                        alert[i] = Number(event.currentTarget.value);
                        setSettings({ ...settings, alert });
                      }}
                      readOnly={timerState > STATE_COMPLETE}
                    />
                    <span>分前</span>
                    <Button
                      onClick={() => {
                        setSettings({
                          ...settings,
                          alert: settings.alert?.filter((_, j) => j !== i),
                        });
                      }}
                      className={cn(settings.alert.length === 1 && 'opacity-0')}
                    >
                      <MinusIcon />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default App;
