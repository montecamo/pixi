module.exports = {
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true,
  },
  projects: [
    {
      root: "./packages/ui",
      package: "./package.json",
      tsconfig: "./tsconfig.json",
    },
  ],
};
