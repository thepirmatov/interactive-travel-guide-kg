import { NextResponse } from 'next/server';
import db from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location_id = searchParams.get('location_id');
    const url = searchParams.get('url');

    if (!location_id || !url) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    // 1. Delete from SQLite DB
    const stmt = db.prepare('DELETE FROM location_images WHERE location_id = ? AND url = ?');
    const result = stmt.run(location_id, url);

    // 2. Physical File Deletion (only if an uploaded item)
    if (url.startsWith('/uploads/')) {
      const filename = url.replace('/uploads/', '');
      const filePath = path.join(process.cwd(), 'public/uploads', filename);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`Failed to delete physical file: ${filePath}`, err);
        // We continue anyway since row is gone
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted', description: `Deleted ${result.changes} rows` });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
