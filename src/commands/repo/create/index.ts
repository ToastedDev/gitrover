import { getUserConfig } from "~/utils/user-config.js";
import { select } from "@inquirer/prompts";
import { Octokit } from "@octokit/rest";
import { createAndPushHandler } from "./push.js";
import { gitRepoHasOrigin, isGitRepository } from "~/utils/git.js";
import { error } from "~/utils/logger.js";
import chalk from "chalk";

export const createRepoHandler = async () => {
  // fix for dumb inquirer behaviours
  process.on("exit", () => process.exit());

  const config = await getUserConfig();
  if (!config.accessToken) {
    error(
      "You're not logged in.\nTo login, run",
      chalk.bold("gr auth login") + "."
    );
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: config.accessToken,
  });

  if (isGitRepository() && !gitRepoHasOrigin())
    return createAndPushHandler(octokit);

  const action = await select({
    message: "What would you like to do?",
    choices: [
      // TODO
      // {
      //   name: "Create a new repository from scratch",
      //   value: "create-scratch",
      // },
      // TODO
      // {
      //   name: "Create a new repository from a template",
      //   value: "create-template"
      // }
      {
        name: "Create and push an existing local repository",
        value: "create-and-push",
      },
    ],
    default: "create-and-push",
  });

  switch (action) {
    case "create-and-push":
      {
        createAndPushHandler(octokit);
      }
      break;
  }
};
