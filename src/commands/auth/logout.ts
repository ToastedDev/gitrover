import { Octokit } from "@octokit/rest";
import chalk from "chalk";
import { error, success } from "~/utils/logger.js";
import { getUserConfig, setUserConfig } from "~/utils/user-config.js";

export const logoutHandler = async () => {
  const config = await getUserConfig();
  if (!config.accessToken) {
    error(
      "You're not logged in.\nTo login, run",
      chalk.bold("gr auth login") + "."
    );
    process.exit(1);
  }

  let username: string | undefined = undefined;
  try {
    const octokit = new Octokit({
      auth: config.accessToken,
    });
    const { data } = await octokit.rest.users.getAuthenticated();
    username = data.login;
  } catch {}
  await setUserConfig({ accessToken: undefined });
  success(username ? `Logged out of ${username}.` : "Logged out.");
};
