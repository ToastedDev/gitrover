import type { Separator } from "@inquirer/prompts";
import { select as inquirerSelect } from "@inquirer/prompts";

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  disabled?: boolean | string;
  type?: never;
};

/**
 * Better select that handles exiting better than just throwing an error.
 */
export const select = async <Value>(config: {
  message: string | Promise<string> | (() => Promise<string>);
  choices: readonly (Separator | Choice<Value>)[];
  pageSize?: number | undefined;
  loop?: boolean | undefined;
  default?: Value | undefined;
}) => {
  try {
    return await inquirerSelect(config);
  } catch (err) {
    if (err instanceof Error && err.message.includes("User force closed"))
      process.exit();
    throw err;
  }
};
