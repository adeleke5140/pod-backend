export type Command = {
  name: string;
  description: string;
  run: (arg: string[]) => Promise<void>;
};
