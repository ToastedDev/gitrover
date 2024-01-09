import { Command } from "commander";
import { loginHandler } from "./login.js";

export const authCommands = new Command().name("auth");
authCommands
  .command("login")
  .description("Authenticate with a GitHub host.")
  .action(loginHandler);
