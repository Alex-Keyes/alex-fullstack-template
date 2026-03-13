# FastAPI to Supabase Migration Design

## Overview

Migrate the fullstack template from a FastAPI + Docker + Postgres backend to a Supabase-backed frontend-only architecture. The template is a reusable starter project that gets cloned and git-history-wiped for each new project.

## Goals

- Remove all FastAPI, Docker, and auto-generated OpenAPI client code
- Replace backend auth with Supabase Auth via `@supabase/supabase-js`
- Keep the existing frontend stack (Chakra UI v3, TanStack Router, TanStack Query, Biome, Vite)
- Keep the landing page, theme, and responsive navbar as-is
- Provide working auth pages (login, signup, password recovery/reset, settings) wired to Supabase
- No sample CRUD pages — keep it minimal so cloned projects start clean

## What Gets Deleted

### Entire directories/files

- `backend/` — entire directory (FastAPI app, Alembic migrations, Dockerfile, etc.)
- `docker-compose.yml` and `docker-compose.override.yml`
- `scripts/`
- `frontend/src/client/` — auto-generated OpenAPI TypeScript SDK
- `frontend/src/components/Admin/` — AddUser, EditUser, DeleteUser
- `frontend/src/components/Items/` — AddItem, EditItem, DeleteItem
- `frontend/src/components/Pending/` — PendingUsers, PendingItems
- `frontend/src/components/Common/UserActionsMenu.tsx`
- `frontend/src/components/Common/ItemActionsMenu.tsx`
- `frontend/src/routes/_layout/admin.tsx`
- `frontend/src/routes/_layout/items.tsx`
- `frontend/openapi-ts.config.ts`

### Dependencies removed from package.json

- `axios`
- `form-data`
- `@hey-api/openapi-ts`

### Scripts removed from package.json

- `generate-client`

## What Gets Added

### New dependency

- `@supabase/supabase-js`

### New files

#### `frontend/src/lib/supabase.ts`

Supabase client initialization:

- Imports `createClient` from `@supabase/supabase-js`
- Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `import.meta.env`
- Exports a singleton `supabase` client instance

#### `frontend/src/hooks/useAuth.ts` (full rewrite)

AuthProvider + useAuth hook:

- `AuthProvider` — React context provider component
  - On mount, calls `supabase.auth.getSession()` for initial state
  - Subscribes to `supabase.auth.onAuthStateChange()` to keep session/user in sync
  - Stores `user`, `session`, and `loading` in state
  - Cleans up subscription on unmount
- `useAuth()` — hook that consumes the context, returns:
  - `user` — current Supabase User object or null
  - `session` — current Session or null
  - `loading` — boolean, true while initial session is being resolved
  - `signUp(email, password, metadata)` — wraps `supabase.auth.signUp()`
  - `signIn(email, password)` — wraps `supabase.auth.signInWithPassword()`
  - `signOut()` — wraps `supabase.auth.signOut()`
  - `resetPassword(email)` — wraps `supabase.auth.resetPasswordForEmail()`
  - `updatePassword(newPassword)` — wraps `supabase.auth.updateUser({ password })`

#### `frontend/.env.example`

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## What Gets Modified

### `frontend/src/main.tsx`

- Remove all OpenAPI configuration (`OpenAPI.BASE`, `OpenAPI.TOKEN` resolver)
- Remove OpenAPI-related imports
- Wrap app in `<AuthProvider>`
- Simplify QueryClient — remove the global 401/403 error handler that cleared localStorage tokens (Supabase manages sessions internally)

### Auth route pages

#### `routes/login.tsx`

- Replace `loginMutation` (which called `LoginService.loginAccessToken()`) with `useAuth().signIn(email, password)`
- Error handling uses Supabase's `AuthError` instead of `ApiError`
- Same form UI preserved

#### `routes/signup.tsx`

- Replace `signUpMutation` (which called `UsersService.registerUser()`) with `useAuth().signUp(email, password, { data: { full_name } })`
- Full name stored in Supabase user metadata
- Same form UI preserved

#### `routes/recover-password.tsx`

- Replace `LoginService.recoverPassword()` with `useAuth().resetPassword(email)`
- Calls `supabase.auth.resetPasswordForEmail()` which sends a recovery email

#### `routes/reset-password.tsx`

