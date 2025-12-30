# NextGen Portfolio (AWS)

This is a replica of my static portfolio website, deployed on AWS using Amplify Hosting with continuous deployment.

## What this repo demonstrates
- Static frontend hosted on AWS Amplify Hosting
- CI/CD: every push to `main` triggers a redeploy
- Cost-safe setup: Free Tier + budget alerts enabled

## Tech
HTML, CSS, JavaScript, AWS Amplify Hosting

## Deploy notes
Amplify uses `amplify.yml` to publish files from the repo root (no build step).

## Next steps (planned)
- Add serverless backend: API Gateway + Lambda (Node.js) + DynamoDB
- Contact form endpoint + admin-managed content
