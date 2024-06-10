import { confirm, input } from "@inquirer/prompts";
import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { handler } from "~/utils/command.js";
import {
  execGitCommandSync,
  getRepoFromOrigin,
  gitRepoHasOrigin,
  isGitRepository,
} from "~/utils/git.js";
import { error, success } from "~/utils/logger.js";
import { getUserConfig } from "~/utils/user-config.js";

export const createPrHandler = handler(async () => {
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

  let [repoOwner, repoName] = getRepoFromOrigin()!;
  const { data: repo } = await octokit.repos.get({
    owner: repoOwner,
    repo: repoName,
  });
  if (repo.fork) {
    repoOwner = repo.parent!.owner.login;
    repoName = repo.parent!.name;
  }

  const currentBranch = execGitCommandSync([
    "rev-parse",
    "--abbrev-ref",
    "HEAD",
  ])
    .toString()
    .trim();
  const { data: prs } = await octokit.pulls.list({
    owner: repoOwner,
    repo: repoName,
    head: currentBranch,
    state: "open",
  });
  if (prs.length > 0) {
    error(
      `A pull request already exists for branch ${chalk.bold(
        currentBranch,
      )}: ${chalk.bold(prs[0]!.html_url)}`,
    );
    process.exit(1);
  }

  const title = await input({
    message: "PR title",
  });
  const description = await input({
    message: "PR description",
  });
  const isDraft = await confirm({
    message: "Is this a draft pull request?",
    default: false,
  });

  const branches = execGitCommandSync([
    "branch",
    "-a",
    "--contains",
    currentBranch,
  ])
    .toString()
    .trim()
    .split("\n")
    .filter((branch) => branch.includes("remotes/origin/"));
  if (!branches.length) {
    execGitCommandSync(["push", "--set-upstream", "origin", currentBranch], {
      stdio: "ignore",
    });
    success("Pushed branch to remote origin.");
  }

  const { data: newPr } = await octokit.pulls.create({
    owner: repoOwner,
    repo: repoName,
    head: currentBranch,
    base: "main",
    title,
    body: description,
    draft: isDraft,
  });

  success(
    `Created pull request for branch ${chalk.bold(currentBranch)}: ${chalk.bold(
      newPr.html_url,
    )}`,
  );
});
