# Public launch checklist

This repository is implementation-ready for GitHub Pages QA, but a branded production launch is blocked until the unchecked owner-controlled items below are resolved.

## Verified in the implementation

- [x] Public companion repository is separate from the proprietary product repository.
- [x] Public-content policy rejects Unreal/plugin/binary artifacts, local paths, credential patterns and oversized files.
- [x] Airbase archive URLs, byte counts and SHA-256 values match the current public manifest.
- [x] Barnyard's reported C grade and limitations are visible rather than hidden.
- [x] Essential content is static HTML and works without client-side JavaScript.
- [x] Repository build, content, type, link and accessibility-oriented checks are automated.
- [x] Repository description, default Pages website, focused topics and 1280×640 social preview are configured.
- [x] Wiki and Projects are disabled; Issues and Pull Requests remain enabled with structured templates.
- [x] `main` requires one approval, CODEOWNER review and the `content-policy`, `build` and `link-check` status checks; force pushes and deletion remain disabled.
- [x] GitHub Pages deploys through Actions at `https://nameframe-uploader.github.io/nameframe-synthetic-data/`, with HTTPS enforced.

## Owner-controlled launch gates

- [ ] Confirm the final legal entity or copyright owner and obtain legal approval for `LICENSE.md` and `DATA_TERMS.md`.
- [ ] Confirm redistribution rights for every preview image and depicted third-party asset.
- [ ] Publish or correct the Barnyard archive URL. The configured URL returned HTTP 404 on 2026-08-15.
- [ ] Decide whether `nameframe-uploader` is the permanent public owner and complete its public profile if retained.
- [ ] Verify `getnameframe.com` in GitHub, create the `samples` CNAME, configure the Pages custom domain and enforce HTTPS.
- [ ] Add approved cross-links from the main NameFrame dataset and developer pages.
- [ ] Submit the final sitemap and record the search/download/pilot baseline.

Do not mark the project launched while any legal, asset-rights, download-integrity, DNS or HTTPS gate is unresolved.
