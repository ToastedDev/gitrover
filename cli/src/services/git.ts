import { NodeContext } from "@effect/platform-node";
import { Data, Effect } from "effect";
import { Command, CommandExecutor } from "@effect/platform";

export class NoOriginError extends Data.TaggedError("NoOriginError") {}

export class GitClient extends Effect.Service<GitClient>()(
  "@gitrover/GitClient",
  {
    dependencies: [NodeContext.layer],
    effect: Effect.gen(function* () {
      const executor = yield* CommandExecutor.CommandExecutor;

      const gitRepoHasOrigin = Effect.fn("gitRepoHasOrigin")(function* () {
        const remoteShowCommand = Command.make("git", ...["remote", "show"]);
        const output = yield* executor
          .string(remoteShowCommand)
          .pipe(Effect.orElse(() => Effect.sync(() => "")));
        return output.trim().length !== 0;
      });

      const getOriginUrl = Effect.fn("getOriginUrl")(function* () {
        if (!(yield* gitRepoHasOrigin())) return yield* new NoOriginError();
        const remoteGetUrlCommand = Command.make(
          "git",
          ...["remote", "get-url", "origin"]
        );
        const output = yield* executor.string(remoteGetUrlCommand);
        return output;
      });

      const getOriginGithubUrl = Effect.fn("getOriginGithubUrl")(function* () {
        const originUrl = yield* getOriginUrl();
        const urlMatch = originUrl
          .trim()
          .replace(".git", "")
          .match(
            /((?<=git@github.com:)(.*)\/(.*)|(?<=https?:\/\/github.com\/)(.*)\/(.*))/
          )?.[0];
        return urlMatch ? `https://github.com/${urlMatch}` : undefined;
      });

      return {
        gitRepoHasOrigin,
        getOriginUrl,
        getOriginGithubUrl,
      } as const;
    }),
  }
) {}
