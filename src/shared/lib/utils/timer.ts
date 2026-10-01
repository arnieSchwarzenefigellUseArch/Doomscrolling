type TimerBase = {startedAt: number; cb: () => void; delay: number};
export type RunningTimer = TimerBase & {state: 'running'; timer: ReturnType<typeof setTimeout>};
export type PausedTimer = TimerBase & {state: 'paused'; pausedAt: number};
export type TimerState = RunningTimer | PausedTimer;

export class Timer {
  static create(cb: () => void, delay: number): RunningTimer {
    return {timer: setTimeout(cb, delay), startedAt: performance.now(), cb, delay, state: 'running'};
  }

  static pause(conf: RunningTimer): PausedTimer {
    clearTimeout(conf.timer);
    return {
      startedAt: conf.startedAt,
      cb: conf.cb,
      delay: conf.delay,
      state: 'paused',
      pausedAt: performance.now(),
    };
  }

  static resume(conf: PausedTimer): RunningTimer | undefined {
    const remaining = conf.delay - (conf.pausedAt - conf.startedAt);
    if (remaining <= 0) return;
    return {
      timer: setTimeout(conf.cb, remaining),
      startedAt: performance.now(),
      cb: conf.cb,
      delay: remaining,
      state: 'running',
    };
  }

  static destroy(conf: TimerState) {
    if (conf.state === 'running') clearTimeout(conf.timer);
  }
}