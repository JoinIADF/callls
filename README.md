# Dogtopia OpsHub

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JoinIADF/generated-app-20251020-224739)

Dogtopia OpsHub is a visually stunning, mobile-first internal operations platform designed to streamline daily tasks at Dogtopia facilities. It replaces a cumbersome legacy system with an intuitive, high-performance application built on Cloudflare's edge network. The application provides role-based access for Front Desk Staff, Shift Leads, and Managers, ensuring each user has a tailored experience. Core modules include a Meet & Greet Tracker for managing new client evaluations, a Pet Parent Engagement log for tracking interactions, an Observations module for dog behavior notes, a Shift Lead reporting tool for daily summaries, and a comprehensive Manager Dashboard for KPI visualization and trend analysis. The entire experience is crafted with exceptional attention to visual detail, featuring a sophisticated design system, fluid animations, and a user flow optimized for speed and clarity in a fast-paced environment.

## Key Features

-   **Meet & Greet Tracker**: Log, track, and manage the conversion of new client appointments.
-   **Pet Parent Engagement**: Capture loyalty, appreciation, and ongoing parent feedback.
-   **Observations & Dog Notes**: Log behavioral and socialization notes for each dog.
-   **Shift Lead Reports**: A templated form for daily end-of-shift summaries.
-   **Manager Dashboard**: An analytics-focused view for KPIs, trends, and store comparisons.
-   **Role-Based Access**: Tailored UI and permissions for Front Desk, Shift Leads, and Managers.
-   **Mobile-First Design**: Optimized for quick data entry on the go in a fast-paced environment.

## Technology Stack

-   **Frontend**: React, Vite, React Router, Tailwind CSS
-   **UI Components**: shadcn/ui, Lucide React, Framer Motion
-   **State Management**: Zustand
-   **Backend**: Hono on Cloudflare Workers
-   **Storage**: Cloudflare Durable Objects
-   **Data Validation**: Zod
-   **Charting**: Recharts
-   **Typescript**: End-to-end type safety

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   A Cloudflare account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/dogtopia-opshub.git
    cd dogtopia-opshub
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

## Development

To start the local development server, which includes both the Vite frontend and the Hono backend on the same port, run:

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

### Project Structure

-   `src/`: Contains the React frontend application code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utility functions and API client.
    -   `hooks/`: Custom React hooks.
-   `worker/`: Contains the Hono backend code for the Cloudflare Worker.
    -   `index.ts`: The main entry point for the worker.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Data models and logic for interacting with Durable Objects.
-   `shared/`: Contains TypeScript types and interfaces shared between the frontend and backend.

## Deployment

This project is designed for seamless deployment to Cloudflare Pages.

1.  **Login to Wrangler:**
    If you haven't already, authenticate with your Cloudflare account.
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    The `deploy` script will build the Vite application and deploy it along with the worker to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/JoinIADF/generated-app-20251020-224739)