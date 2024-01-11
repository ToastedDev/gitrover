import { execSync } from "child_process";
import { warn } from "./logger.js";
import https from "https";
import { getVersion } from "./version.js";
import chalk from "chalk";

export const renderVersionWarning = (npmVersion: string) => {
  const currentVersion = getVersion();

  if (currentVersion !== npmVersion) {
    warn("You are using an outdated version of gitrover.");
    console.log(
      "Your version:",
      chalk.bold(currentVersion) + " -",
      "Latest version:",
      chalk.bold(npmVersion)
    );
    console.log(
      "Please run",
      chalk.bold("npm install -g gitrover@latest"),
      "to get the latest updates."
    );
    console.log("");
  }
};

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 * https://github.com/facebook/create-react-app/blob/main/packages/create-react-app/LICENSE
 */
interface DistTagsBody {
  latest: string;
}

function checkForLatestVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get("https://registry.npmjs.org/-/package/gitrover/dist-tags", (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => (body += data));
          res.on("end", () => {
            resolve((JSON.parse(body) as DistTagsBody).latest);
          });
        } else {
          reject();
        }
      })
      .on("error", () => {
        // logger.error("Unable to check for latest version.");
        reject();
      });
  });
}

export const getNpmVersion = () =>
  // `fetch` to the registry is faster than `npm view` so we try that first
  checkForLatestVersion().catch(() => {
    try {
      return execSync("npm view gitrover version").toString().trim();
    } catch {
      return null;
    }
  });
