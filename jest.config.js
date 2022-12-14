const nextJest = require("next/jest");
const createJestConfig = nextJest({
  dir: "./",
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  setupFiles: ["<rootDir>/script/test-setup.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
module.exports = createJestConfig(customJestConfig);
