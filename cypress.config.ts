import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/integration/**/*.{js,ts}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
