import { GITHUB_CLIENT_ID } from "~/consts.js";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import {
  UserConfig,
  getUserConfig,
  setUserConfig,
} from "~/utils/user-config.js";
import chalk from "chalk";
import open from "open";
import { select } from "@inquirer/prompts";
import { getPublicKey, getPublicKeys, sshDirectory } from "~/utils/ssh.js";
import { Octokit } from "@octokit/rest";

// @ts-expect-error package doesn't have types (not even definetlytyped, I checked)
import keypress from "keypress";
import path from "path";

export const loginHandler = async () => {
  if ((await getUserConfig()).accessToken) {
    console.log(
      chalk.red("x"),
      "You're already logged in. You don't need to login again."
    );
    process.exit(1);
  }

  const scopes = ["repo", "read:org", "gist"];

  const protocol: UserConfig["protocol"] = await select({
    message: "What is your preferred protocol for Git operations?",
    choices: [
      {
        name: "HTTPS",
        value: "https",
      },
      {
        name: "SSH",
        value: "ssh",
      },
    ],
  });

  let sshKeyToUpload: string | undefined;

  if (protocol === "ssh") {
    const sshKeys = getPublicKeys();
    if (sshKeys.length) {
      const shouldUploadSshKey = await select({
        message: "Which SSH key do you want to upload to your account?",
        choices: [
          ...sshKeys.map((key) => ({
            name: path.join(sshDirectory, key),
            value: key,
          })),
          {
            name: "None",
            value: "none",
          },
        ],
      });
      if (shouldUploadSshKey !== "none") sshKeyToUpload = shouldUploadSshKey;
    } else {
      // TODO: create ssh key
    }
  }

  if (sshKeyToUpload) scopes.push("admin:public_key");

  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: GITHUB_CLIENT_ID,
    scopes,
    onVerification: (verification) => {
      console.log(
        chalk.yellow("!"),
        "Login code:",
        chalk.bold(verification.user_code)
      );
      if (process.stdout.isTTY) {
        console.log(`Press ${chalk.bold("Enter")} to verify in your browser.`);
        console.log(
          `Or go to ${chalk.bold(
            verification.verification_uri
          )} in your browser yourself.`
        );
        keypress(process.stdin);
        process.stdin.on("keypress", (ch, key) => {
          if (key) {
            if (key.ctrl && key.name == "c") {
              process.stdin.pause();
              process.exit();
            }
            if (key.name === "return") {
              open(verification.verification_uri);
            }
          }
        });
        process.stdin.setRawMode(true);
        process.stdin.resume();
      } else {
        console.log(
          `Go to ${chalk.bold(
            verification.verification_uri
          )} and enter the code shown above.`
        );
      }
    },
  });

  const { token } = await auth({
    type: "oauth",
  });
  await setUserConfig({ accessToken: token, protocol });

  const octokit = new Octokit({
    auth: token,
  });
  const { data: currentUser } = await octokit.rest.users.getAuthenticated();

  console.log(chalk.green("✓"), "Logged in as", currentUser.login + ".");

  if (sshKeyToUpload) {
    const sshKey = getPublicKey(sshKeyToUpload);
    const splitKey = sshKey.split(" ");
    const keyToCompare = `${splitKey[0]} ${splitKey[1]}`;

    const { data: sshKeys } =
      await octokit.users.listPublicSshKeysForAuthenticatedUser({
        per_page: 100,
      });
    if (sshKeys.find((key) => key.key === keyToCompare)) {
      console.log(
        chalk.red("x"),
        "SSH key",
        chalk.bold(path.join(sshDirectory, sshKeyToUpload)),
        "already exists on your GitHub account."
      );
    } else {
      octokit.users.createPublicSshKeyForAuthenticatedUser({
        title: "GitRover CLI",
        key: sshKey,
      });
      console.log(
        chalk.green("✓"),
        "SSH key",
        chalk.bold(path.join(sshDirectory, sshKeyToUpload)),
        "uploaded to your GitHub account."
      );
    }
  }

  process.exit();
};
