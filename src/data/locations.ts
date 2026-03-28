export type LocationCategory = 'lake' | 'mountain' | 'historical' | 'city' | 'nature' | 'forest';

export interface Location {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  shortDescription: string;
  highlights: string[];
  images: string[];
  elevation?: string;
  bestSeason?: string;
}

export const locations: Location[] = [
  {
    id: 'bishkek',
    name: 'Bishkek',
    category: 'city',
    coordinates: [42.87, 74.59],
    description:
      'The vibrant capital city of Kyrgyzstan, nestled at the foot of the Tian Shan mountains. Bishkek combines Soviet-era architecture with modern cafes, bustling bazaars, and tree-lined boulevards. The city serves as the perfect gateway to Kyrgyzstan\'s incredible natural wonders.',
    shortDescription: 'The vibrant capital at the foot of Tian Shan mountains',
    highlights: ['Osh Bazaar', 'Ala-Too Square', 'Dordoy Bazaar', 'Panfilov Park'],
    images: ['/locations/bishkek-1.jpg', '/locations/bishkek-2.jpg', '/locations/bishkek-3.jpg'],
    elevation: '800m',
    bestSeason: 'April – October',
  },
  {
    id: 'issyk-kul',
    name: 'Issyk-Kul Lake',
    category: 'lake',
    coordinates: [42.45, 77.27],
    description:
      'The crown jewel of Kyrgyzstan — the world\'s second-largest alpine lake after Titicaca. Issyk-Kul never freezes despite being surrounded by snow-capped peaks, earning it the name "Hot Lake." Its crystal-clear turquoise waters stretch 182 km, offering beaches, hot springs, and ancient petroglyphs.',
    shortDescription: "World's second-largest alpine lake that never freezes",
    highlights: ['Crystal-clear water', 'Hot springs', 'Petroglyphs', 'Beach resorts'],
    images: ['/locations/issyk-kul-1.jpg', '/locations/issyk-kul-2.jpg', '/locations/issyk-kul-3.jpg'],
    elevation: '1,607m',
    bestSeason: 'June – September',
  },
  {
    id: 'son-kul',
    name: 'Son-Kul Lake',
    category: 'lake',
    coordinates: [41.83, 75.15],
    description:
      'A breathtaking high-alpine lake sitting at 3,016 meters above sea level. Son-Kul is the heart of Kyrgyz nomadic culture — in summer, herders set up their yurts along its shores, and you can experience authentic nomadic life. The sunsets here paint the sky in colors you\'ve never seen before.',
    shortDescription: 'High-alpine lake at 3,016m — the heart of nomadic culture',
    highlights: ['Yurt stays', 'Horse riding', 'Nomadic culture', 'Stunning sunsets'],
    images: ['/locations/son-kul-1.jpg', '/locations/son-kul-2.jpg', '/locations/son-kul-3.jpg'],
    elevation: '3,016m',
    bestSeason: 'June – September',
  },
  {
    id: 'tash-rabat',
    name: 'Tash Rabat',
    category: 'historical',
    coordinates: [40.83, 75.57],
    description:
      'A remarkable 15th-century stone caravanserai hidden in a remote valley at 3,200 meters. Tash Rabat once served as a vital stopover on the ancient Silk Road. Its labyrinthine corridors and chambers, built entirely of stone, remain one of Central Asia\'s best-preserved medieval structures.',
    shortDescription: '15th-century Silk Road caravanserai at 3,200m',
    highlights: ['Silk Road history', 'Stone architecture', 'Remote valley', 'Stargazing'],
    images: ['/locations/tash-rabat-1.jpg', '/locations/tash-rabat-2.jpg', '/locations/tash-rabat-3.jpg'],
    elevation: '3,200m',
    bestSeason: 'June – September',
  },
  {
    id: 'arslanbob',
    name: 'Arslanbob',
    category: 'forest',
    coordinates: [41.33, 72.94],
    description:
      'Home to the world\'s largest natural walnut forest, Arslanbob is a lush green paradise in southern Kyrgyzstan. The village is surrounded by cascading waterfalls, flower-filled meadows, and ancient walnut groves. In autumn, the entire forest turns golden as locals harvest walnuts the traditional way.',
    shortDescription: "World's largest walnut forest with cascading waterfalls",
    highlights: ['Walnut forest', 'Waterfalls', 'Community-based tourism', 'Hiking trails'],
    images: ['/locations/arslanbob-1.jpg', '/locations/arslanbob-2.jpg', '/locations/arslanbob-3.jpg'],
    elevation: '1,600m',
    bestSeason: 'May – October',
  },
  {
    id: 'ala-archa',
    name: 'Ala-Archa National Park',
    category: 'mountain',
    coordinates: [42.65, 74.48],
    description:
      'Just 40 km from Bishkek, Ala-Archa is a spectacular alpine gorge with glaciers, rushing rivers, and towering peaks reaching over 4,800 meters. The park offers trails for all skill levels — from leisurely riverside walks to challenging glacier treks. The dramatic granite spires make it a favorite for mountaineers.',
    shortDescription: 'Alpine gorge with glaciers just 40km from Bishkek',
    highlights: ['Glacier trekking', 'Day trips from Bishkek', 'Diverse trails', 'Wildlife'],
    images: ['/locations/ala-archa-1.jpg', '/locations/ala-archa-2.jpg', '/locations/ala-archa-3.jpg'],
    elevation: '2,200 – 4,860m',
    bestSeason: 'May – October',
  },
  {
    id: 'jeti-oguz',
    name: 'Jeti-Ögüz',
    category: 'mountain',
    coordinates: [42.33, 78.22],
    description:
      'Famous for its striking red sandstone formations known as the "Seven Bulls" and the dramatic "Broken Heart" rock. This lush valley near Karakol offers alpine meadows dotted with wildflowers, hot springs, and panoramic mountain views. The red cliffs against the green valleys create an otherworldly landscape.',
    shortDescription: 'Red sandstone "Seven Bulls" formations and hot springs',
    highlights: ['Seven Bulls rocks', 'Broken Heart cliff', 'Hot springs', 'Flower Valley'],
    images: ['/locations/jeti-oguz-1.jpg', '/locations/jeti-oguz-2.jpg', '/locations/jeti-oguz-3.jpg'],
    elevation: '2,200m',
    bestSeason: 'May – September',
  },
  {
    id: 'karakol',
    name: 'Karakol',
    category: 'city',
    coordinates: [42.49, 78.39],
    description:
      'Kyrgyzstan\'s adventure capital, nestled between Issyk-Kul Lake and the Terskei Alatoo mountains. Karakol is the gateway to world-class skiing, trekking, and mountaineering. The town itself features a unique blend of Russian, Dungan, and Uighur architecture, including a stunning wooden mosque built without a single nail.',
    shortDescription: 'Adventure capital with a unique cultural blend',
    highlights: ['Ski resorts', 'Dungan Mosque', 'Animal market', 'Base for trekking'],
    images: ['/locations/karakol-1.jpg', '/locations/karakol-2.jpg', '/locations/karakol-3.jpg'],
    elevation: '1,770m',
    bestSeason: 'Year-round',
  },
  {
    id: 'burana-tower',
    name: 'Burana Tower',
    category: 'historical',
    coordinates: [42.75, 75.25],
    description:
      'An ancient 11th-century minaret standing as the last remnant of the great Silk Road city of Balasagun. Originally 45 meters tall, the tower now stands at 25 meters after centuries of earthquakes. The surrounding field of mysterious Turkic stone carvings (balbals) adds an eerie, timeless atmosphere to this UNESCO-tentative site.',
    shortDescription: '11th-century Silk Road minaret with ancient stone carvings',
    highlights: ['Ancient minaret', 'Balbals stone figures', 'Silk Road history', 'Museum'],
    images: ['/locations/burana-1.jpg', '/locations/burana-2.jpg', '/locations/burana-3.jpg'],
    elevation: '760m',
    bestSeason: 'April – October',
  },
  {
    id: 'skazka-canyon',
    name: 'Skazka Canyon',
    category: 'nature',
    coordinates: [42.27, 77.07],
    description:
      'Known as "Fairy Tale Canyon," Skazka is a surreal landscape of dramatic clay formations sculpted by wind and rain over millions of years. The red, orange, and yellow rock towers create a Martian landscape right on the southern shore of Issyk-Kul. It\'s especially magical at sunrise or sunset when the colors intensify.',
    shortDescription: 'Fairy Tale Canyon — surreal clay formations on Issyk-Kul\'s shore',
    highlights: ['Unique geology', 'Sunset views', 'Easy access', 'Photography paradise'],
    images: ['/locations/skazka-1.jpg', '/locations/skazka-2.jpg', '/locations/skazka-3.jpg'],
    elevation: '1,650m',
    bestSeason: 'April – October',
  },
  {
    id: 'osh',
    name: 'Osh & Suleiman-Too',
    category: 'historical',
    coordinates: [40.53, 72.79],
    description:
      'Osh is often called the cultural capital of Kyrgyzstan — a melting pot of Kyrgyz, Tajik, and Uzbek cultures. At its heart rises Suleiman-Too (Solomon\'s Mountain), a UNESCO World Heritage Site with sacred caves, mosques, and a museum. The mountain has been a place of pilgrimage for millennia and offers panoramic views over the Fergana Valley.',
    shortDescription: 'Cultural capital and UNESCO Suleiman-Too — sacred mountain and bazaars',
    highlights: ['Suleiman-Too UNESCO site', 'Sacred caves & museum', 'Jayma Bazaar', 'Multi-ethnic culture'],
    images: ['/locations/osh-1.jpg', '/locations/osh-2.jpg', '/locations/osh-3.jpg'],
    elevation: '963m',
    bestSeason: 'April – October',
  },
  {
    id: 'altyn-arashan',
    name: 'Altyn-Arashan Valley',
    category: 'nature',
    coordinates: [42.35, 78.55],
    description:
      'One of Kyrgyzstan\'s most famous hot-spring valleys, Altyn Arashan lies east of Karakol in the Terskei Alatoo. The thermal waters reach around 45°C and are traditionally used for conditions related to the nervous, endocrine, cardiovascular, and musculoskeletal systems. Stay in simple guesthouses or yurts and combine soaking with day hikes to alpine meadows and glaciers.',
    shortDescription: 'Famous hot springs (~45°C) near Karakol — hiking and mountain views',
    highlights: ['Hot springs 45°C', 'Yurt stays', 'Day hikes', 'Near Karakol'],
    images: ['/locations/altyn-arashan-1.jpg', '/locations/altyn-arashan-2.jpg', '/locations/altyn-arashan-3.jpg'],
    elevation: '2,400m',
    bestSeason: 'June – September',
  },
];

export const categoryConfig: Record<LocationCategory, { label: string; color: string; icon: string }> = {
  lake: { label: 'Lake', color: '#0EA5E9', icon: '💧' },
  mountain: { label: 'Mountain', color: '#6B7280', icon: '⛰️' },
  historical: { label: 'Historical Site', color: '#D4A843', icon: '🏛️' },
  city: { label: 'City', color: '#2E7D32', icon: '🏙️' },
  nature: { label: 'Nature', color: '#F97316', icon: '🌿' },
  forest: { label: 'Forest', color: '#15803D', icon: '🌲' },
};
