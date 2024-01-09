import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { getUserConfig, setUserConfig } from "~/utils/user-config.js";

export const logoutHandler = async () => {
  const config = await getUserConfig();
  if (!config.accessToken) {
    console.log(chalk.red("x"), "You're not logged in.");
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: config.accessToken,
  });
  const { data } = await octokit.rest.users.getAuthenticated();

  setUserConfig({});
  console.log(chalk.green("✓"), "Logged out of", data.login + ".");
};
