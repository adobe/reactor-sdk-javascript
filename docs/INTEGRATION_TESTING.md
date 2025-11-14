# Integration Testing Setup

## Overview

The integration tests require Adobe Reactor API credentials to run against the actual Adobe Experience Platform Launch service.

## Setup Instructions

### 1. Create Environment File

```bash
# Copy the example file and fill in your credentials
cp .env.example .env
```

### 2. Get Your Credentials

Refer to your tech account integration for your Client ID and Client Secret. You can get your company by logging into the
the Adobe Tags Launch UI and navigating to Data Collection.

#### Client ID, Client Secret, and Organization ID

- Found in Adobe Admin Console under your organization profile
- Organization ID Format: `ORG123456789@AdobeOrg`

#### Company ID

- You can get your company by logging into the the Adobe Tags Launch UI and navigating to Data Collection.
- Format: `CO1234567890abcdef1234567890abcdef`

### 3. Configure Your .env File

see `.env.example` for reference. Fill in the values you obtained in the previous step.

```bash
RSDK_ADOBE_CLIENT_ID=your_client_id
RSDK_ADOBE_CLIENT_SECRET=your_client_secret
RSDK_ADOBE_SCOPES=sane_defaults_in_.env.example
RSDK_ADOBE_ORG_ID=your_org_id@AdobeOrg
RSDK_ADOBE_REACTOR_COMPANY_ID=your_company_CO12345678...
RSDK_ADOBE_REACTOR_URL=https://reactor-stage.adobe.io
RSDK_ADOBE_ENVIRONMENT=stage
```

### 4. Run Integration Tests

```bash
npm run test:integration
```

## Security Notes

- ✅ `.env` files are automatically excluded from version control
- ✅ Use `.env.example` to document required variables without exposing values
- ✅ Access Token is fetched at runtime, and exported as an process ENV variable
- ⚠️ Keep your Client ID and Client Secret secure
- ⚠️ Never commit actual credentials to the repository

## CI/CD Setup

- Ensure that everything from .env is placed in repository secrets

## Staging vs Production

- You'll need a tech account for each environment and then adjust RSDK_ADOBE_ENVIRONMENT and RSDK_ADOBE_REACTOR_URL accordingly.
