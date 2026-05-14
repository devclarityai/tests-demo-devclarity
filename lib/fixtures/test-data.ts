/**
 * Test data fixtures
 * Centralized test data for use across tests
 */

export const testUsers = {
  admin: {
    email: process.env.ADMIN_EMAIL ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  },
  regularUser: {
    email: "user@example.com",
    password: "user123",
  },
  testUser: {
    email: process.env.ADMIN_EMAIL ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  },
};

export const testProjects = {
  development: {
    name: "Website Redesign",
    description: "Complete website overhaul",
  },
  testing: {
    name: "QA Testing Project",
    description: "Quality assurance testing",
  },
};

export const testResources = {
  developer: {
    name: "John Developer",
    role: "Senior Developer",
  },
  tester: {
    name: "Jane Tester",
    role: "QA Engineer",
  },
};

export const testClients = {
  acmeCorp: {
    name: "Acme Corporation",
    description: "Primary client",
  },
  techStartup: {
    name: "Tech Startup Inc",
    description: "Startup client",
  },
};
