import { Command } from "commander";
import { createRepoHandler } from "./create/index.js";

export const repoCommand = new Command().name("repo");
repoCommand
  .command("create")
  .description("Create a repository on GitHub.")
  .action(createRepoHandler);
