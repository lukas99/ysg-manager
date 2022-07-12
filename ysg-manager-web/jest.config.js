module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./setup-jest.ts"],
  reporters: ["default"],
  moduleNameMapper: {
    '@okta/okta-auth-js': '<rootDir>/node_modules/@okta/okta-auth-js/dist/okta-auth-js.umd.js'
  },
};
