import { Command } from "commander";
import { getVersion } from "../utils/version.js";
import { authCommand } from "./auth/index.js";
import { repoCommand } from "./repo/index.js";
import { browseCommand } from "./browse.js";

export const commandHandler = async () => {
  const program = new Command()
    .name("gr")
    .description("The better GitHub CLI we all needed")
    .version(getVersion(), "-v, --version", "Display the current version");

  program.addCommand(authCommand);
  program.addCommand(repoCommand);
  program.addCommand(browseCommand);

  program.parse(process.argv);
};
