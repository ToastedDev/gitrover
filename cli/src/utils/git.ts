import type { ExecSyncOptions } from "child_process";
import { exec, execSync } from "child_process";
import { existsSync } from "fs";
import { getUserConfig } from "./user-config.js";
import { join } from "path";

export const execGitCommandSync = (args: string[], options?: ExecSyncOptions) =>
  execSync("git " + args.join(" "), options);

export const execGitCommand = (
  args: string[],
  callback?: Parameters<typeof exec>[1],
) => exec("git " + args.join(" "), callback);

export const isGitRepository = (cwd?: string) =>
  existsSync(join(cwd ?? ".", ".git"));

export const gitRepoHasOrigin = (cwd?: string) =>
  execGitCommandSync(["remote", "show"], { encoding: "utf8", cwd }).length !==
  0;

export function gitRepoHasCommits(cwd?: string) {
  try {
    return (
      execGitCommandSync(["rev-list", "--count", "HEAD"], {
        encoding: "utf8",
        cwd,
      })
        .toString()
        .trim() !== "0"
    );
  } catch (err) {
    return false;
  }
}

export const remoteUrl = async (repoOwner: string, repoName: string) => {
  const config = await getUserConfig();
  if (config.protocol === "ssh")
    return `git@github.com:${repoOwner}/${repoName}.git`;
  else return `https://github.com/${repoOwner}/${repoName}.git`;
};

export const getOriginUrl = () => {
  if (!gitRepoHasOrigin()) return undefined;
  return execGitCommandSync(["remote", "get-url", "origin"]).toString();
};

export const getRepoFromOrigin = () => {
  if (!gitRepoHasOrigin()) return undefined;

  const originUrl = getOriginUrl()!;
  const urlMatch = originUrl
    .trim()
    .replace(".git", "")
    .match(
      /((?<=git@github.com:)(.*)\/(.*)|(?<=https?:\/\/github.com\/)(.*)\/(.*))/,
    )?.[0];
  return urlMatch ? (urlMatch.split("/") as [string, string]) : undefined;
};

export const convertOriginUrlToGitHubUrl = () => {
  if (!gitRepoHasOrigin()) return undefined;

  const originUrl = getOriginUrl()!;
  const urlMatch = originUrl
    .trim()
    .replace(".git", "")
    .match(
      /((?<=git@github.com:)(.*)\/(.*)|(?<=https?:\/\/github.com\/)(.*)\/(.*))/,
    )?.[0];

  return urlMatch ? `https://github.com/${urlMatch}` : undefined;
};
