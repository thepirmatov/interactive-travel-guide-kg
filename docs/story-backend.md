# Story / Tour backend recommendation

## Easiest path: **JSON-server** (for now)

- **Pros:** No signup, no schema migrations. Add `db.json` and run `npx json-server --watch db.json --port 3001`. Your app fetches `GET /stories` or `GET /destinations`.
- **Cons:** No auth, no real multi-user admin. Fine for a single editor or prototype.
- **Data shape:** See `src/types/story.ts` and the sample below.

## Production path: **Supabase**

- **Pros:** PostgreSQL, Row Level Security, auth for admin, file storage for images, real-time if needed.
- **Tables:** `stories` → `destinations` → `location_slides`; store `camera` as `jsonb`.
- **Migration:** Straightforward from the TypeScript interfaces; `CameraView` → `jsonb`, slides in a child table with `order`.

## Sample `db.json` for JSON-server

```json
{
  "stories": [
    {
      "id": "kyrgyzstan-highlights",
      "title": "Kyrgyzstan Highlights",
      "description": "A tour of top destinations.",
      "cover_image_url": "/covers/kg.jpg",
      "destinations": [
        {
          "id": "issyk-kul",
          "name": "Issyk-Kul",
          "main_pin_coordinates": [77.27, 42.45],
          "icon_type": "lake",
          "short_description": "World's second-largest alpine lake.",
          "slides": [
            {
              "id": "issyk-1",
              "title": "Overview",
              "description": "<p>Issyk-Kul never freezes.</p>",
              "image_url": "/slides/issyk-1.jpg",
              "type": "info",
              "camera": {
                "center": [77.27, 42.45],
                "zoom": 8,
                "pitch": 65,
                "bearing": -15
              },
              "altitude_meters": 1607,
              "order": 1,
              "duration_seconds": 5
            }
          ]
        }
      ]
    }
  ]
}
```

Run: `npx json-server --watch db.json --port 3001` and use `http://localhost:3001/stories` in the app.
