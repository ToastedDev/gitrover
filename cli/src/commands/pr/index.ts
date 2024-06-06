import { Command } from "commander";
import { createPrHandler } from "./create.js";

export const prCommand = new Command()
  .name("pr")
  .description("Manage pull requests for a GitHub repository.");
prCommand
  .command("create")
  .description("Create a pull request on a GitHub repository")
  .action(createPrHandler);
