# gitrover

## 0.0.4

### Patch Changes

- 6077119: Add `browse` command.

  ```bash
  # open this repository on github
  gr browse

  # open cli/cli on github
  gr browse cli/cli
  ```

- 110866b: Add version warning if your GitRover version is out of date.

## 0.0.3

### Patch Changes

- 6f4d5df: Add creating repositories from scratch.
- 6f4d5df: Add flags for `gr repo create`.

  ```bash
  # create a repository from scratch
  gr repo create -s
  gr repo create --scratch

  # create a repository and push a local repository
  gr repo create -p
  gr repo create --push
  ```

## 0.0.2

### Patch Changes

- 7758e9b: Add `gr repo clone` command.

  ```bash
  # clone repository ToastedDev/hello-world (if logged in to ToastedDev)
  gr repo clone hello-world

  # clone repository cli/cli
  gr repo clone cli/cli
  ```

## 0.0.1

### Patch Changes

- 4a91bd2: Initialize basic CLI. Adds basic "auth" and "repo" commands.

  ```bash
  # auth commands
  ## login
  gr auth login
  ## logout
  gr auth logout

  # repo commands
  ## create
  gr repo create
  ```
