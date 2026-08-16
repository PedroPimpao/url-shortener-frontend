export type ActionState<T = undefined> = {
  error?: string;
  message?: string;
  data?: T;
};

export const initialActionState: ActionState = {};
