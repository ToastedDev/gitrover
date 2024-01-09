import "isomorphic-unfetch";

import { intro, outro, text } from "@clack/prompts";
import { commandHandler } from "./commands";

const main = async () => {
  commandHandler();
};

main();
