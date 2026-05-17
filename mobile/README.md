# Truly Sri Lanka — React Native App

Expo-based mobile app mirroring the web version of the Truly Sri Lanka travel platform.

## Quick Start

```bash
cd mobile
npm install
npx expo start
```

Then press **a** for Android emulator, **i** for iOS simulator, or scan the QR code with **Expo Go** on your phone.

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Hero slider, featured destinations, packages, stats, CTA |
| **Destinations** | All 16 destinations with region filter + search |
| **Packages** | All 9 tour packages with category filter |
| **Book** | 3-step booking wizard → results with recommended packages |

## Booking Wizard Flow

1. **Route Selection** — Pick pickup & destination from 16 Sri Lanka locations
2. **Dates & Guests** — Enter check-in/check-out (YYYY-MM-DD) and guest count
3. **Vehicle Selection** — Car ($45/day), Van ($65/day), Tuk-Tuk ($25/day), Bike ($20/day) with live pricing
4. **Results** — Trip summary + estimated cost + 3 recommended packages

## Tech Stack

- **Expo SDK 53** (React Native 0.76)
- **React Navigation** — Bottom Tab + Native Stack
- **expo-linear-gradient** — Gradient overlays on hero/cards
- **@expo/vector-icons** — Ionicons throughout

## Notes

- Placeholder images are served by `picsum.photos` for development. Replace the `image` fields in `src/data/` with your actual hosted image URLs.
- Date input uses text format `YYYY-MM-DD`. You can integrate `@react-native-community/datetimepicker` for a native calendar picker.
- Contact phone: +94 72 280 0251 (shown in Home header)
