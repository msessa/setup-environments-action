import { github, javascript } from 'projen';
import { GitHubActionTypeScriptProject, RunsUsing } from 'projen-github-action-typescript';

const project = new GitHubActionTypeScriptProject({
  defaultReleaseBranch: 'main',
  devDeps: [
    'projen-github-action-typescript',
  ],
  name: 'setup-environments-action',
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  minNodeVersion: '20.12.1',
  depsUpgradeOptions: {
    workflow: false,
  },
  mutableBuild: false,
  minMajorVersion: 1,
  license: 'MIT',
  copyrightOwner: 'Service Victoria',
  actionMetadata: {
    author: 'Service Victoria Platform Engineering',
    name: 'Setup Environments',
    description: 'Action to configures environments in a repository',
    runs: {
      using: RunsUsing.NODE_20,
      main: 'dist/index.js',
    },
    inputs: {
      token: {
        description: 'Github token with the scope "repo"',
        required: true,
      },
      repository: {
        description: 'Repository name with owner. For example, sv-oss/repo',
        required: false,
        default: '${{ github.repository }}',
      },
      environments: {
        description: 'Comma-separated list of Environments to configure',
        required: true,
      },
      reviewers: {
        description: 'Comma-separated list of required reviewers e.g. "org/team,user" max 6',
        required: false,
      },
    },
  },
});

project.release?.addJobs({
  'floating-tags': {
    permissions: {
      contents: github.workflows.JobPermission.WRITE,
    },
    runsOn: ['ubuntu-latest'],
    needs: ['release_github'],
    steps: [
      { uses: 'actions/checkout@v4' },
      { uses: 'giantswarm/floating-tags-action@v1' },
    ],
  },
});

project.synth();