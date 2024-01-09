import { Command } from "commander";
import { getVersion } from "../utils/version.js";
import { authCommands as authCommand } from "./auth/index.js";
import { repoCommand } from "./repo/index.js";

export const commandHandler = async () => {
  const program = new Command()
    .name("gitrover")
    .description("The better GitHub CLI we all needed")
    .version(getVersion(), "-v, --version", "Display the current version");

  program.addCommand(authCommand);
  program.addCommand(repoCommand);

  program.parse(process.argv);
};
