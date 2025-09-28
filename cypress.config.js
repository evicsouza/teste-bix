const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || 'http://localhost:3001',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/commands.js',
    env: {
      adminEmail: "admin@test.com",
      adminPassword: "admin123",
      userEmail: "user@test.com",
      userPassword: "user123"
    }
  },
  video: true,
  screenshotOnRunFailure: true
})
