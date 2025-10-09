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

#### Access Token

1. Go to [Adobe Developer Console](https://developer.adobe.com/console)
2. Create or select your project
3. Add the "Adobe Experience Platform Launch API"
4. Generate a JWT or OAuth token
5. Copy the access token

#### Organization ID

- Found in Adobe Admin Console under your organization profile
- Format: `ORG123456789@AdobeOrg`

#### Company ID

- Use the Reactor API to list companies: `GET /companies`
- Or found in the Launch UI URL when viewing properties
- Format: `CO1234567890abcdef1234567890abcdef`

### 3. Configure Your .env File

```bash
ACCESS_TOKEN=your_jwt_or_oauth_token_here
ORG_ID=your_org_id@AdobeOrg
COMPANY_ID=CO1234567890abcdef1234567890abcdef
REACTOR_URL=https://reactor.adobe.io  # Optional, defaults to production
```

### 4. Run Integration Tests

```bash
npm run integration-tests
```

## Security Notes

- ✅ `.env` files are automatically excluded from version control
- ✅ Use `.env.example` to document required variables without exposing values
- ✅ Credentials are loaded at runtime, never hardcoded
- ⚠️ Keep your access tokens secure and rotate them regularly
- ⚠️ Never commit actual credentials to the repository

## CI/CD Setup

For continuous integration, set environment variables in your CI platform:

### GitHub Actions

```yaml
env:
  ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
  ORG_ID: ${{ secrets.ORG_ID }}
  COMPANY_ID: ${{ secrets.COMPANY_ID }}
```

### Other CI Platforms

Set the same environment variables in your CI configuration.

## Staging vs Production

- **Production**: `REACTOR_URL=https://reactor.adobe.io` (default)
- **Staging**: `REACTOR_URL=https://reactor-stage.adobe.io`

Use staging for development and testing to avoid affecting production data.
