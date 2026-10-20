# AWS CI/CD Capstone Project

An end-to-end Continuous Integration and Continuous Deployment (CI/CD) project that automates application testing, container image building, and deployment to AWS using managed DevOps services.

The project demonstrates how to build a repeatable deployment pipeline using GitHub, AWS CodePipeline, AWS CodeBuild, Amazon ECR, AWS CodeDeploy, Amazon ECS, and Amazon CloudWatch.

## Table of Contents

- [AWS CI/CD Capstone Project](#aws-cicd-capstone-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [Project goals](#project-goals)
  - [Architecture](#architecture)
  - [AWS Services Used](#aws-services-used)
  - [CI/CD Workflow](#cicd-workflow)
    - [1. Source Control](#1-source-control)
    - [2. Continuous Integration with CodeBuild](#2-continuous-integration-with-codebuild)
    - [3. Container Image Management with Amazon ECR](#3-container-image-management-with-amazon-ecr)
    - [4. Manual Approval](#4-manual-approval)
    - [5. Deployment with CodeDeploy and ECS](#5-deployment-with-codedeploy-and-ecs)
    - [6. Application Access](#6-application-access)
  - [Application and Containerization](#application-and-containerization)
  - [Deployment Strategy](#deployment-strategy)
  - [Monitoring and Notifications](#monitoring-and-notifications)
    - [Amazon CloudWatch](#amazon-cloudwatch)
    - [Amazon SNS](#amazon-sns)
  - [Repository Structure](#repository-structure)
  - [Prerequisites](#prerequisites)
  - [Local Setup and Testing](#local-setup-and-testing)
  - [Deployment Configuration](#deployment-configuration)
  - [Screenshots and Evidence](#screenshots-and-evidence)
  - [Key Learning Outcomes](#key-learning-outcomes)
  - [Future Improvements](#future-improvements)
  - [Conclusion](#conclusion)

## Project Overview

The goal of this project is to implement an automated deployment workflow that moves application changes from source control to a running application on AWS.

When code is pushed to the GitHub repository, the pipeline retrieves the source code, runs the configured build and test steps, builds a Docker image, and publishes the image to Amazon ECR. The deployment stage then uses AWS CodeDeploy and Amazon ECS to deploy the updated application.

A manual approval stage provides an additional control before deployment proceeds.

CloudWatch monitors ECS CPU utilization, while Amazon SNS provides email notifications when the configured alarm enters the alarm state.

### Project goals

- Automate application builds and deployments.
- Integrate source control with AWS CI/CD services.
- Run automated tests as part of the build process.
- Package the application into a Docker container.
- Store container images in Amazon ECR.
- Deploy the application to Amazon ECS.
- Implement a controlled deployment workflow with manual approval.
- Configure blue/green deployment using AWS CodeDeploy.
- Monitor ECS CPU utilization with CloudWatch.
- Configure email notifications using Amazon SNS.

## Architecture

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
Manual Approval
   |
   v
AWS CodeBuild
   |
   +--> Install Dependencies
   +--> Run Tests
   +--> Build Docker Image
   +--> Push Image to Amazon ECR
   |
   v
AWS CodeDeploy
   |
   v
Amazon ECS (Fargate)
   |
   v
Application Load Balancer
   |
   v
Users Access the Application

Monitoring:
Amazon ECS --> Amazon CloudWatch Alarm
                         |
                         v
                    Amazon SNS
                         |
                         v
                    Email Alerts
```

The exact stage ordering and actions are determined by the configured CodePipeline.

## AWS Services Used

| Service                   | Purpose                                                                         |
| ------------------------- | ------------------------------------------------------------------------------- |
| GitHub                    | Source code management and version control                                      |
| AWS CodePipeline          | Orchestrates the CI/CD workflow                                                 |
| AWS CodeBuild             | Builds the application, runs configured tests, and prepares the container image |
| Amazon ECR                | Stores Docker container images                                                  |
| Amazon ECS                | Runs the containerized application                                              |
| AWS Fargate               | Provides serverless container compute for ECS tasks                             |
| AWS CodeDeploy            | Manages the configured blue/green deployment process                            |
| Application Load Balancer | Routes incoming application traffic                                             |
| Amazon CloudWatch         | Monitors ECS CPU utilization and evaluates alarm conditions                     |
| Amazon SNS                | Sends email notifications from the CloudWatch alarm                             |

**AWS Region:** US East (Ohio), `us-east-2`

## CI/CD Workflow

### 1. Source Control

Application source code and deployment configuration are maintained in GitHub.

Repository: [aws-cicd-capstone](https://github.com/olivermooz-117/aws-cicd-capstone)

Changes pushed to the configured source branch trigger the pipeline according to its source-stage configuration.

### 2. Continuous Integration with CodeBuild

AWS CodeBuild executes the instructions defined in `buildspec.yml`.

The configured build process supports application dependency installation, automated testing, and Docker image preparation.

### 3. Container Image Management with Amazon ECR

The application is packaged into a Docker image using the project's `Dockerfile`.

The image is published to Amazon ECR so it can be used by the ECS task definition during deployment.

### 4. Manual Approval

The pipeline includes a manual approval stage.

This provides an opportunity to review a release before allowing the pipeline to proceed to deployment.

### 5. Deployment with CodeDeploy and ECS

AWS CodeDeploy manages the configured deployment group and blue/green deployment process for the ECS application.

The new application version is deployed through ECS, and the Application Load Balancer provides the entry point for application traffic.

### 6. Application Access

Users access the deployed application through the Application Load Balancer rather than connecting directly to an individual container task.

## Application and Containerization

The project uses a Node.js application with Express and includes an automated test suite.

The Dockerfile defines how the application is packaged into a container image.

Key application and deployment files include:

- `src/app.js` — application logic.
- `src/server.js` — application server entry point.
- `tests/app.test.js` — application tests.
- `Dockerfile` — container image instructions.
- `buildspec.yml` — CodeBuild instructions.
- `appspec.yml` — CodeDeploy deployment specification.
- `taskdef.json` — ECS task definition configuration.

## Deployment Strategy

The project uses AWS CodeDeploy with an ECS deployment group configured for blue/green deployment.

Blue/green deployment supports introducing a new application version separately from the currently serving version. Traffic can be shifted according to the deployment configuration.

This approach helps control releases and provides a structured way to manage application updates.

The pipeline also incorporates manual approval before the deployment stage.

## Monitoring and Notifications

### Amazon CloudWatch

A CloudWatch metric alarm named `myapp-ecs-high-cpu` monitors CPU utilization for the following ECS resources:

- **Cluster:** `myapp-cluster`
- **Service:** `myapp-service`
- **Metric:** `CPUUtilization`
- **Statistic:** Average
- **Threshold:** CPU utilization greater than or equal to 70%
- **Evaluation period:** 5 minutes
- **Datapoints to alarm:** 2 out of 2

The alarm is configured to enter the alarm state when CPU utilization meets or exceeds the threshold for two evaluated datapoints.

### Amazon SNS

The CloudWatch alarm is configured to publish notifications to the SNS topic:

`myapp-cloudwatch-alerts`

An email subscription has been created and confirmed for the topic.

This configuration provides an email notification path when the CloudWatch alarm transitions into the alarm state. Actual delivery should be verified with a notification test.

## Repository Structure

```text
aws-cicd-capstone/
├── src/
│   ├── app.js
│   └── server.js
├── tests/
│   └── app.test.js
├── docs/
│   ├── screenshots/
│   └── pipeline-diagram.png
├── Dockerfile
├── buildspec.yml
├── appspec.yml
├── taskdef.json
├── package.json
├── package-lock.json
└── README.md
```

The `docs/` directory contains project documentation and supporting evidence. Add the architecture diagram and screenshots when they are available in the repository.

## Prerequisites

To reproduce or extend this project, you will need:

- A GitHub account and Git.
- Node.js and npm for local development.
- Docker for building and testing the container image locally.
- An AWS account.
- AWS IAM permissions for the services used by the pipeline.
- An Amazon ECR repository.
- An Amazon ECS cluster and service.
- An AWS CodeDeploy application and deployment group.
- An Application Load Balancer configured for the ECS deployment.
- A configured CodePipeline and CodeBuild project.

AWS resources must be configured with the appropriate IAM roles, policies, networking, and service integrations.

## Local Setup and Testing

Clone the repository:

```bash
git clone https://github.com/olivermooz-117/aws-cicd-capstone.git
cd aws-cicd-capstone
```

Install dependencies:

```bash
npm ci
```

Run the configured test suite:

```bash
npm test
```

Start the application using the script defined in `package.json`:

```bash
npm start
```

The exact startup command and application port depend on the project's `package.json` and server configuration.

## Deployment Configuration

The following AWS resources are used by the current deployment:

| Resource                    | Name                      |
| --------------------------- | ------------------------- |
| AWS Region                  | `us-east-2`               |
| CodePipeline                | `myapp-pipeline`          |
| ECR repository              | `myapp-repo`              |
| ECS cluster                 | `myapp-cluster`           |
| ECS service                 | `myapp-service`           |
| CodeDeploy application      | `myapp-codedeploy`        |
| CodeDeploy deployment group | `myapp-dg`                |
| Application Load Balancer   | `myapp-alb`               |
| CloudWatch alarm            | `myapp-ecs-high-cpu`      |
| SNS topic                   | `myapp-cloudwatch-alerts` |

These resource names document the project's configuration. AWS resource identifiers, endpoints, and environment-specific settings should be supplied through the relevant AWS configuration rather than hard-coded into application code.

## Screenshots and Evidence

The `docs/screenshots/` directory is intended to contain evidence of the completed deployment workflow.

Recommended screenshots include:

| Screenshot                    | Evidence                                       |
| ----------------------------- | ---------------------------------------------- |
| `01-codepipeline-success.png` | Successful pipeline execution                  |
| `02-codebuild-success.png`    | Successful build and test stage                |
| `03-ecr-image.png`            | Container image in Amazon ECR                  |
| `04-codedeploy-success.png`   | Successful CodeDeploy deployment               |
| `05-ecs-service.png`          | Healthy ECS service and running task           |
| `06-live-application.png`     | Application accessed through the load balancer |
| `07-manual-approval.png`      | Manual approval stage                          |
| `08a-cloudwatch-alarm.png`    | CloudWatch CPU alarm configuration             |
| `08b-sns-topic.png`           | SNS topic and confirmed email subscription     |

Use screenshots that reflect the actual state of the AWS environment. Add the architecture diagram as `docs/pipeline-diagram.png` if it has been created.

## Key Learning Outcomes

This project demonstrates practical experience with:

- Continuous integration and continuous deployment.
- GitHub-based source control workflows.
- Automated application testing.
- Docker containerization.
- Amazon ECR image management.
- Amazon ECS and Fargate deployments.
- AWS CodeDeploy blue/green deployment concepts.
- Application Load Balancer integration.
- Manual release approval.
- CloudWatch metric alarms.
- SNS email notification configuration.
- AWS IAM permissions and service integration troubleshooting.

## Future Improvements

Potential improvements include:

- Add a verified end-to-end notification test.
- Add dashboards for CPU, memory, task count, and application health.
- Integrate security and container image vulnerability scanning.
- Add infrastructure as code using AWS CloudFormation or Terraform.
- Add automated rollback verification and deployment health checks.
- Improve test coverage and add integration tests.
- Document recovery procedures and operational troubleshooting.

## Conclusion

This capstone demonstrates an AWS-based CI/CD workflow that connects source control, automated builds, container image storage, ECS deployment, traffic management, and monitoring.

It provides a foundation for building more reliable, repeatable, and observable application delivery workflows on AWS.

---

**Author:** Oliver Moosberger

**Repository:** [olivermooz-117/aws-cicd-capstone](https://github.com/olivermooz-117/aws-cicd-capstone)# AWS CI/CD Capstone Project

An end-to-end Continuous Integration and Continuous Deployment (CI/CD) project that automates application testing, container image building, and deployment to AWS using managed DevOps services.

The project demonstrates how to build a repeatable deployment pipeline using GitHub, AWS CodePipeline, AWS CodeBuild, Amazon ECR, AWS CodeDeploy, Amazon ECS, and Amazon CloudWatch.

\## Table of Contents

\- [Project Overview]\(#project-overview)

\- [Architecture]\(#architecture)

\- [AWS Services Used]\(#aws-services-used)

\- [CI/CD Workflow]\(#cicd-workflow)

\- [Application and Containerization]\(#application-and-containerization)

\- [Deployment Strategy]\(#deployment-strategy)

\- [Monitoring and Notifications]\(#monitoring-and-notifications)

\- [Repository Structure]\(#repository-structure)

\- [Prerequisites]\(#prerequisites)

\- [Local Setup and Testing]\(#local-setup-and-testing)

\- [Deployment Configuration]\(#deployment-configuration)

\- [Screenshots and Evidence]\(#screenshots-and-evidence)

\- [Key Learning Outcomes]\(#key-learning-outcomes)

\- [Future Improvements]\(#future-improvements)

\## Project Overview

The goal of this project is to implement an automated deployment workflow that moves application changes from source control to a running application on AWS.

When code is pushed to the GitHub repository, the pipeline retrieves the source code, runs the configured build and test steps, builds a Docker image, and publishes the image to Amazon ECR. The deployment stage then uses AWS CodeDeploy and Amazon ECS to deploy the updated application.

A manual approval stage provides an additional control before deployment proceeds.

CloudWatch monitors ECS CPU utilization, while Amazon SNS provides email notifications when the configured alarm enters the alarm state.

\### Project goals

\- Automate application builds and deployments.

\- Integrate source control with AWS CI/CD services.

\- Run automated tests as part of the build process.

\- Package the application into a Docker container.

\- Store container images in Amazon ECR.

\- Deploy the application to Amazon ECS.

\- Implement a controlled deployment workflow with manual approval.

\- Configure blue/green deployment using AWS CodeDeploy.

\- Monitor ECS CPU utilization with CloudWatch.

\- Configure email notifications using Amazon SNS.

\## Architecture

The deployment workflow follows this sequence:

\`\`\`text

Developer

&#x20;  |

&#x20;  v

GitHub Repository

&#x20;  |

&#x20;  v

AWS CodePipeline

&#x20;  |

&#x20;  v

Manual Approval

&#x20;  |

&#x20;  v

AWS CodeBuild

&#x20;  |

&#x20;  +--> Install Dependencies

&#x20;  +--> Run Tests

&#x20;  +--> Build Docker Image

&#x20;  +--> Push Image to Amazon ECR

&#x20;  |

&#x20;  v

AWS CodeDeploy

&#x20;  |

&#x20;  v

Amazon ECS (Fargate)

&#x20;  |

&#x20;  v

Application Load Balancer

&#x20;  |

&#x20;  v

Users Access the Application

Monitoring:

Amazon ECS --> Amazon CloudWatch Alarm

&#x20;                        |

&#x20;                        v

&#x20;                   Amazon SNS

&#x20;                        |

&#x20;                        v

&#x20;                   Email Alerts

\`\`\`

The exact stage ordering and actions are determined by the configured CodePipeline.

\## AWS Services Used

\| Service | Purpose |

\|---|---|

\| GitHub | Source code management and version control |

\| AWS CodePipeline | Orchestrates the CI/CD workflow |

\| AWS CodeBuild | Builds the application, runs configured tests, and prepares the container image |

\| Amazon ECR | Stores Docker container images |

\| Amazon ECS | Runs the containerized application |

\| AWS Fargate | Provides serverless container compute for ECS tasks |

\| AWS CodeDeploy | Manages the configured blue/green deployment process |

\| Application Load Balancer | Routes incoming application traffic |

\| Amazon CloudWatch | Monitors ECS CPU utilization and evaluates alarm conditions |

\| Amazon SNS | Sends email notifications from the CloudWatch alarm |

\*\*AWS Region:\*\* US East (Ohio), \`us-east-2\`

\## CI/CD Workflow

\### 1. Source Control

Application source code and deployment configuration are maintained in GitHub.

Repository: [aws-cicd-capstone]\([https://github.com/olivermooz-117/aws-cicd-capstone](https://github.com/olivermooz-117/aws-cicd-capstone))

Changes pushed to the configured source branch trigger the pipeline according to its source-stage configuration.

\### 2. Continuous Integration with CodeBuild

AWS CodeBuild executes the instructions defined in \`buildspec.yml\`.

The configured build process supports application dependency installation, automated testing, and Docker image preparation.

\### 3. Container Image Management with Amazon ECR

The application is packaged into a Docker image using the project's \`Dockerfile\`.

The image is published to Amazon ECR so it can be used by the ECS task definition during deployment.

\### 4. Manual Approval

The pipeline includes a manual approval stage.

This provides an opportunity to review a release before allowing the pipeline to proceed to deployment.

\### 5. Deployment with CodeDeploy and ECS

AWS CodeDeploy manages the configured deployment group and blue/green deployment process for the ECS application.

The new application version is deployed through ECS, and the Application Load Balancer provides the entry point for application traffic.

\### 6. Application Access

Users access the deployed application through the Application Load Balancer rather than connecting directly to an individual container task.

\## Application and Containerization

The project uses a Node.js application with Express and includes an automated test suite.

The Dockerfile defines how the application is packaged into a container image.

Key application and deployment files include:

\- \`src/app.js\` — application logic.

\- \`src/server.js\` — application server entry point.

\- \`tests/app.test.js\` — application tests.

\- \`Dockerfile\` — container image instructions.

\- \`buildspec.yml\` — CodeBuild instructions.

\- \`appspec.yml\` — CodeDeploy deployment specification.

\- \`taskdef.json\` — ECS task definition configuration.

\## Deployment Strategy

The project uses AWS CodeDeploy with an ECS deployment group configured for blue/green deployment.

Blue/green deployment supports introducing a new application version separately from the currently serving version. Traffic can be shifted according to the deployment configuration.

This approach helps control releases and provides a structured way to manage application updates.

The pipeline also incorporates manual approval before the deployment stage.

\## Monitoring and Notifications

\### Amazon CloudWatch

A CloudWatch metric alarm named
