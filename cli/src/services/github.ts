import { FetchHttpClient, HttpClient } from "@effect/platform";
import { NodeContext } from "@effect/platform-node";
import { Data, Effect } from "effect";

export class RepositoryNotFoundError extends Data.TaggedError(
  "RepositoryNotFoundError"
)<{
  message: string;
}> {}

export class GithubClient extends Effect.Service<GithubClient>()(
  "@gitrover/GithubClient",
  {
    dependencies: [NodeContext.layer, FetchHttpClient.layer],
    effect: Effect.gen(function* () {
      const http = yield* HttpClient.HttpClient;

      const getRepository = Effect.fn("getRepostory")(function* (
        owner: string,
        name: string
      ) {
        const res = yield* http.get(
          `https://api.github.com/repos/${owner}/${name}`,
          {
            headers: {
              Accept: "application/vnd.github+json",
            },
          }
        );
        const data = yield* res.json;
        if (res.status === 404)
          return yield* new RepositoryNotFoundError(data.message);
        return data;
      });

      return { getRepository } as const;
    }),
  }
) {}
