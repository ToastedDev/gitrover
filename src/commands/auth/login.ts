import { GITHUB_CLIENT_ID } from "~/consts.js";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { setUserConfig } from "~/utils/user-config.js";
import chalk from "chalk";
import open from "open";
import keypress from "keypress";

export const loginHandler = async () => {
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: GITHUB_CLIENT_ID,
    scopes: ["repo", "read:org", "gist"],
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
  await setUserConfig({ accessToken: token });

  console.log(chalk.green("✓"), "You're all set!");
  process.exit();
};
