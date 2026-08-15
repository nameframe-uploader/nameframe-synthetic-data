import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const repositoryName = 'nameframe-synthetic-data';
const deployingToGitHub = process.env.GITHUB_ACTIONS === 'true';
const customOrigin = process.env.SITE_ORIGIN;

export default defineConfig({
  output: 'static',
  site: customOrigin || 'https://nameframe-uploader.github.io',
  base: customOrigin ? '/' : `/${repositoryName}`,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    define: {
      __DEPLOY_TARGET__: JSON.stringify(deployingToGitHub ? 'github-pages' : 'local')
    }
  }
});
