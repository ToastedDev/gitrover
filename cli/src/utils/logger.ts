import chalk from "chalk";

export const success = (...args: string[]) =>
  console.log(chalk.green("✓"), ...args);

export const error = (...args: string[]) =>
  console.error(chalk.red("x"), ...args);

export const warn = (...args: string[]) =>
  console.warn(chalk.yellow("!"), ...args);

export const important = (...args: string[]) =>
  console.warn(chalk.yellow("!"), ...args);
