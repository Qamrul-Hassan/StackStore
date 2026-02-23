# StackStore

Modern full-stack e-commerce project built with Next.js, Prisma, NextAuth, and Tailwind CSS.

Live demo: [https://stack-store.vercel.app/](https://stack-store.vercel.app/)

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (credentials-based auth)
- Resend / SMTP email support
- Stripe (optional)
- Cloudinary (optional)

## Features

- User signup/signin
- Email verification flow
- Admin login and admin panel
- Product listing and product details
- Cart and wishlist
- Checkout flow
- Contact form with email notification
- FAQ, Reviews, and Policy pages
- Responsive UI and cross-browser fixes

## Project Structure

- `app/` - routes, pages, API handlers
- `components/` - reusable UI and feature components
- `lib/` - shared utilities/services
- `prisma/` - schema, migrations, seed

## Environment Variables

Create `.env` in project root and set values similar to:

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="your-auth-secret"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="your-admin-password"

# Email (choose one provider setup)
RESEND_API_KEY="re_..."
EMAIL_FROM="StackStore <onboarding@resend.dev>"
CONTACT_RECEIVER_EMAIL="your-email@example.com"

# SMTP option
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Optional services
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## Local Setup

1. Install dependencies

```bash
npm install
```

1. Run Prisma migrations and generate client

```bash
npx prisma migrate dev
npx prisma generate
```

1. Seed sample data

```bash
npm run prisma:seed
```

1. Start development server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npx prisma studio
npx prisma migrate dev
npm run prisma:seed
```

## Deploy (Vercel)

1. Push code to GitHub
1. Import repo in Vercel
1. Add all required environment variables
1. Deploy

## Notes

- For Resend testing without custom domain, sending is restricted to your own verified email.
- For production emails to all users, verify your sender domain.
- Keep secrets only in `.env` / Vercel env settings, never in code.
