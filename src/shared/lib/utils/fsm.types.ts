export type FsmState<State extends string, Event extends string> = {
  initial: NoInfer<State>;
  transitions: Record<State, Partial<Record<Uppercase<Event>, State>>>;
  handlers: Record<State, () => void>;
  persistKey?: string;
};
