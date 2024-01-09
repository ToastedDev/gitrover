import { Command } from "commander";
import { getVersion } from "../utils/version.js";
import { authCommands as authCommand } from "./auth/index.js";

export const commandHandler = async () => {
  const program = new Command()
    .name("gitrover")
    .description("The better GitHub CLI we all needed")
    .version(getVersion(), "-v, --version", "Display the current version");

  program.addCommand(authCommand);

  program.parse(process.argv);
};
