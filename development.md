# Supabase Fullstack Template - Development

## Overview

This project is a frontend-only architecture backed by Supabase. It uses React (Vite), Chakra UI, TanStack Router, and TanStack Query.

## Setup

1.  **Clone and Clean:**
    Clone the repository and (optionally) wipe the git history if starting a new project.

2.  **Supabase Project:**
    - Create a new project at [supabase.com](https://supabase.com).
    - Enable Email Auth in the Authentication settings.
    - Run `supabase init` in the root (optional, if you want to use Supabase CLI for migrations).

3.  **Environment Variables:**
    Copy `frontend/.env.example` to `frontend/.env` and fill in your Supabase URL and Anon Key:
    ```bash
    cp frontend/.env.example frontend/.env
    ```
    ```dotenv
    VITE_SUPABASE_URL=your-project-url
    VITE_SUPABASE_ANON_KEY=your-anon-key
    ```

4.  **Install Dependencies:**
    ```bash
    cd frontend
    npm install
    ```

5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## Architecture

- **Frontend:** Vite + React + TypeScript
- **UI Components:** Chakra UI v3
- **Routing:** TanStack Router
- **Data Fetching:** TanStack Query
- **Authentication:** Supabase Auth via `@supabase/supabase-js`
- **Linting & Formatting:** Biome

## Authentication Flow

The app uses a custom `useAuth` hook and `AuthProvider` (in `frontend/src/hooks/useAuth.ts`) to manage session state. 

- On mount, it checks for an existing session.
- It listens for auth state changes (sign in, sign out, user updates).
- Protected routes are guarded in `frontend/src/routes/_layout.tsx`.

## Key Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run Biome linting and formatting
