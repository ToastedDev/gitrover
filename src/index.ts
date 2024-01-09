import "isomorphic-unfetch";
import { commandHandler } from "./commands/index.js";

const main = async () => {
  commandHandler();
};

main();
