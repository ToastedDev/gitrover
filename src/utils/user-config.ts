import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync as exists } from "fs";
import path from "path";
import envPaths from "env-paths";

const paths = envPaths("gitrover", { suffix: "" });
const configPath = path.join(paths.config, "user-config");

interface UserConfig {
  accessToken?: string;
}

export const getUserConfig = async (): Promise<UserConfig> => {
  if (!exists(paths.config)) await mkdir(paths.config, { recursive: true });
  if (!exists(configPath)) await writeFile(configPath, "{}");
  return JSON.parse(await readFile(configPath, "utf8"));
};

export const setUserConfig = async (config: UserConfig) => {
  if (!exists(paths.config)) await mkdir(paths.config, { recursive: true });
  return await writeFile(configPath, JSON.stringify(config, null, 2));
};
