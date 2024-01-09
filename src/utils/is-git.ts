import { execSync } from "child_process";
import { existsSync } from "fs";

export const isGitRepository = () => existsSync(".git");
export const gitRepoHasOrigin = () =>
  execSync("git remote show", { encoding: "utf8" }).length !== 0;
