---
title: gr repo
category: commands
---

Manage your GitHub repository.

## create

Create a repository on GitHub.

```bash
gr repo create
```

### Flags

#### -s, &minus;&minus;scratch

Create a repository on GitHub from scratch.

```bash
gr repo create -s
gr repo create --scratch
```

#### -p, &minus;&minus;push

Create a repository on GitHub from scratch.

```bash
gr repo create -p
gr repo create --push
```

## clone \<source\> [destination]

Clone a GitHub repository.

```bash
gr repo clone ToastedDev/gitrover
gr repo clone cli/cli github-cli
```

### Arguments

#### \<source\>

The repository you want to clone.

```bash
gr repo clone ToastedDev/gitrover
```

#### [destination]

Where you want the repository to be cloned.

```bash
gr repo clone cli/cli github-cli
```
