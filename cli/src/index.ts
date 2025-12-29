#!/usr/bin/env node

import { Effect, Layer, Logger } from "effect";
import { Command } from "@effect/cli";
import { NodeContext, NodeRuntime } from "@effect/platform-node";
import { BrowseCommand } from "./commands/browse.js";
import { GitClient } from "./services/git.js";
import { GithubClient } from "./services/github.js";
import { cliLogger } from "./utils/logger.js";

const MainCommand = Command.make("gitrover").pipe(
  Command.withSubcommands([BrowseCommand])
);

const cli = Command.run(MainCommand, {
  name: "gitrover",
  version: "0.1.0",
  executable: "gitrover",
});

const MainLayer = Layer.mergeAll(
  GitClient.Default,
  GithubClient.Default,
  NodeContext.layer
).pipe(Layer.provideMerge(Logger.replace(Logger.defaultLogger, cliLogger)));

cli(process.argv).pipe(
  Effect.tapErrorCause((cause) => Effect.logError(cause)),
  Effect.provide(MainLayer),
  NodeRuntime.runMain({
    disablePrettyLogger: true,
    disableErrorReporting: true,
  })
);
