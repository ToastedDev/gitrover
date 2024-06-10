import { Command } from "commander";
import { createPrHandler } from "./create.js";
import { checkoutPrHandler } from "./checkout.js";

export const prCommand = new Command()
  .name("pr")
  .description("Manage pull requests for a GitHub repository.");
prCommand
  .command("create")
  .description("Create a pull request on a GitHub repository")
  .action(createPrHandler);
prCommand
  .command("checkout")
  .alias("co")
  .description("Checkout a pull request from a GitHub repository")
  .argument("<number>", "Pull request number")
  .action(checkoutPrHandler);
