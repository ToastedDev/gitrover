import { confirm, input, select } from "@inquirer/prompts";
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
  let cwd = undefined;

  if (!isGitRepository()) {
    const option = await select({
      message:
        "The current directory is not a git repository. What do you want to do?",
      choices: [
        { name: "Select my own directory", value: "select" },
        { name: "Initialize a new git repository", value: "init" },
        { name: "Exit", value: "exit" },
      ],
    });
    switch (option) {
      case "select":
        {
          const directory = await input({
            message: "What directory is your repository located in?",
            validate: (value) => {
              if (value === "/" || value === ".")
                return "Cannot be the current directory";
              return value;
            },
          });

          if (!isGitRepository(directory)) {
            error(
              "The repository you specified is not a git repository.\nInitialize a git repository with",
              chalk.bold("git init") + ".",
            );
            process.exit(1);
          }

          cwd = directory;
        }
        break;
      case "init":
        {
          execGitCommandSync(["init"], { stdio: "ignore" });
          success("Initialized a new git repository.");
        }
        break;
      case "exit": {
        error(
          "You are not in a git repository.\nInitialize a git repository with",
          chalk.bold("git init") + ".",
        );
        process.exit(1);
      }
    }
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

  execGitCommandSync(
    ["remote", "add", remoteName, await remoteUrl(owner, name)],
    { cwd },
  );

  // TODO: check if repo has commits, and don't push if no commits
  execGitCommandSync(["push", "--set-upstream", remoteName, "HEAD"], {
    stdio: "ignore",
    cwd,
  });
  success(`Pushed commits to repository ${chalk.bold(`${owner}/${name}`)}.`);
});
