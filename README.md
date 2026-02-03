# Neon Wallet Mobile

## Description
An open source cross-platform light wallet for the NEO blockchain.

## Installation
- [Android Play Store](https://play.google.com/store/apps/details?id=io.cityofzion.neon&hl=en)
- [iOS App Store](https://apps.apple.com/us/app/neon-wallet-mobile/id1530111452)

## Environment Configuration
Create a `.env` file in the project root with the following variables:

```env
EXPO_PUBLIC_UNLIMIT_MERCHANT_ID=00000000-0000-0000-0000-000000000000
EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL=https://onramp.com
EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL=https://offramp.com

EXPO_PUBLIC_CLICK_UP_KEY=pk_123456789
EXPO_PUBLIC_CLICK_UP_LIST_ID=123456789
EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID=123456789
```


## Technologies Used
- **React Native**
- **TypeScript**
- **Expo**
- **Kotlin** (for Android native code)
- **Swift** (for iOS native code)

# Translation Script Guide (Optional)

This project includes an automated translation script to keep all locale files up-to-date across supported languages using the Google Cloud Translation API v3.

## Prerequisites

- **Google Cloud Project** with the Cloud Translation API enabled
- **Service Account Key** (JSON) with permissions for the Translation API

### Google Cloud Setup
- Go to the [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select an existing one.
- Enable the Cloud Translation API for your project.
- Create a Service Account with the "Cloud Translation API User" role.
- Download the service account key as a JSON file.
- Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of this file.

## Setting a Budget to Prevent Unexpected Charges
To ensure you never exceed the free tier of the Google Cloud Translation API and avoid unexpected charges, you can set a budget and configure alerts in your Google Cloud project.

### How to Set Up a Budget and Alerts
- Go to [Google Cloud Billing Budgets & Alerts](https://console.cloud.google.com/billing/budgets)
- Make sure you are in the correct billing account for your project.
- Click **"CREATE BUDGET"**.
- Name your budget (e.g., "Translation API Free Tier Limit").
- Set the **Scope** to your project or all projects as needed.
- Enter the amount that matches the free tier for the Translation API (e.g., $0.01 if you want to be alerted before any charges, or the USD equivalent of the free tier quota).
- Set alert thresholds (e.g., 50%, 90%, 100% of your budget).
- Add your email to receive notifications when your usage approaches or exceeds your budget.
- Review your settings and click **"Finish"**.

### Important Notes

- Only modify translation files in the `en` (English) locale directory
- The script will fail if there are uncommitted changes in other locale directories to prevent accidental overwrites
- New translation keys are automatically added to all languages
- Removed keys are automatically deleted from all languages
- Updated translations are re-translated to maintain consistency
