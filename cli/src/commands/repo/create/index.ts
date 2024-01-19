import { getUserConfig } from "~/utils/user-config.js";
import { input, select } from "@inquirer/prompts";
import { Octokit } from "@octokit/rest";
import { createAndPushHandler } from "./push.js";
import { gitRepoHasOrigin, isGitRepository } from "~/utils/git.js";
import { error } from "~/utils/logger.js";
import chalk from "chalk";
import { createFromScratchHandler } from "./scratch.js";
import path from "path";
import { handleInquirerErrors, handler } from "~/utils/command.js";

export const createRepoHandler = handler(
  async (flags: { scratch: boolean; push: boolean }) => {
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

    if (flags.scratch) return createFromScratchHandler(octokit);
    if ((isGitRepository() && !gitRepoHasOrigin()) || flags.push)
      return createAndPushHandler(octokit);

    const action = await select({
      message: "What would you like to do?",
      choices: [
        {
          name: "Create a new repository from scratch",
          value: "create-scratch",
        },
        {
          name: "Create and push an existing local repository",
          value: "create-and-push",
        },
      ],
    });

    switch (action) {
      case "create-scratch":
        {
          createFromScratchHandler(octokit);
        }
        break;
      case "create-and-push":
        {
          createAndPushHandler(octokit);
        }
        break;
    }
  },
);

export const askForRepoInfo = async (octokit: Octokit) => {
  try {
    const parsedCwd = path.resolve(process.cwd());
    const name = await input({
      message: "Repository name",
      default: path.basename(parsedCwd),
    });

    const { data: currentUser } = await octokit.users.getAuthenticated();
    const { data: orgs } = await octokit.orgs.listForAuthenticatedUser();

    let owner: string | undefined;
    if (orgs.length > 1) {
      owner = await select({
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
      owner = currentUser.login;
    }

    const visibility = await select({
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

    return {
      owner,
      name,
      visibility,
      inOrg: owner === currentUser.login,
    };
  } catch (err) {
    handleInquirerErrors(err);
  }
};
