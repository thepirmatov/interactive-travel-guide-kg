import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM locations').all();
    const locations = rows.map((r: any) => {
      const images = db.prepare('SELECT url FROM location_images WHERE location_id = ?')
        .all(r.id)
        .map((i: any) => i.url);

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        shortDescription: r.shortDescription,
        description: r.description,
        category: r.category,
        coordinates: [r.coordinates_lat, r.coordinates_lng], // [lat, lng]
        highlights: JSON.parse(r.highlights || '[]'),
        elevation: r.elevation,
        images: images.length > 0 ? images : ['/hero.png']
      };
    });

    return NextResponse.json({ success: true, locations });
  } catch (error) {
    console.error('Failed to get locations:', error);
    return NextResponse.json({ success: false, error: 'Failed to query database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, name, slug, shortDescription, description, category, coordinates, highlights, elevation, images } = data;

    // Upsert Location
    const upsertLoc = db.prepare(`
      INSERT OR REPLACE INTO locations (id, name, slug, shortDescription, description, category, coordinates_lat, coordinates_lng, highlights, elevation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    upsertLoc.run(
      id,
      name,
      slug || id,
      shortDescription,
      description,
      category,
      coordinates?.[0] || 0,
      coordinates?.[1] || 0,
      JSON.stringify(highlights || []),
      elevation || null
    );

    // Update images (clear & re-insert simple approach)
    db.prepare('DELETE FROM location_images WHERE location_id = ?').run(id);
    const insertImg = db.prepare('INSERT INTO location_images (location_id, url) VALUES (?, ?)');
    for (const img of images || []) {
      insertImg.run(id, img);
    }

    return NextResponse.json({ success: true, message: 'Location saved!' });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ success: false, error: 'Save failed' }, { status: 500 });
  }
}
