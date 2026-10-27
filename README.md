# Notifly — Creative Media OS

A media library interface for creatives: collect, sort, review and export images, videos, GIFs and web archives in one place.

> Early prototype (v0.1): the interface runs on sample data (`src/data/mock.ts`).

## Pages

- **Dashboard**: storage overview, heavy files, unused or untagged media.
- **Gallery**: every media item, filtered by type (images, videos, GIFs, archives).
- **Upload**: import files.
- **Collections** and **Favorites**: group media by project.
- **Archive**: saved web pages and archive URLs.
- **Analysis**: storage usage and media health.
- **Workflows**: review pipeline (Draft, Review, Approved, Published, Archived).
- **Settings**: profile, appearance, storage, export options.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · Zustand · Framer Motion · React Router · lucide-react

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

On Windows, you can also double-click `launch.bat`: it opens the browser and starts the dev server.

Other scripts:

```bash
npm run build      # type-check and production build
npm run preview    # serve the production build
npm run lint
```

## Structure

```
src/pages        one file per page
src/components   layout (header, sidebar) and UI components
src/store        global state (Zustand)
src/data         sample data
src/types        shared types
src/utils        formatting and export helpers
```
