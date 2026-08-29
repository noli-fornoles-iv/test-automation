# Jenkins

Tab: Resources
Source: https://app.getguru.com/folders/TBKzdz7c/AF-Automation-?activeCard=e3b3a076-79f1-4449-917f-8bd4fe3b7598
Updated: 2026-02-26T16:01:58.275Z

# 🚀 CI/CD Pipeline
A Jenkins pipeline is used to automate the execution of the Playwright test suite. The pipeline is defined in the `Jenkinsfile` and provides a flexible way to run different sets of tests in parallel.

### Overview
The Jenkins pipeline is designed to:

- Checkout the code from the source repository.
- Install all the necessary dependencies.
- Run selected Playwright tests in parallel based on user-defined parameters.
- Optionally generate and publish Allure reports to an S3 bucket for easy access and visualization of test results.

### Multibranch Pipeline and Triggers
This Jenkins pipeline is configured as a **Multibranch Pipeline**. This means that Jenkins automatically discovers branches and pull requests in the source code repository and creates a corresponding Jenkins job for each one.

**How it gets triggered:**

- **Branch Indexing**: Jenkins periodically scans the repository for new branches. When a new branch with a `Jenkinsfile` is detected, a new pipeline job is created for that branch.
- **Push Events**: The pipeline is automatically triggered by push events to any branch. When you push new commits to a branch, Jenkins will automatically start a new build for that branch’s pipeline.
- **Pull Requests**: When a new pull request is created, Jenkins will automatically create a new job to test the changes in the pull request. This allows you to verify the changes before they are merged into the main branch.
- **Manual Builds**: You can also manually trigger a build for any branch at any time from the Jenkins UI. This is useful when you need to re-run a build or run a build with specific parameters.

### Accessing Jenkins and Reports
- **Jenkins URL**: The Jenkins instance is available at [https://jenkins.outliant.io/](https://jenkins.outliant.io/).
- **Authentication**: Access to Jenkins is managed through GitHub OAuth. You will need to log in with your GitHub account.
- **Allure Reports URL**: The Allure reports are published to [https://allure-reports.outliant.io/](https://allure-reports.outliant.io/).
- **Reports Credentials**: The Allure reports website is protected. Please **contact the DevOps department** to get the credentials.

### EC2 Fleet Plugin for Dynamic Agents
This pipeline uses the [EC2 Fleet Jenkins plugin](https://plugins.jenkins.io/ec2-fleet/) to dynamically provision and scale Jenkins agents on AWS EC2.

**How it works:**

- The `createStage` function in the `Jenkinsfile` defines a `node('ec2-fleet')`.
- When a build is triggered, the EC2 Fleet plugin checks if there are available agents with the `ec2-fleet` label.
- If no agents are available, the plugin automatically provisions a new EC2 instance based on a pre-configured launch template in AWS.
- Once the EC2 instance is up and running, it connects to the Jenkins master as an agent, and the build proceeds.
- After a configurable idle time, the plugin automatically terminates the EC2 instance to save costs.
This approach allows the pipeline to have a scalable and cost-effective pool of agents that are only running when needed.

### Pipeline Parameters
The pipeline is highly configurable through the following parameters:

| Parameter Name | Type | Default Value | Description |
| --- | --- | --- | --- |
| GENERATE_ALLURE_REPORT | boolean | true | If checked, an Allure report will be generated and uploaded to S3. A link to the report will be available in the build description. |
| RUN_ALL_TESTS | boolean | false | If checked, all the available test suites will be executed in parallel. This will ignore the individual RUN_TEST_* parameters. |
| RUN_TEST_LOCAL_LDT | boolean | true | Runs the test:local:ldt npm script. |
| RUN_TEST_LOCAL_MONRIC | boolean | false | Runs the test:local:monric npm script. |
| RUN_TEST_LOCAL_TERMIC | boolean | true | Runs the test:local:termic npm script. |
| RUN_TEST_LOCAL_SMOKE | boolean | false | Runs the test:local:smoke npm script. |
| RUN_TEST_LOCAL_NO_INSURANCE | boolean | false | Runs the test:local:no_insurance npm script. |
| RUN_TEST_LOCAL_SEGMENTS | boolean | false | Runs the test:local:segments npm script. |
| RUN_TEST_BROWSERSTACK_SMOKE | boolean | false | Runs the test:browserstack:smoke npm script. |
| RUN_TESTLOCAL_MSAFARI | boolean | false | Runs the testlocal:msafari npm script. |
| RUN_TESTLOCAL_DSAFARI | boolean | false | Runs the testlocal:dsafari npm script. |
| RUN_TEST_LOCAL_WSJFORM | boolean | false | Runs the test:local:wsjform npm script. |
| RUN_TEST_LOCAL_QUOTEFORM | boolean | false | Runs the test:local:quoteform npm script. |
| RUN_TEST_LOCAL_INSURIFYFORM | boolean | false | Runs the test:local:insurifyform npm script. |
| RUN_TEST_LOCAL_TEST | boolean | false | Runs the test:local:test npm script. |
| WORKERS | string | 5 | The number of parallel workers to be used by Playwright for running the tests. |
| PROJECT | choice | all | The Playwright project to run the tests against. The available choices are: all, Desktop Chromium, Mobile Safari, Desktop Safari, Mobile Chrome (Android), Desktop Firefox. |

### How to Add a New Test to the Pipeline
To add a new test suite to the Jenkins pipeline, you need to follow these steps:

- **Add a new script to ****`package.json`**:
First, you need to add a new script to your `package.json` file. For example, if you want to add a new test suite called `my-new-test`, you would add something like this to the `scripts` section of your `package.json`:

```
"scripts": {  ...  "test:local:my-new-test": "npx bddgen && npx dotenv -e .env -- playwright test --project='Desktop Chromium' --grep @my-new-test"  ...}
```
- **Add a new boolean parameter to ****`Jenkinsfile`**:
Next, you need to add a new `booleanParam` to the `parameters` block in the `Jenkinsfile`. This will create a new checkbox in the Jenkins UI to allow you to select this new test suite.

```
parameters {    // ... existing parameters    booleanParam(name: 'RUN_TEST_LOCAL_MY_NEW_TEST', defaultValue: false, description: 'Run test command: test:local:my-new-test')}
```
- **Add the new test to the ****`testCommands`**** map in ****`Jenkinsfile`**:
Finally, you need to add a new entry to the `testCommands` map in the `Run Playwright Tests` stage of your `Jenkinsfile`. This will link the new boolean parameter to the new npm script.

```
def testCommands = [    // ... existing test commands    'RUN_TEST_LOCAL_MY_NEW_TEST': 'test:local:my-new-test']
```
After making these changes, the new test suite will be available as an option in the Jenkins pipeline, and you will be able to run it just like any other test suite.

### Creating a New Pipeline
To create a new Jenkins pipeline for a different repository, you can follow these steps:

- Go to the Jenkins dashboard and click on **New Item**.
- Enter a name for your new pipeline.
- Scroll down and use the **Copy from** option.
- Enter the name of an existing pipeline (e.g., `selectquote-playwright-test`) to use as a template.
- Click **OK**.
- In the pipeline configuration page, go to the **Pipeline** section.
- In the **Pipeline script from SCM** section, update the **Repository URL** to point to your new repository.
- If necessary, update the **Credentials** used to access the repository.
- Click **Save**.
