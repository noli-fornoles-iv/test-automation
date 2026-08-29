# AF-Automation

This repository contains Playwright-based end-to-end automation tests for Anytime Fitness.

## Features

- Playwright + playwright-bdd for BDD-style tests
- Multi-environment support via `.env` files (`.env.sit`, `.env.uat`, `.env.prod`)
- BrowserStack integration for cross-browser and geoLocation testing
- Winston-based logging for better traceability and debugging

## Getting Started

### Prerequisites

- Node.js installed (v18+ recommended)

### Setup

1. Clone the repository
2. Install dependencies using npm install
3. Install playwright browsers using npx playwright install
4. Create environment files (`.env.prod`, `.env.sit`, `.env.uat`) based on `.env.example`  
5. Update the environment files with your configuration values
6. Run tests using the configured environment  
