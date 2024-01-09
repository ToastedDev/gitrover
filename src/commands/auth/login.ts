import { GITHUB_CLIENT_ID } from "~/consts.js";
import { createOAuthDeviceAuth } from "@octokit/auth-oauth-device";
import { setUserConfig } from "~/utils/user-config.js";
import chalk from "chalk";

export const loginHandler = async () => {
  const auth = createOAuthDeviceAuth({
    clientType: "oauth-app",
    clientId: GITHUB_CLIENT_ID,
    scopes: ["repo", "repo:org", "gist"],
    onVerification: (verification) => {
      console.log("Login code:", verification.user_code);
      console.log(
        `Go to ${verification.verification_uri} and enter the code shown above.`
      );
    },
  });

  const { token } = await auth({
    type: "oauth",
  });
  await setUserConfig({ accessToken: token });

  console.log(chalk.green("✓"), "You're all set!");
  process.exit();
};
