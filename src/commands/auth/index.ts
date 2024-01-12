import { Command } from "commander";
import { loginHandler } from "./login.js";
import { logoutHandler } from "./logout.js";

export const authCommand = new Command()
  .name("auth")
  .description("Authenticate GitHub for use with GitRover.");
authCommand
  .command("login")
  .description("Login to GitHub for use with GitRover.")
  .action(loginHandler);
authCommand
  .command("logout")
  .description("Logout of GitHub for GitRover.")
  .action(logoutHandler);
