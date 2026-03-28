import Database from 'better-sqlite3';
import path from 'path';
import { locations } from '@/data/locations';
import customDestinations from '@/data/custom_destinations.json';

const dbPath = path.join(process.cwd(), 'local.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS locations (
    id TEXT PRIMARY KEY,
    name TEXT,
    slug TEXT,
    shortDescription TEXT,
    description TEXT,
    category TEXT,
    coordinates_lat REAL,
    coordinates_lng REAL,
    highlights TEXT,
    elevation TEXT
  );

  CREATE TABLE IF NOT EXISTS location_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id TEXT,
    url TEXT,
    FOREIGN KEY(location_id) REFERENCES locations(id)
  );

  CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    name TEXT,
    main_pin_coordinates_lng REAL,
    main_pin_coordinates_lat REAL,
    icon_type TEXT,
    short_description TEXT,
    slides_json TEXT
  );
`);

// Seeding function
function seedDatabase() {
  const rowCount = db.prepare('SELECT COUNT(*) as count FROM locations').get() as { count: number };
  if (rowCount.count > 0) return; // already seeded

  console.log('🌱 Seeding SQLite Database...');

  // 1. Seed locations
  const insertLoc = db.prepare(`
    INSERT INTO locations (id, name, slug, shortDescription, description, category, coordinates_lat, coordinates_lng, highlights, elevation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertImg = db.prepare(`INSERT INTO location_images (location_id, url) VALUES (?, ?)`);

  for (const loc of locations) {
    insertLoc.run(
      loc.id,
      loc.name,
      loc.id, // using id as slug since it's already slug-like
      loc.shortDescription,
      loc.description,
      loc.category,
      loc.coordinates[0], // lat
      loc.coordinates[1], // lng
      JSON.stringify(loc.highlights),
      loc.elevation || null
    );


    for (const img of loc.images || []) {
      insertImg.run(loc.id, img);
    }
  }

  // 2. Seed destinations (slides)
  const insertDest = db.prepare(`
    INSERT INTO destinations (id, name, main_pin_coordinates_lng, main_pin_coordinates_lat, icon_type, short_description, slides_json)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  // Use customDestinations if filled, otherwise get from default fallback logic we can mock or insert
  // Since destinations are derived typically, seeding them with initial slides structure is perfect.
  const sourceDestinations = customDestinations.length > 0 ? customDestinations : [];

  for (const dest of sourceDestinations as any[]) {
    insertDest.run(
      dest.id,
      dest.name,
      dest.main_pin_coordinates[0],
      dest.main_pin_coordinates[1],
      dest.icon_type,
      dest.short_description || '',
      JSON.stringify(dest.slides)
    );
  }

  console.log('✅ Seeding complete!');
}

seedDatabase();

export default db;
export { Database };
