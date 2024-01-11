import { Octokit } from "@octokit/rest";
import { execGitCommandSync, remoteUrl } from "~/utils/git.js";
import { getUserConfig } from "~/utils/user-config.js";
import { RequestError } from "@octokit/request-error";
import chalk from "chalk";
import { error } from "~/utils/logger.js";

export const cloneRepoHandler = async (
  source: string,
  destination: string | undefined
) => {
  const config = await getUserConfig();

  const splitSource = source.split("/");
  let owner = splitSource[0]!;
  const name = splitSource[1] ?? splitSource[0]!;

  const octokit = new Octokit({
    auth: config.accessToken,
  });
  if (!splitSource[1] && config.accessToken) {
    const { data: currentUser } = await octokit.users.getAuthenticated();
    owner = currentUser.login;
  }

  try {
    await octokit.rest.repos.get({
      owner,
      repo: name,
    });
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) {
      error(`Repository ${owner}/${name} does not exist.`);
      process.exit(1);
    }
    console.error(err);
    process.exit(1);
  }

  const url = await remoteUrl(owner, name);
  execGitCommandSync(["clone", url, destination].filter(Boolean), {
    stdio: "inherit",
  });
};
