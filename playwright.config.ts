import { defineConfig, devices } from "@playwright/test";
import { loadEnvFile } from "node:process";

if (process.env.ENV_PATH) {
  loadEnvFile(process.env.ENV_PATH);
} else {
  loadEnvFile("./.playwright.env");
}

if (process.env.FORCE_COLOR !== undefined) {
  delete process.env.NO_COLOR;
}

export default defineConfig({
  testDir: "./tests",

  timeout: 20 * 1000,

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : 1,

  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3001",
    screenshot: "on",
    video: "on",
    trace: "on",
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: ".auth/user.json",
      },
      dependencies: ["setup"],
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    // Mobile viewports for responsive testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // webServer: {
  //   command: 'bin/rails server',
  //   url: 'http://localhost:3001',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
