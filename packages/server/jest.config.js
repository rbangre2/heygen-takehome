module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/src/services/jobStatusService.ts"], // Initialize service
};
