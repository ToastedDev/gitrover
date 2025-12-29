import { Command, Args } from "@effect/cli";
import { Console, Data, Effect, Option } from "effect";
import open from "open";
import { GitClient } from "~/services/git.js";
import { GithubClient } from "~/services/github.js";

const repoArgument = Args.text({
  name: "repository",
}).pipe(
  Args.optional,
  Args.withDescription("The repository you want to browse.")
);

class OpenError extends Data.TaggedError("OpenError")<{
  cause: unknown;
}> {}

export const BrowseCommand = Command.make(
  "browse",
  { repoArgument },
  ({ repoArgument }) =>
    Effect.gen(function* () {
      const gitClient = yield* GitClient;
      const githubClient = yield* GithubClient;

      const url = yield* Option.match(repoArgument, {
        onNone: () => gitClient.getOriginGithubUrl(),
        onSome: (repository) =>
          Effect.sync(() =>
            repository.startsWith("https://github.com")
              ? repository
              : `https://github.com/${repository}`
          ),
      });
      if (!url) {
        process.exit(1);
      }

      const splitSource = url.replace("https://github.com/", "").split("/");
      const owner = splitSource[0]!;
      const name = splitSource[1] ?? splitSource[0]!;

      yield* githubClient.getRepository(owner, name);

      return yield* Effect.tryPromise({
        try: () => open(url),
        catch: (e) => new OpenError({ cause: e }),
      });
    }).pipe(
      Effect.catchTag("RepositoryNotFoundError", () =>
        Console.error("Repository not found.")
      )
    )
);

// import { RequestError } from "@octokit/request-error";
// import { Octokit } from "@octokit/rest";
// import chalk from "chalk";
// import { Command } from "commander";
// import { error } from "~/utils/logger.js";
// import open from "open";
// import { convertOriginUrlToGitHubUrl } from "~/utils/git.js";
// import { handler } from "~/utils/command.js";
//
// export const browseCommand = new Command()
//   .name("browse")
//   .argument("[repository]", "The repository you want to browse.")
//   .description("Open a repository in your browser.")
//   .action(
//     handler(async (repository?: string) => {
//       const url = repository
//         ? repository?.startsWith("https://github.com")
//           ? repository
//           : `https://github.com/${repository}`
//         : convertOriginUrlToGitHubUrl();
//       if (!url) {
//         if (!repository)
//           error(
//             "Failed to parse origin URL.\nThis probably means you don't have an",
//             chalk.bold("origin"),
//             "branch.",
//           );
//         process.exit(1);
//       }
//
//       const splitSource = url.replace("https://github.com/", "").split("/");
//       const owner = splitSource[0]!;
//       const name = splitSource[1] ?? splitSource[0]!;
//
//       const octokit = new Octokit();
//       try {
//         await octokit.rest.repos.get({
//           owner,
//           repo: name,
//         });
//       } catch (err) {
//         if (err instanceof RequestError && err.status === 404) {
//           error(`Repository ${chalk.bold(`${owner}/${name}`)} does not exist.`);
//           process.exit(1);
//         }
//         console.error(err);
//         process.exit(1);
//       }
//
//       await open(url);
//     }),
//   );
