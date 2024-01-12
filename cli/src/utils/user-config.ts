import { mkdir, readFile, writeFile } from "fs/promises";
import { existsSync as exists } from "fs";
import path from "path";
import envPaths from "env-paths";

const paths = envPaths("gitrover", { suffix: "" });
const configPath = path.join(paths.config, "user-config");

export interface UserConfig {
  accessToken?: string;
  protocol: "https" | "ssh";
}

const defaultConfig: UserConfig = {
  protocol: "https",
};

export const getUserConfig = async (): Promise<UserConfig> => {
  if (!exists(paths.config)) await mkdir(paths.config, { recursive: true });
  if (!exists(configPath)) await writeFile(configPath, "{}");
  return Object.assign(
    defaultConfig,
    JSON.parse(await readFile(configPath, "utf8")),
  );
};

export const setUserConfig = async (config: Partial<UserConfig>) => {
  if (!exists(paths.config)) await mkdir(paths.config, { recursive: true });

  const oldConfig = await getUserConfig();
  const newConfig = Object.assign(oldConfig, config);
  return await writeFile(configPath, JSON.stringify(newConfig, null, 2));
};
