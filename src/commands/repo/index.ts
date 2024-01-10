import { Command } from "commander";
import { createRepoHandler } from "./create/index.js";

export const repoCommand = new Command()
  .name("repo")
  .description("Manage your GitHub repository.");
repoCommand
  .command("create")
  .description("Create a repository on GitHub.")
  .action(createRepoHandler);
