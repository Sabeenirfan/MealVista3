# Copilot Instructions for mealvista-frontend-main

## Project Overview
- **Frontend:** React Native (Expo) app in `mealvista-frontend-main/`
- **Backend:** Node.js/Express in `my-auth-backend/my-auth-backend/`
- **Purpose:** Meal planning, nutrition, and authentication platform.

## Key Architecture & Patterns
- **File-based routing:** All screens/pages are in `app/` (e.g., `app/home.tsx`, `app/profile.tsx`).
- **Component structure:** Shared UI in `components/`, constants in `constants/`, context providers in `contexts/`, and custom hooks in `hooks/`.
- **API integration:** API calls and auth logic in `lib/api.ts`, `lib/authService.ts`, etc.
- **State management:** Uses React Context (see `contexts/CartContext.tsx`, `contexts/FavoritesContext.tsx`).
- **Assets:** Images in `assets/images/`.

## Developer Workflows
- **Install dependencies:**
  ```bash
  npm install
  ```
- **Start frontend (Expo):**
  ```bash
  npx expo start
  ```
- **Reset project to blank state:**
  ```bash
  npm run reset-project
  ```
- **Backend scripts:** Run Node.js scripts in `my-auth-backend/my-auth-backend/` for admin, image, and data management (see script filenames and guides in that folder).

## Conventions & Practices
- **Image uploads:** Place images in `my-auth-backend/my-auth-backend/images/` and run `node upload-images.js` to sync with Cloudinary.
- **Image naming:** Must match ingredient names exactly (see `list-image-names.js`).
- **Do NOT commit `.expo/` folder** (local dev only).
- **Use TypeScript throughout.**
- **Follow Expo/React Native best practices for navigation and state.**

## Integration Points
- **Frontend-backend communication:** API endpoints are managed in `lib/api.ts` and backend `routes/`.
- **Authentication:** Handled via `lib/authService.ts` and backend scripts.

## References
- See `README.md` in both frontend and backend for more details.
- See backend markdown guides for admin/image setup.

---

**When in doubt, reference the relevant folder's README or markdown guides for project-specific workflows.**
