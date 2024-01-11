import { ExecSyncOptions, exec, execSync } from "child_process";
import { existsSync } from "fs";
import { getUserConfig } from "./user-config.js";

export const execGitCommandSync = (args: string[], options?: ExecSyncOptions) =>
  execSync("git " + args.join(" "), options);

export const execGitCommand = (
  args: string[],
  callback?: Parameters<typeof exec>[1]
) => exec("git " + args.join(" "), callback);

export const isGitRepository = () => existsSync(".git");
export const gitRepoHasOrigin = () =>
  execGitCommandSync(["remote", "show"], { encoding: "utf8" }).length !== 0;

export const remoteUrl = async (repoOwner: string, repoName: string) => {
  const config = await getUserConfig();
  if (config.protocol === "ssh")
    return `git@github.com:${repoOwner}/${repoName}.git`;
  else return `https://github.com/${repoOwner}/${repoName}.git`;
};