import { confirm, input, select } from "@inquirer/prompts";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import path from "path";
import {
  gitRepoHasOrigin,
  isGitRepository,
  remoteUrl,
  execGitCommandSync,
  execGitCommand,
} from "~/utils/git.js";

export const createAndPushHandler = async (octokit: Octokit) => {
  // fix for dumb inquirer behaviours
  process.on("exit", () => process.exit());

  // TODO: allow the user to select where the repo is if the current directory isn't a git repo
  if (!isGitRepository()) {
    console.log(
      chalk.red("x"),
      "You are not in a git repository.\nInitialize a git repository with `git init`."
    );
    process.exit(1);
  }

  const parsedCwd = path.resolve(process.cwd());
  const repoName = await input({
    message: "Repository name",
    default: path.basename(parsedCwd),
  });

  const { data: currentUser } = await octokit.users.getAuthenticated();
  const { data: orgs } = await octokit.orgs.listForAuthenticatedUser();

  let repoOwner: string | undefined;
  if (orgs.length > 1) {
    repoOwner = await select({
      message: "Repository owner",
      default: currentUser.login,
      choices: [
        {
          name: currentUser.login,
          value: currentUser.login,
        },
        ...orgs
          .sort((a, b) => a.login.localeCompare(b.login))
          .map((org) => ({
            name: org.login,
            value: org.login,
          })),
      ],
    });
  } else {
    repoOwner = currentUser.login;
  }

  const repoVisibility = await select({
    message: "Visibility",
    default: "public",
    choices: [
      {
        name: "Public",
        value: "public",
      },
      {
        name: "Private",
        value: "private",
      },
      // TODO: I have no idea what this does but we should probably implement it at some point
      // {
      //   name: "Internal",
      //   value: "internal",
      // },
    ],
  });

  if (repoOwner !== currentUser.login) {
    await octokit.repos.createInOrg({
      org: repoOwner,
      name: repoName,
      private: repoVisibility === "private",
    });
  } else {
    await octokit.repos.createForAuthenticatedUser({
      org: repoOwner,
      name: repoName,
      private: repoVisibility === "private",
    });
  }

  console.log(chalk.green("✓"), `Created repository ${repoOwner}/${repoName}.`);

  let remoteName = "origin";

  if (gitRepoHasOrigin()) {
    const shouldStillAddRemote = await confirm({
      message:
        "It seems you already have a remote called 'origin'. Do you still wanna create a remote?",
    });
    if (!shouldStillAddRemote) {
      console.log(
        chalk.red("x"),
        "Cancelled creating a remote.\nIf you want to create the remote yourself, you can run `git remote add`."
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
    await remoteUrl(repoOwner, repoName),
  ]);

  // TODO: check if repo has commits, and don't push if no commits
  execGitCommandSync(["push", "--set-upstream", remoteName, "HEAD"], {
    stdio: "ignore",
  });
  console.log(
    chalk.green("✓"),
    `Pushed commits to repository ${repoOwner}/${repoName}.`
  );
};
