# Neon Wallet Mobile

## Description
Everything a self-custodial wallet should be with everything you need to explore and make transactions in the Neo 3, Neo Legacy, Neo X, Bitcoin, Solana, Ethereum, EVMs and other blockchains.

## Installation
- [Play Store (Android)](https://play.google.com/store/apps/details?id=io.cityofzion.neon)
- [App Store (iOS)](https://apps.apple.com/us/app/neon-wallet-mobile/id1530111452)

## Development
Run the development mode:
```bash
# Install dependencies
npm i

# Open application in Android
npm run android

# Open application in iOS
npm run ios
```

## Environment Configuration
Create a `.env` file in the project root with the following variables:
```env
EXPO_PUBLIC_UNLIMIT_MERCHANT_ID=00000000-0000-0000-0000-000000000000
EXPO_PUBLIC_UNLIMIT_BUY_TOKENS_IFRAME_URL=https://onramp.com
EXPO_PUBLIC_UNLIMIT_SELL_TOKENS_IFRAME_URL=https://offramp.com

EXPO_PUBLIC_CLICK_UP_API_KEY=pk_123456789
EXPO_PUBLIC_CLICK_UP_LIST_ID=123456789
EXPO_PUBLIC_CLICK_UP_ASSIGNEE_ID=123456789
```

## Technologies Used
- **React Native**
- **TypeScript**
- **Expo**
- **Kotlin** (for Android native code)
- **Swift** (for iOS native code)

## Translation (Optional)
This project uses a [Claude Code](https://claude.ai/code) skill to keep all locale files up-to-date.

**Prerequisites**
- Claude Code CLI installed and authenticated

**Running translations**

After modifying English locale files in `src/shared/locales/en/`, run:

```bash
npm run translate
```

The skill detects changed keys via `git diff`, then translates additions, updates, and deletions into all supported languages (`de`, `pt-br`, `zh`, `zh-Hant`).

**Important**
- Only modify files in the `en/` locale directory — other language files are managed automatically
- Commit your English changes before running the script (it will refuse to run if non-English locales have uncommitted changes)
