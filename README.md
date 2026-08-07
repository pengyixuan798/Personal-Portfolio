# Personal Portfolio + Notion Notes

This project now supports creating notes directly in a Notion database.

## 1) Prepare Notion

1. Create a Notion database for notes.
2. Add fields with these names/types:
   - `Title` (Title)
   - `Content` (Text)
   - `Tags` (Multi-select, optional)
   - `Date` (Date)
3. Create a Notion Integration and copy its token.
4. Share your notes database with that Integration.
5. Copy the database ID from the Notion database URL.

## 2) Configure environment variables

1. Copy `.env.example` to `.env`.
2. Fill in:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID`
   - `PORT` (optional)

## 3) Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`, go to **Contact Me**, and use **Save a Note to Notion**.
