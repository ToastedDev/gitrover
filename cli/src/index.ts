#!/usr/bin/env node

import "isomorphic-unfetch";
import { commandHandler } from "./commands/index.js";
import {
  getNpmVersion,
  renderVersionWarning,
} from "./utils/version-warning.js";

const main = async () => {
  const npmVersion = await getNpmVersion();
  if (npmVersion) renderVersionWarning(npmVersion);

  commandHandler();
};

main();
