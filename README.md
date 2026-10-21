# AWS CI/CD Capstone Project

This project demonstrates an end-to-end Continuous Integration and Continuous Deployment (CI/CD) workflow for a containerized Node.js and Express application using GitHub and AWS services.

The pipeline runs automated tests, builds a Docker image, publishes it to Amazon Elastic Container Registry (ECR), pauses for manual approval, and deploys the application to Amazon Elastic Container Service (ECS) using AWS CodeDeploy blue/green deployment.

**Repository:** [olivermooz-117/aws-cicd-capstone](https://github.com/olivermooz-117/aws-cicd-capstone)  
**AWS Region:** US East (Ohio), `us-east-2`  
**Verified application version:** `1.1.0`

## Table of Contents

- [AWS CI/CD Capstone Project](#aws-cicd-capstone-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Architecture and Workflow](#architecture-and-workflow)
    - [Pipeline stages](#pipeline-stages)
  - [Technology Stack](#technology-stack)
  - [Application and Automated Tests](#application-and-automated-tests)
    - [Test results](#test-results)
  - [Local Setup](#local-setup)
  - [AWS Deployment Resources](#aws-deployment-resources)
  - [Blue/Green Deployment Verification](#bluegreen-deployment-verification)
  - [Monitoring and Notifications](#monitoring-and-notifications)
    - [Amazon CloudWatch](#amazon-cloudwatch)
    - [Amazon SNS](#amazon-sns)
  - [Screenshots and Evidence](#screenshots-and-evidence)
  - [Key Outcomes](#key-outcomes)
  - [Conclusion](#conclusion)

## Project Overview

The objective of this project is to automate application testing, container image creation, and deployment to AWS.

The project demonstrates:

- GitHub source control.
- AWS CodePipeline orchestration.
- Automated tests executed by AWS CodeBuild.
- Docker image creation and publishing to Amazon ECR.
- Manual approval before deployment.
- ECS blue/green deployment with AWS CodeDeploy.
- Application access through an Application Load Balancer.
- CloudWatch CPU monitoring and SNS email notifications.

## Architecture and Workflow

The deployment workflow follows this sequence:

```text
Developer
   |
   v
GitHub Repository
   |
   v
AWS CodePipeline
   |
   v
AWS CodeBuild
   |
   +--> Install Dependencies
   +--> Run Automated Tests
   +--> Build Docker Image
   +--> Push Image to Amazon ECR
   |
   v
Manual Approval
   |
   v
AWS CodeDeploy
   |
   v
Amazon ECS Blue/Green Deployment
   |
   v
Application Load Balancer
   |
   v
Live Express Application

Monitoring:
Amazon ECS
   |
   v
Amazon CloudWatch CPU Alarm
   |
   v
Amazon SNS Topic
   |
   v
Email Notification
```

### Pipeline stages

1. **Source:** CodePipeline retrieves the application source from GitHub.
2. **Build and test:** CodeBuild installs dependencies and runs the Jest test suite using `buildspec.yml`.
3. **Container image publishing:** CodeBuild builds the Docker image and pushes it to Amazon ECR using the `latest` tag and a commit-based tag.
4. **Manual approval:** The pipeline waits for approval before proceeding with deployment.
5. **Deployment:** AWS CodeDeploy manages the ECS blue/green deployment.
6. **Application access:** The Application Load Balancer provides access to the running application.

## Technology Stack

| Technology | Purpose |
|---|---|
| GitHub | Source control |
| AWS CodePipeline | CI/CD orchestration |
| AWS CodeBuild | Automated testing and Docker image build |
| Docker | Application containerization |
| Amazon ECR | Container image storage |
| Amazon ECS | Runs the containerized application |
| AWS CodeDeploy | ECS blue/green deployment |
| Application Load Balancer | Routes application traffic |
| Amazon CloudWatch | CPU monitoring and alarm evaluation |
| Amazon SNS | Email notifications |

## Application and Automated Tests

The application is built using Node.js and Express.

Important project files include:

- `src/app.js` — Express application routes and home page.
- `src/server.js` — application server entry point.
- `src/package.json` — application dependencies and scripts.
- `tests/app.test.js` — automated tests.
- `Dockerfile` — Docker image instructions.
- `buildspec.yml` — CodeBuild commands, test execution, image publishing, and build artifacts.
- `appspec.yml` — CodeDeploy deployment specification.
- `taskdef.json` — ECS task definition configuration.

The automated tests cover:

1. The home page response.
2. The `/health` endpoint returning an OK status.
3. Unknown routes returning HTTP 404.

### Test results

The tests passed locally and in the CodeBuild execution.

```text
Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

The updated `buildspec.yml` runs the tests before building and pushing the Docker image.

## Local Setup

Clone the repository:

```bash
git clone https://github.com/olivermooz-117/aws-cicd-capstone.git
cd aws-cicd-capstone
```

Install application dependencies:

```bash
npm ci --prefix src
```

Run the automated tests:

```bash
npm test --prefix src -- --runInBand
```

Start the application:

```bash
npm start --prefix src
```

The application provides a home page at `/` and a JSON health check at `/health`.

## AWS Deployment Resources

The following resource names correspond to the AWS environment used for this project.

| AWS Resource | Name |
|---|---|
| Region | `us-east-2` |
| CodePipeline | `myapp-pipeline` |
| ECR repository | `myapp-repo` |
| ECS cluster | `myapp-cluster` |
| ECS service | `myapp-service` |
| CodeDeploy application | `myapp-codedeploy` |
| CodeDeploy deployment group | `myapp-dg` |
| Application Load Balancer | `myapp-alb` |
| CloudWatch alarm | `myapp-ecs-high-cpu` |
| SNS topic | `myapp-cloudwatch-alerts` |

## Blue/Green Deployment Verification

The application version was updated from `1.0.0` to `1.1.0` in `src/package.json`.

The updated version was tested locally, pushed to GitHub, and processed through the CI/CD pipeline. The pipeline completed successfully, including the deployment workflow.

The application was then refreshed through the Application Load Balancer and confirmed to display **Version 1.1.0**.

This provides evidence that the application update reached the live environment through the deployment pipeline.

## Monitoring and Notifications

### Amazon CloudWatch

The CloudWatch alarm `myapp-ecs-high-cpu` monitors ECS CPU utilization.

| Setting | Configuration |
|---|---|
| Metric | `CPUUtilization` |
| Cluster | `myapp-cluster` |
| Service | `myapp-service` |
| Statistic | Average |
| Threshold | CPU utilization greater than or equal to 70% |
| Period | 5 minutes |
| Datapoints to alarm | 2 out of 2 |
| Alarm actions | Enabled |

### Amazon SNS

The alarm is configured to publish notifications to the SNS topic:

`myapp-cloudwatch-alerts`

A confirmed email subscription is configured for the topic.

A CloudWatch alarm-state test was performed using the reason:

`Capstone test: verify CloudWatch alarm SNS email notification`

The resulting email confirmed the state transition from `OK` to `ALARM` and identified the configured SNS topic.

After testing, the alarm was checked again. It returned to `OK`, and the original threshold, period, evaluation settings, and enabled actions remained in place.

## Screenshots and Evidence

The following evidence files are stored in `docs/`.

| Screenshot | Evidence |
|---|---|
| `docs/codepipeline-success.png` | Successful pipeline execution |
| `docs/codebuild-success.png` | Successful CodeBuild execution and three passing tests |
| `docs/ecr-image.png` | Container image stored in Amazon ECR |
| `docs/codedeploy-blue-green.png` | CodeDeploy blue/green deployment |
| `docs/ecs-healthy-service.png` | Healthy ECS service |
| `docs/live-application.png` | Application accessed through the load balancer |
| `docs/blue-green-after.png` | Updated live application showing Version 1.1.0 |
| `docs/manual-approval.png` | Manual approval stage |
| `docs/cloudwatch-alarm.png` | CloudWatch alarm configuration |
| `docs/sns-topic.png` | SNS topic and email subscription |
| `docs/alarm-email.png` | Email generated by the CloudWatch alarm test |

 `docs/pipeline-diagram.png`  w

Before publishing screenshots publicly, blur personal email addresses and AWS account identifiers where visible.

## Key Outcomes

- Automated application tests run in CodeBuild.
- Docker images are tagged and published to Amazon ECR.
- A manual approval stage controls release progression.
- AWS CodeDeploy manages ECS blue/green deployment.
- The live application was verified at Version 1.1.0.
- CloudWatch monitors ECS CPU utilization.
- SNS successfully delivers CloudWatch alarm notifications by email.

## Conclusion

This project demonstrates an AWS-based CI/CD workflow connecting GitHub, CodePipeline, CodeBuild, Amazon ECR, ECS, CodeDeploy, and an Application Load Balancer.

It also demonstrates automated testing, controlled deployments, application verification, CloudWatch monitoring, and SNS email alerting.

**Author:** Oliver Moosberger

**Repository:** [olivermooz-117/aws-cicd-capstone](https://github.com/olivermooz-117/aws-cicd-capstone)
