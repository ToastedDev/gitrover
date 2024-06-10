import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { error } from "console";
import {
  execGitCommandSync,
  getRepoFromOrigin,
  gitRepoHasOrigin,
  isGitRepository,
} from "~/utils/git.js";
import { getUserConfig } from "~/utils/user-config.js";

export const checkoutPrHandler = async (prNumber: number) => {
  if (!isGitRepository()) {
    error("You must be in a git repository to create a pull request.");
    process.exit(1);
  }

  if (!gitRepoHasOrigin()) {
    error("You must have a remote origin to create a pull request.");
    process.exit(1);
  }

  const config = await getUserConfig();
  if (!config.accessToken) {
    error(
      "You're not logged in.\nTo login, run",
      chalk.bold("gr auth login") + ".",
    );
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: config.accessToken,
  });

  const [repoOwner, repoName] = getRepoFromOrigin()!;

  const { data: pr } = await octokit.pulls.get({
    owner: repoOwner,
    repo: repoName,
    pull_number: prNumber,
  });
  if (pr.head.repo!.fork) {
    execGitCommandSync([
      "remote",
      "add",
      `pr/${pr.number}`,
      pr.head.repo!.clone_url,
    ]);
    execGitCommandSync(["fetch", `pr/${pr.number}`]);
    execGitCommandSync(["checkout", `pr/${pr.number}/${pr.head.ref}`]);
  } else {
    execGitCommandSync(["fetch", "origin"]);
    execGitCommandSync(["checkout", pr.head.ref]);
  }
};
