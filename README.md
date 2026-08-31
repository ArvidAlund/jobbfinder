# Jobbportal

Jobbportal med jobbannonser, byggd med Next.js och Storyblok.

- **GitHub:** https://github.com/ArvidAlund/jobbfinder
- **Vercel:** _(läggs till efter deploy)_

## Kom igång lokalt

1. `npm install`
2. Kopiera `.env.local.example` till `.env.local` och fyll i `STORYBLOK_DELIVERY_API_TOKEN`
3. `npm run dev`

## Routes

- `/jobs` — lista över lediga jobb, med sök och filter på avdelning
- `/jobs/[slug]` — detaljvy för ett jobb
