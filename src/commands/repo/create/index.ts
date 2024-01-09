import chalk from "chalk";
import { getUserConfig } from "~/utils/user-config.js";
import { select } from "@inquirer/prompts";
import { Octokit } from "@octokit/rest";
import { createAndPushHandler } from "./push.js";
import { gitRepoHasOrigin, isGitRepository } from "~/utils/is-git.js";

export const createRepoHandler = async () => {
  const config = await getUserConfig();
  if (!config.accessToken) {
    console.log(
      chalk.red("x"),
      "You're not logged in.\nTo be able to start using gitrover, run `gr auth login`."
    );
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: config.accessToken,
  });

  if (isGitRepository() && gitRepoHasOrigin())
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
