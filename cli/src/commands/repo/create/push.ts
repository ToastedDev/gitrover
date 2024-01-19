import { confirm, input } from "@inquirer/prompts";
import type { Octokit } from "@octokit/rest";
import chalk from "chalk";
import {
  gitRepoHasOrigin,
  isGitRepository,
  remoteUrl,
  execGitCommandSync,
} from "~/utils/git.js";
import { error, success } from "~/utils/logger.js";
import { askForRepoInfo } from "./index.js";
import { handler } from "~/utils/command.js";

export const createAndPushHandler = handler(async (octokit: Octokit) => {
  // TODO: allow the user to select where the repo is if the current directory isn't a git repo
  if (!isGitRepository()) {
    error(
      "You are not in a git repository.\nInitialize a git repository with",
      chalk.bold("git init") + ".",
    );
    process.exit(1);
  }

  const { owner, name, visibility, inOrg } = (await askForRepoInfo(octokit))!;

  if (!inOrg) {
    await octokit.repos.createInOrg({
      org: owner,
      name,
      private: visibility === "private",
    });
  } else {
    await octokit.repos.createForAuthenticatedUser({
      org: owner,
      name,
      private: visibility === "private",
    });
  }

  success(`Created repository ${chalk.bold(`${owner}/${name}`)}.`);

  let remoteName = "origin";

  if (gitRepoHasOrigin()) {
    const shouldStillAddRemote = await confirm({
      message:
        "It seems you already have a remote called 'origin'. Do you still wanna create a remote?",
    });
    if (!shouldStillAddRemote) {
      error(
        "Cancelled creating a remote.\nIf you want to create the remote yourself, you can run",
        chalk.bold("git remote add") + ".",
      );
      process.exit(1);
    }

    remoteName = await input({
      message: "What do you want your remote to be called?",
      validate: (value) => {
        if (value === "origin") return "Cannot be 'origin'";
        return value;
      },
    });
  }

  execGitCommandSync([
    "remote",
    "add",
    remoteName,
    await remoteUrl(owner, name),
  ]);

  // TODO: check if repo has commits, and don't push if no commits
  execGitCommandSync(["push", "--set-upstream", remoteName, "HEAD"], {
    stdio: "ignore",
  });
  success(`Pushed commits to repository ${chalk.bold(`${owner}/${name}`)}.`);
});
