# gitrover

## 0.0.6

### Patch Changes

- 1247939: Throw when trying to create and push a repo if it has no commits.
- 7a405ff: Add `pr create` command.

  This command allows you to create a new pull request for a branch.

- 27bddf7: Add `pr checkout` command.

  This command allows you to checkout a pull request on your local machine.

- 702874d: Add new option for creating and pushing a repository when your current directory is not a git repository.

  Instead of erroring out like before, it will now ask if you want to either select another directory, initialize a new git repository, or exit (like the old behaviour).

## 0.0.5

### Patch Changes

- 396f21a: Fix "User force closed prompt" error for all commands
