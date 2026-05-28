# KoinX - Tax Loss Harvesting Tool

A tax loss harvesting interface built as part of the KoinX Frontend Intern Assignment.

## What it does

Shows your current capital gains and lets you select holdings to see how selling them would affect your tax liability in real time.

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- Context API (state management)

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/iamayushkarma/koinx-tax-loss-harvesting.git
cd koinx-tax-loss-harvesting
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
src/
├── api/              # Mock API functions (holdings + capital gains)
├── components/
│   ├── CapitalGainsCard/   # Pre and After Harvesting cards
│   ├── HoldingsTable/      # Selectable holdings table
│   ├── Tooltip/            # Reusable tooltip component
│   ├── Loader/             # Loading state
│   └── ErrorState/         # Error state with retry
├── context/          # HarvestingContext — global state and logic
└── utils/            # Number formatters
```

## Features

- Pre and After Harvesting capital gains cards
- Select individual holdings or all at once to simulate tax harvesting
- Real-time update of gains as you select/deselect
- Savings indicator when tax liability reduces
- Sortable holdings table by short-term or long-term gain
- View All / Show Less toggle for the holdings list
- Tooltips on coin names, prices and gain values
- Collapsible disclaimer banner
- Loader and error states with retry support
- Responsive layout — works on mobile and desktop

## Assumptions

- All prices and gains are displayed in USD
- Mock APIs use local data with a simulated 800ms delay to mimic real network calls
- Duplicate coin symbols (e.g. two USDC entries) are handled using coin + coinName as a unique key

## Deployment

Deployed on Vercel: https://koinx-harvest.vercel.app/
