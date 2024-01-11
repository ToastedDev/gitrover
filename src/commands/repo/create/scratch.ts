import { Octokit } from "@octokit/rest";
import { askForRepoInfo } from "./index.js";
import chalk from "chalk";
import { success } from "~/utils/logger.js";
import { confirm } from "@inquirer/prompts";
import { execGitCommandSync, remoteUrl } from "~/utils/git.js";

export const createFromScratchHandler = async (octokit: Octokit) => {
  const { owner, name, visibility, inOrg } = await askForRepoInfo(octokit);

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

  const shouldCloneRepository = await confirm({
    message: "Clone the new repository locally?",
  });
  if (shouldCloneRepository) {
    const url = await remoteUrl(owner, name);
    execGitCommandSync(["clone", url]);
    success(`Cloned repository ${chalk.bold(`${owner}/${name}`)} locally.`);
  }
};
