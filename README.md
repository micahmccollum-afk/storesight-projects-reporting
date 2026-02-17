# Storesight - Revenue & Product Report

A clean, visual dashboard for tracking marketplace project revenue and product performance. Upload a CSV export from Tableau and instantly see KPIs, charts, and a searchable project table.

## Features

- **KPI Cards** - Total Revenue, Total Projects, Average Revenue per Project
- **Revenue by Product** - Horizontal bar chart showing top products by earned revenue
- **Revenue Over Time** - Area chart showing monthly revenue trends
- **Project Table** - Searchable, sortable table with project details
- **CSV Upload** - Drag-and-drop or click to upload; handles UTF-16, TSV, and CSV formats automatically

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and click **Import Project**
2. Select your GitHub repo
3. Vercel auto-detects Next.js — click **Deploy**

### 3. Add Blob Storage

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** > **Blob**
3. Follow the prompts — Vercel will automatically add the `BLOB_READ_WRITE_TOKEN` to your project's environment variables
4. **Redeploy** the project so it picks up the new token

That's it. Visit your deployment URL and upload a CSV.

## Local Development

### Prerequisites

- Node.js 18+ and npm

### Setup

```bash
npm install
cp .env.example .env.local
```

For local development with Blob storage, you need a `BLOB_READ_WRITE_TOKEN`. You can get one by:
1. Creating a Vercel project and adding Blob storage (see above)
2. Copying the token from your Vercel project settings > Environment Variables
3. Pasting it into `.env.local`

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## How to Use

1. Open the "All Project Activity" dashboard in Tableau
2. Click the download icon and export as CSV (Crosstab)
3. Upload the CSV file to the dashboard
4. View your revenue data, product breakdown, and project details

Each new upload replaces the previous data.

## Tech Stack

- **Next.js** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Bar and area chart visualizations
- **TanStack Table** - Sortable, searchable data table
- **TanStack Query** - Server state management and caching
- **Vercel Blob** - Persistent file storage for CSV data

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── data/route.ts       # GET - reads CSV from Blob, returns dashboard data
│   │   └── upload/route.ts     # POST - uploads CSV to Blob storage
│   ├── globals.css             # Design tokens and base styles
│   ├── layout.tsx              # Root layout with providers
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── connection-banner.tsx       # "No data" message
│   ├── csv-upload.tsx              # Drag-and-drop CSV upload
│   ├── dashboard-header.tsx        # App header with upload + refresh
│   ├── kpi-cards.tsx               # Revenue, Projects, Avg Revenue cards
│   ├── project-table.tsx           # Searchable project data table
│   ├── providers.tsx               # React Query provider
│   ├── revenue-by-product-chart.tsx  # Horizontal bar chart
│   └── revenue-over-time-chart.tsx   # Area chart
├── hooks/
│   └── use-dashboard-data.ts   # Data fetching hook
└── lib/
    ├── csv-parser.ts           # CSV parsing utility
    ├── data-processing.ts      # KPI computation, product/time aggregation
    ├── types.ts                # TypeScript interfaces
    └── utils.ts                # Formatting utilities
```
