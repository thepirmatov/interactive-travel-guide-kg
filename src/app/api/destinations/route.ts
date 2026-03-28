import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = db.prepare('SELECT * FROM destinations').all();
    const destinations = rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      main_pin_coordinates: [r.main_pin_coordinates_lng, r.main_pin_coordinates_lat],
      icon_type: r.icon_type,
      short_description: r.short_description,
      slides: JSON.parse(r.slides_json || '[]')
    }));

    return NextResponse.json({ success: true, destinations });
  } catch (error) {
    console.error('Failed to get destinations:', error);
    return NextResponse.json({ success: false, error: 'Failed to query database' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Expects Destination[]

    // Use a transaction for atomic replacement
    const deleteBtn = db.prepare('DELETE FROM destinations');
    const insertBtn = db.prepare(`
      INSERT INTO destinations (id, name, main_pin_coordinates_lng, main_pin_coordinates_lat, icon_type, short_description, slides_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const runTransaction = db.transaction((items: any[]) => {
      deleteBtn.run();
      for (const d of items) {
        insertBtn.run(
          d.id,
          d.name,
          d.main_pin_coordinates?.[0] || 0,
          d.main_pin_coordinates?.[1] || 0,
          d.icon_type,
          d.short_description || '',
          JSON.stringify(d.slides || [])
        );
      }
    });

    runTransaction(data);

    return NextResponse.json({ success: true, message: 'Destinations saved!' });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ success: false, error: 'Save failed' }, { status: 500 });
  }
}
