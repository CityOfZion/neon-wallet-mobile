# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Expo dev client (clears cache)
npm run android      # Run on Android
npm run ios          # Run on iOS

# Code quality
npm run lint         # ESLint with auto-fix
npm run typecheck    # TypeScript type checking (tsc --noEmit)
npm run check        # lint + typecheck + check-env (runs all checks)

# Build
npm run prebuild     # Expo prebuild for native code generation

# Utilities
npm run translate    # Auto-translate English locale keys to other languages via Claude
npm run icon         # Regenerate SVG icons
```

There is no test framework configured — the project has no unit or integration tests.

## Architecture

### Entry Point & Providers

`src/main.js` bootstraps polyfills and Sentry, then renders `src/App.tsx`. `App.tsx` sets up all providers in order: Redux store, React Query, i18n, NativeWind, React Navigation, and lazy-loaded modals (Alert, Toaster, QrCodeScan, NFC).

### Helper Classes (Singletons)

`src/helpers/` contains static helper classes responsible for initializing and exposing services. Each follows the pattern of a static `setup()` method and static properties:

- `ReduxHelper` — creates the Redux store with persistence and migrations
- `I18nextHelper` — initializes i18n with detected locale
- `BlockchainServiceHelper` — aggregates all blockchain services (Neo3, NeoLegacy, NeoX, Bitcoin, Ethereum, Solana, Stellar)
- `WalletKitHelper` — WalletConnect v2 initialization
- `NativeWindHelper`, `SentryHelper`, `EnvHelper` — feature-specific setup

### State Management

Redux Toolkit with Redux Persist. Six slices in `src/store/reducers/`:

| Slice | Persisted | Purpose |
|---|---|---|
| `account` | Yes | Multi-account management |
| `wallet` | Yes | Private keys, addresses |
| `settings` | Yes | User preferences, selected networks |
| `notification` | Yes | Push notification state |
| `contact` | Yes | Address book |
| `utility` | No | Ephemeral UI state (modals, alerts, loading) |

Each slice includes a **migrations system** — when changing the persisted shape of a reducer, add a versioned migration entry. Actions are exported alongside reducers (e.g., `walletReducerActions`). Two listener middlewares handle side effects: network changes and language changes.

### Navigation

React Navigation v7 with native-stack and bottom-tabs. The root is `src/routes/stacks/RootStack`. Deep link schemes: `neon://`, `neon3://`, `wc://`. Screens live in `src/routes/screens/`, organized by flow.

### Data Fetching

TanStack React Query v5 handles all server state (balances, NFTs, transactions, token prices). Custom hooks in `src/hooks/` wrap query calls and expose loading/error states.

### Styling

NativeWind (Tailwind for React Native). Custom color palette defined in `tailwind.config.ts` (Neon, Asphalt, Green, Purple, etc.). Custom fonts: Sofia Pro (bold, medium, regular, semibold, light) loaded via `src/assets/fonts/`.

## Conventions

### Import Order (enforced by ESLint)

1. Side effects (e.g., `react-native-quick-crypto`)
2. React / React Native
3. External packages
4. Internal aliases: `@/components`, `@/helpers`, `@/hooks`, `@/layouts`, `@/routes`, `@/assets`
5. Relative imports
6. CSS/style files

The `@/*` alias maps to `./src/*`.

### TypeScript

Strict mode is enabled (`strict: true`, `strictNullChecks`, `noImplicitAny`). Avoid `any`; ESLint flags it. Use type-only imports where applicable (`import type { ... }`). Type definitions live in `src/types/` by domain (redux.ts, store.ts, screens.ts, etc.).

### i18n

English (`src/locales/en/`) is the source of truth. Running `npm run translate` uses the Claude Code `/translate` skill to propagate English changes to de, pt-BR, zh, and zh-Hant. Locale JSON keys are sorted by ESLint.

### Blockchain Services

All blockchain interactions go through `BlockchainServiceHelper` and the `@cityofzion/blockchain-service` abstraction. Hardware wallet (Ledger) flows use BLE via `@ledgerhq/react-native-*`. WalletConnect sessions are managed through `WalletKitHelper`.

### Environment Variables

Expected in `.env` with `EXPO_PUBLIC_` prefix (see `src/helpers/EnvHelper.ts` for required keys). `npm run check-env` validates them at build time.

### Git Workflow

Branch names and commit messages reference ClickUp task IDs (e.g., `CU-86ah218g4`). The main integration branch is `dev`. Pre-commit hooks run lint-staged via Husky.
