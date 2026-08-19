# Messmate

Messmate is a responsive Bangladesh mess management dashboard for shared student and bachelor houses. It gives a manager a calm daily view of collection, meals, room occupancy, member payment status, bazar activity, and quick entry actions.

## Current Features

- Responsive dashboard for desktop and mobile
- Collection, member, meal, and due summaries in Bangladeshi Taka
- Cash-flow visualization and room/seat occupancy view
- Member payment overview and recent activity feed
- Sidebar navigation for members, rooms, meals, bazar, payments, expenses, and reports
- Working quick-action feedback and Add member modal
- GitHub Actions checks for install, lint, typecheck, and production build

## Tech Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4 with a focused custom CSS design system
- Ready for Vercel deployment

## Requirements

- Node.js 22 or newer
- npm 10 or newer
- PostgreSQL for the production data layer planned for the next integration phase

## Local Development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open http://localhost:3000.

Validate the project with:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment Variables

`.env.example` is safe to commit. Put real values in `.env.local` locally and in the deployment provider’s secret settings:

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: long random secret used by the authentication layer
- `NEXT_PUBLIC_APP_URL`: public site URL, such as `https://messmate.example.com`

No credentials or admin passwords belong in the repository.

## Production Deployment

1. Push the repository to GitHub.
2. Create a PostgreSQL database on Neon, Supabase, Railway, Render, or another managed provider.
3. Connect the GitHub repository to Vercel and keep the framework preset as Next.js.
4. Add `DATABASE_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` to Vercel Production environment variables.
5. Deploy. Every push to `main` is checked by `.github/workflows/ci.yml`.

The database schema, session authentication, migrations, admin bootstrap, and production CRUD API should be added before using this dashboard with live financial records. Keep migrations in `migrations/` and run them in CI or as a release step, never against a local-only database.

## Database and Admin Setup

The current repository is the UI foundation and intentionally does not invent a fake persistence layer. When the PostgreSQL integration is enabled, the release checklist is:

```bash
# example commands for the future database package
npm run db:migrate
npm run db:seed
npm run admin:create
```

The first admin account must be created from a one-time secure setup command with a password supplied interactively or through the platform secret manager. Do not hardcode demo credentials.

## GitHub Workflow

```bash
git init
git add .
git commit -m "Build Messmate dashboard"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

Review `.gitignore` before pushing and confirm `.env.local` is not staged.

## Troubleshooting

- If `next` is not recognized, run `npm install` again.
- If a deployment fails, verify all three environment variables are set for the active environment.
- If GitHub Actions fails, run the same `npm run lint`, `npm run typecheck`, and `npm run build` commands locally.

## License

Private project. Add the license that matches your intended distribution before publishing publicly.
