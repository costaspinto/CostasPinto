# Costas Pinto GitHub Profile — installation

This package contains the complete replacement profile README and the workflow that generates the contribution snake as a GIF plus light/dark SVG assets.

## Repository layout

Copy the files into the root of `costaspinto/CostasPinto` and preserve these paths:

```text
CostasPinto/
├── README.md
└── .github/
    └── workflows/
        └── generate-snake.yml
```

## GitHub setup

1. Replace the repository's root `README.md` with the supplied `README.md`.
2. Add `.github/workflows/generate-snake.yml` at the exact path shown above.
3. Open **Settings → Actions → General → Workflow permissions**.
4. Select **Read and write permissions** and save.
5. Open **Actions → Generate Contribution Snake → Run workflow** on the `main` branch.
6. Wait for the run to finish successfully, then open the `output` branch.

The workflow publishes these files:

- `github-snake.gif` — used in the README because GitHub renders animated GIFs reliably.
- `github-snake.svg` — light-theme SVG.
- `github-snake-dark.svg` — dark-theme SVG.

## Verify publication

After a successful workflow run, these URLs should return image content:

- https://raw.githubusercontent.com/costaspinto/CostasPinto/output/github-snake.gif
- https://raw.githubusercontent.com/costaspinto/CostasPinto/output/github-snake.svg
- https://raw.githubusercontent.com/costaspinto/CostasPinto/output/github-snake-dark.svg

If the workflow fails, open the failed run in **Actions**, select the `generate` job, and inspect the step that failed. A 403 during publication usually means the workflow token does not have repository contents write permission, or an organization/repository policy is restricting Actions token permissions.

## Validation note

The YAML and README references in this package are checked locally. The existing repository's published SVG files were also verified to exist in its `output` branch. The new GIF cannot be verified until GitHub runs the updated workflow, because generating it requires the live GitHub contribution data and an Actions runner.
