<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1FUh5CrXkT6FRYqzjAmY6qY_o8kqxkpLw

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` and set your environment variables:
   - `GEMINI_API_KEY` (if used)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Run the app:
   `npm run dev`

### Supabase tables

Create these tables/columns in your Supabase project:

```
-- tasks
-- id text primary key
-- title text not null
-- completed boolean not null default false
-- due_date bigint

-- notes
-- id text primary key
-- title text not null
-- content text
-- last_modified bigint not null
```