- Replace token-from-URL-param approach with `useAuth().updatePassword(newPassword)`
- Supabase handles recovery tokens automatically: when the user clicks the email link, Supabase JS picks up the token from the URL hash and establishes a session, so `updatePassword()` works without manual token extraction

#### `routes/_layout.tsx`

- Replace `isLoggedIn()` localStorage check with `useAuth().user` check for route guarding

#### Login/signup `beforeLoad` guards

- Replace `isLoggedIn()` with auth context check to redirect authenticated users

### Settings page

#### `routes/_layout/settings.tsx`

- Keep "My Profile", "Password", "Appearance" tabs
- Remove "Danger zone" tab (account deletion requires service role key, unsafe client-side)
- Remove superuser tab filtering (no admin concept in template)

#### `components/UserSettings/UserInformation.tsx`

- Replace `UsersService.updateUserMe()` with `supabase.auth.updateUser({ data: { full_name, email } })`
- For email changes, Supabase sends a confirmation email automatically

#### `components/UserSettings/ChangePassword.tsx`

- Replace `UsersService.updatePasswordMe()` with `supabase.auth.updateUser({ password: newPassword })`
- Remove "current password" field — Supabase doesn't require it for authenticated session password changes

### Deleted settings components

- `components/UserSettings/DeleteAccount.tsx`
- `components/UserSettings/DeleteConfirmation.tsx`

### Navigation components

#### `components/Common/Navbar.tsx`

- Use `useAuth()` hook instead of localStorage checks to determine logged-in state

#### `components/Common/UserMenu.tsx`

- Use `useAuth().signOut()` instead of the old `logout()` that cleared localStorage

### Utilities

#### `frontend/src/utils.ts`

- Keep `emailPattern`, `namePattern`, `passwordRules`, `confirmPasswordRules`
- Rewrite `handleError()` to handle Supabase `AuthError` shape (`error.message`) instead of OpenAPI `ApiError` shape (`error.body.detail`)

### Documentation

#### `development.md`

- Update to reflect new setup: no Docker, no backend, Supabase-based
- Document env vars needed
- Document that `supabase init` should be run per-project

## What Stays Unchanged

- `frontend/src/routes/__root.tsx` — root route with devtools
- `frontend/src/routes/_layout/index.tsx` — landing page (hero, features, pricing, FAQs)
- `frontend/src/components/ui/` — all generic Chakra UI wrapper components
- `frontend/src/hooks/useCustomToast.ts` — toast helper
- `frontend/src/theme.tsx` and `frontend/src/theme/` — theme configuration
- All Vite, TypeScript, and Biome configuration
- `frontend/src/components/Common/NotFound.tsx`

## Final Repository Structure

```
frontend/
  src/
    components/
      Common/        Navbar.tsx, UserMenu.tsx, NotFound.tsx
      UserSettings/  UserInformation.tsx, ChangePassword.tsx, Appearance.tsx
      ui/            button, field, password-input, dialog, drawer, menu,
                     pagination, color-mode, toaster, link-button,
                     close-button, skeleton, checkbox, radio, input-group,
                     provider
    hooks/           useAuth.ts, useCustomToast.ts
    lib/             supabase.ts
    routes/
      __root.tsx
      _layout.tsx
      _layout/
        index.tsx    (landing page)
        settings.tsx
      login.tsx
      signup.tsx
      recover-password.tsx
      reset-password.tsx
    theme/           button.recipe.ts
    theme.tsx
    utils.ts
    main.tsx
    vite-env.d.ts
  .env.example
  biome.json
  index.html
  package.json
  tsconfig.json
  tsconfig.build.json
  tsconfig.node.json
  vite.config.ts
development.md
```

## Architecture Decisions

1. **No `supabase/` directory in template** — each cloned project runs `supabase init` to create its own. Avoids stale config.
2. **No sample CRUD** — auth pages already demonstrate the Supabase integration pattern. Less to delete when starting a real project.
3. **Thin `useAuth()` hook over bare `supabase-js`** — ~30 lines that handle session listening and expose a clean API. Prevents every component from importing supabase directly and wiring up auth state.
4. **No `@supabase/ssr`** — unnecessary for a pure client-side SPA with Vite + TanStack Router.
5. **No client-side account deletion** — requires service role key which shouldn't be exposed client-side. Can be added via Edge Function per-project if needed.
6. **Supabase manages sessions in localStorage internally** — no manual token management needed, simplifying the auth flow significantly vs the old JWT approach.
