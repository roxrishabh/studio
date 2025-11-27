# Deploying Your Application

This document provides the necessary steps to deploy your Next.js application to Firebase App Hosting.

## Prerequisites

1.  **Node.js:** Ensure you have Node.js (v18 or later) installed on your machine.
2.  **Firebase CLI:** You need the Firebase Command Line Interface (CLI) to deploy your app. If you don't have it, install it globally using npm:
    ```bash
    npm install -g firebase-tools
    ```

## Deployment Steps

### 1. Log in to Firebase

Before you can deploy, you need to authenticate with Firebase. Run the following command in your terminal:

```bash
firebase login
```

This will open a browser window for you to log in to your Google account and grant the necessary permissions to the Firebase CLI.

### 2. Select Your Firebase Project

Your codebase should already be associated with a Firebase project (`studio-58932618-cf589` based on your project files). If you need to switch projects, you can use:

```bash
firebase use <your-project-id>
```

### 3. Deploy the Application

Once you are logged in and have the correct project selected, you can deploy your application. The project is already configured for Firebase App Hosting via the `apphosting.yaml` file.

To deploy, simply run the following command from the root of your project directory:

```bash
firebase deploy
```

The CLI will build your Next.js application and deploy it to Firebase App Hosting. After the deployment is complete, it will provide you with the URL where your application is live.

## Troubleshooting

### Billing Account Permission Error

You may encounter an error message like the one below during the setup process in the Firebase console or during deployment:

> You do not have permission to update the billing account associated with this project. Please check your permissions and try again.

This error occurs because your Google account does not have sufficient Identity and Access Management (IAM) permissions to link a billing account to the Firebase project.

**How to Fix:**

To resolve this, you need to be granted a role that allows you to manage billing. Ask a project owner or administrator to grant your account one of the following roles on the Google Cloud project:

*   **Billing Account Administrator:** Full control over the billing account.
*   **Billing Account User:** Can link projects to the billing account.

These permissions must be set in the **Google Cloud Console** under the "Billing" or "IAM & Admin" sections for the project you are trying to deploy to.
