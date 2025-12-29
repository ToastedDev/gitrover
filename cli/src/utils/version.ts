import { FileSystem } from "@effect/platform";
import { Effect, Schema } from "effect";
import path from "path";
import { PKG_ROOT } from "~/consts.js";

const PackageJson = Schema.compose(
  Schema.parseJson(),
  Schema.Struct({
    version: Schema.String,
  })
);
const PACKAGE_JSON_PATH = path.join(PKG_ROOT, "package.json");

export const getVersion = Effect.fn("getVersion")(function* () {
  const fs = yield* FileSystem.FileSystem;
  const packageJsonContent = yield* fs.readFileString(PACKAGE_JSON_PATH);
  const packageJson = yield* Schema.decode(PackageJson)(packageJsonContent);
  return packageJson.version;
});
