# IMI DESIGN Website Platform

Next.js + Prisma (SQLite) implementation for **IMI DESIGN** with SEO-focused public website, blog CMS endpoints, project/service CMS endpoints, and lead enquiry system.

## Architecture Choice (Option A)
**Chosen:** Next.js (SSR/SSG-ready) + custom headless-style CMS APIs + Prisma.

Why:
- Excellent SEO rendering via App Router SSR/SSG.
- Strong Core Web Vitals support and image optimization (WebP/AVIF).
- Fast developer velocity and future extensibility to Strapi/Sanity if needed.

## Public Pages
- `/` Home
- `/about` About Us
- `/services` + `/services/[slug]`
- `/projects` + `/projects/[slug]`
- `/blog` + `/blog/[slug]`
- `/contact`

## Admin/CMS
- `/admin/login`
- `/admin/dashboard`
- API endpoints:
  - `POST /api/admin/posts`
  - `POST /api/admin/services`
  - `POST /api/admin/projects`
  - `GET /api/admin/export` (lead CSV)

## Lead System
- Form posts to `POST /api/enquiry`
- Honeypot + rate limiting
- DB storage in `Lead` table
- SMTP notifications and auto-reply when SMTP is configured

## SEO/Technical Features
- Metadata, canonical-ready setup, OpenGraph/Twitter.
- JSON-LD schema for LocalBusiness, Service, Article.
- Dynamic XML sitemap and robots.txt.
- RSS feed at `/api/rss`.
- Security headers (CSP, HSTS, X-Frame-Options, etc).
- 404 page.

## Sitemap Structure
- `/`
- `/about`
- `/services`
- `/services/:slug`
- `/projects`
- `/projects/:slug`
- `/blog`
- `/blog/:slug`
- `/contact`

## Database Models
- `Service`: title, slug, summary, content, SEO fields
- `Project`: title, slug, location, summary, content, SEO fields
- `Post`: title, slug, excerpt, content, category, tags, author, SEO fields
- `Lead`: enquiry storage
- `RedirectRule`: redirect mapping table

## URL Structure
- Services: `/services/<seo-slug>`
- Projects: `/projects/<seo-slug>`
- Blog posts: `/blog/<seo-slug>`

## Setup
1. `cp .env.example .env`
2. `npm install`
3. `npm run db:push`
4. `npm run db:seed`
5. `npm run dev`

## Google Setup Notes
- Add Search Console verification tag in layout metadata when provided.
- Set `NEXT_PUBLIC_GA4_ID` and optional `NEXT_PUBLIC_GTM_ID`.

## Security & Ops Notes
- Enforce HTTPS + Cloudflare CDN at deployment edge.
- Daily DB backup recommended (`sqlite` snapshot/managed DB backup).
- Add Auth.js/Clerk for production-grade 2FA + RBAC + audit logs.
