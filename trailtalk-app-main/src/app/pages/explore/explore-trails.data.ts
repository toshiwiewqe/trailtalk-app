/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPLORE MODULE TRAIL DATASET — 30 Luzon trails
 *
 * Lives in the Explore module, NOT in services/trail.service.ts. The shared
 * service is referenced by user.service.ts (upcoming adventures point at ids
 * t2 and t4), so replacing its contents would break the Profile tab for the
 * whole team. This file is read only by the map.
 *
 * TYPING NOTE
 * ExploreTrail deliberately carries every field found in BOTH versions of the
 * shared Trail interface that have circulated in this repo — the lat/lng one
 * and the price/height/reviews one. That makes ExploreTrail[] assignable to
 * whichever Trail is currently on disk, so this file compiles either way.
 *
 * FIELD PROVENANCE
 *   id, name, description  Verbatim from the project trail sheet. Trustworthy.
 *   lat, lng, region       Approximate summit position. Right mountain at
 *                          zoom 10-14, NOT survey-grade. Verify on
 *                          openstreetmap.org before release.
 *   difficulty, trailType  Assigned from the trail's own description and
 *                          general character. Reasonable, not authoritative.
 *   elevation, height      Commonly published summit MASL. Spot-check these.
 *   distance, duration     ROUGH ESTIMATES so the UI renders. Replace with
 *                          your real figures.
 *   rating, reviewCount    Zero. These are real places; inventing review
 *                          scores for them would mislead your users. The
 *                          sheet hides the rating while it is 0.
 *   price                  Zero — pricing is a business decision, not mine.
 *   image                  Path convention only; these files do not exist yet.
 *   category               'Popular' | 'Scenic' | 'Forest'. Never 'Nearby' —
 *                          that depends on where the user is standing.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface ExploreTrail {
  id: string;
  name: string;
  region: string;
  image: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  distance: string;
  elevation: string;
  duration: string;
  rating: number;
  category: 'Popular' | 'Scenic' | 'Forest';
  description: string;
  status: 'open' | 'closed';
  lat: number;
  lng: number;

  // Present for compatibility with the extended Trail interface.
  height: string;
  trailType: string;
  price: number;
  reviewCount: number;
  reviews: [];
  communityStories: [];
}

/** Shared defaults for the compatibility fields. */
const COMPAT = {
  rating: 0,
  price: 0,
  reviewCount: 0,
  reviews: [] as [],
  communityStories: [] as [],
  status: 'open' as const,
};

export const TRAILS_30: ExploreTrail[] = [
  {
    ...COMPAT,
    id: 'T001',
    name: 'Mt. Pulag Traverse',
    region: 'Benguet / Ifugao / Nueva Vizcaya',
    image: 'assets/trails/t001.jpg',
    difficulty: 'Hard',
    distance: '14 km',
    elevation: '2,926 m',
    height: '2,926 m',
    duration: '2 days',
    trailType: 'Grassland',
    category: 'Popular',
    description:
      "Known for the 'Sea of Clouds', Mt. Pulag is the third highest peak in the Philippines.",
    lat: 16.5964,
    lng: 120.8944,
  },
  {
    ...COMPAT,
    id: 'T002',
    name: 'Mt. Batulao Circle Trail',
    region: 'Nasugbu, Batangas',
    image: 'assets/trails/t002.jpg',
    difficulty: 'Easy',
    distance: '8 km',
    elevation: '811 m',
    height: '811 m',
    duration: '5 hrs',
    trailType: 'Grassland',
    category: 'Popular',
    description: 'A beginner-friendly hike with rolling hills and grassy peaks.',
    lat: 14.0428,
    lng: 120.8006,
  },
  {
    ...COMPAT,
    id: 'T003',
    name: 'Mt. Ulap Eco-Trail',
    region: 'Itogon, Benguet',
    image: 'assets/trails/t003.jpg',
    difficulty: 'Moderate',
    distance: '9 km',
    elevation: '1,846 m',
    height: '1,846 m',
    duration: '6 hrs',
    trailType: 'Pine Forest',
    category: 'Scenic',
    description:
      'A community-managed eco-trail featuring rock formations and pine forests.',
    lat: 16.3369,
    lng: 120.7292,
  },
  {
    ...COMPAT,
    id: 'T004',
    name: 'Mount Pinatubo (Capas/Skyway)',
    region: 'Capas, Tarlac',
    image: 'assets/trails/t004.jpg',
    difficulty: 'Moderate',
    distance: '7 km',
    elevation: '1,486 m',
    height: '1,486 m',
    duration: '5 hrs',
    trailType: 'Volcanic',
    category: 'Popular',
    description:
      'Features a world-famous crater lake formed by a historic eruption, accessible via a 4x4 ride and a scenic trek.',
    lat: 15.1425,
    lng: 120.3496,
  },
  {
    ...COMPAT,
    id: 'T005',
    name: 'Mt. Tarak Ridge',
    region: 'Mariveles, Bataan',
    image: 'assets/trails/t005.jpg',
    difficulty: 'Hard',
    distance: '12 km',
    elevation: '1,130 m',
    height: '1,130 m',
    duration: '2 days',
    trailType: 'Rainforest',
    category: 'Forest',
    description:
      'Offers steep technical ascents through lush forests leading to a windy, panoramic ridge overlooking Manila Bay.',
    lat: 14.4517,
    lng: 120.5075,
  },
  {
    ...COMPAT,
    id: 'T006',
    name: 'Mount Pico De Loro',
    region: 'Maragondon, Cavite',
    image: 'assets/trails/t006.jpg',
    difficulty: 'Moderate',
    distance: '10 km',
    elevation: '664 m',
    height: '664 m',
    duration: '6 hrs',
    trailType: 'Coastal Peak',
    category: 'Popular',
    description:
      'A landmark coastal peak known for its distinctive rock monolith and sweeping views of Cavite and Batangas.',
    lat: 14.1967,
    lng: 120.6383,
  },
  {
    ...COMPAT,
    id: 'T007',
    name: 'Mount Arayat Traverse',
    region: 'Arayat / Magalang, Pampanga',
    image: 'assets/trails/t007.jpg',
    difficulty: 'Hard',
    distance: '11 km',
    elevation: '1,030 m',
    height: '1,030 m',
    duration: '9 hrs',
    trailType: 'Jungle',
    category: 'Forest',
    description:
      'An extinct stratovolcano featuring dense jungles, challenging rock scrambles, and twin peak vantage points.',
    lat: 15.2019,
    lng: 120.7417,
  },
  {
    ...COMPAT,
    id: 'T008',
    name: 'Mount Tapulao',
    region: 'Palauig, Zambales',
    image: 'assets/trails/t008.jpg',
    difficulty: 'Hard',
    distance: '36 km',
    elevation: '2,037 m',
    height: '2,037 m',
    duration: '2 days',
    trailType: 'Pine Forest',
    category: 'Forest',
    description:
      "Known as the 'High Peak' of Central Luzon, offering a long pine-lined trail and cool mountain climate.",
    lat: 15.4869,
    lng: 120.1136,
  },
  {
    ...COMPAT,
    id: 'T009',
    name: 'Mt. Balingkilat',
    region: 'Subic, Zambales',
    image: 'assets/trails/t009.jpg',
    difficulty: 'Hard',
    distance: '14 km',
    elevation: '1,100 m',
    height: '1,100 m',
    duration: '2 days',
    trailType: 'Coastal Peak',
    category: 'Scenic',
    description:
      'A grueling coastal mountain hike with steep exposed rock faces and panoramic ocean views over the Zambales coastline.',
    lat: 14.7261,
    lng: 120.2264,
  },
  {
    ...COMPAT,
    id: 'T010',
    name: 'Mt. Maculot',
    region: 'Cuenca, Batangas',
    image: 'assets/trails/t010.jpg',
    difficulty: 'Easy',
    distance: '6 km',
    elevation: '706 m',
    height: '706 m',
    duration: '4 hrs',
    trailType: 'Rocky Overlook',
    category: 'Popular',
    description:
      'A popular day hike rewarding climbers with dramatic overlook views of Taal Lake and Taal Volcano.',
    lat: 13.9333,
    lng: 121.0500,
  },
  {
    ...COMPAT,
    id: 'T011',
    name: 'Mt. Manabu',
    region: 'Sto. Tomas, Batangas',
    image: 'assets/trails/t011.jpg',
    difficulty: 'Easy',
    distance: '7 km',
    elevation: '760 m',
    height: '760 m',
    duration: '4 hrs',
    trailType: 'Forest',
    category: 'Forest',
    description:
      'A gentle, beginner-friendly trail famous for its lush greenery, peak cross, and complimentary local coffee.',
    lat: 14.0850,
    lng: 121.0967,
  },
  {
    ...COMPAT,
    id: 'T012',
    name: 'Mt. Daguldol',
    region: 'San Juan, Batangas',
    image: 'assets/trails/t012.jpg',
    difficulty: 'Moderate',
    distance: '10 km',
    elevation: '672 m',
    height: '672 m',
    duration: '6 hrs',
    trailType: 'Coastal Pasture',
    category: 'Scenic',
    description:
      'A coastal trail featuring rolling pastures, sea breeze views, and a beach entry at the end of the descent.',
    lat: 13.7167,
    lng: 121.4361,
  },
  {
    ...COMPAT,
    id: 'T013',
    name: 'Mt. Pamitinan',
    region: 'Rodriguez, Rizal',
    image: 'assets/trails/t013.jpg',
    difficulty: 'Moderate',
    distance: '5 km',
    elevation: '426 m',
    height: '426 m',
    duration: '4 hrs',
    trailType: 'Limestone',
    category: 'Popular',
    description:
      'A limestone rock-scrambling adventure that offers thrilling craggy summits and views of the Montalban Gorge.',
    lat: 14.7264,
    lng: 121.1547,
  },
  {
    ...COMPAT,
    id: 'T014',
    name: 'Mt. Binacayan',
    region: 'Rodriguez, Rizal',
    image: 'assets/trails/t014.jpg',
    difficulty: 'Moderate',
    distance: '5 km',
    elevation: '424 m',
    height: '424 m',
    duration: '4 hrs',
    trailType: 'Limestone',
    category: 'Scenic',
    description:
      'Famous for its sharp limestone formations and scenic sea of clouds views over the Montalban countryside.',
    lat: 14.7203,
    lng: 121.1450,
  },
  {
    ...COMPAT,
    id: 'T015',
    name: 'Mt. Hapunang Banoi',
    region: 'Rodriguez, Rizal',
    image: 'assets/trails/t015.jpg',
    difficulty: 'Hard',
    distance: '7 km',
    elevation: '610 m',
    height: '610 m',
    duration: '6 hrs',
    trailType: 'Karst Limestone',
    category: 'Scenic',
    description:
      'A technical karst limestone peak providing a challenging climb and panoramic 360-degree hilltop views.',
    lat: 14.7350,
    lng: 121.1600,
  },
  {
    ...COMPAT,
    id: 'T016',
    name: 'Mt. Daraitan',
    region: 'Tanay, Rizal',
    image: 'assets/trails/t016.jpg',
    difficulty: 'Moderate',
    distance: '9 km',
    elevation: '739 m',
    height: '739 m',
    duration: '7 hrs',
    trailType: 'Limestone / River',
    category: 'Popular',
    description:
      'Features sharp limestone rock faces, rewarding summit viewpoints, and the crystal-clear Tinipak River at the base.',
    lat: 14.6417,
    lng: 121.4139,
  },
  {
    ...COMPAT,
    id: 'T017',
    name: 'Mt. Kulis',
    region: 'Tanay, Rizal',
    image: 'assets/trails/t017.jpg',
    difficulty: 'Easy',
    distance: '6 km',
    elevation: '650 m',
    height: '650 m',
    duration: '4 hrs',
    trailType: 'Rock Formation',
    category: 'Scenic',
    description:
      'A beginner-friendly night and day hike destination famous for its low-elevation sea of clouds and natural rock formations.',
    lat: 14.6111,
    lng: 121.3708,
  },
  {
    ...COMPAT,
    id: 'T018',
    name: 'Mt. Batolusong',
    region: 'Tanay, Rizal',
    image: 'assets/trails/t018.jpg',
    difficulty: 'Easy',
    distance: '8 km',
    elevation: '540 m',
    height: '540 m',
    duration: '5 hrs',
    trailType: 'Grassland Ridge',
    category: 'Scenic',
    description:
      'Features open grassland ridges, rolling hills, and cool mountain breezes overlooking the Rizal landscapes.',
    lat: 14.6014,
    lng: 121.3839,
  },
  {
    ...COMPAT,
    id: 'T019',
    name: 'Mt. Sembrano',
    region: 'Pililla, Rizal',
    image: 'assets/trails/t019.jpg',
    difficulty: 'Moderate',
    distance: '8 km',
    elevation: '745 m',
    height: '745 m',
    duration: '6 hrs',
    trailType: 'Forest / Grassland',
    category: 'Scenic',
    description:
      'Features a mix of forest shade and grassy slopes that lead to sweeping summit views of Laguna de Bay and wind farms.',
    lat: 14.4667,
    lng: 121.3167,
  },
  {
    ...COMPAT,
    id: 'T020',
    name: 'Mt. Kalisungan',
    region: 'Calauan, Laguna',
    image: 'assets/trails/t020.jpg',
    difficulty: 'Easy',
    distance: '6 km',
    elevation: '760 m',
    height: '760 m',
    duration: '4 hrs',
    trailType: 'Orchard / Grassland',
    category: 'Scenic',
    description:
      'A beginner-friendly hike passing through fruit orchards and open grassland with views of surrounding lakes and peaks.',
    lat: 14.1167,
    lng: 121.3208,
  },
  {
    ...COMPAT,
    id: 'T021',
    name: 'Mt. Makiling (UPLB Trail)',
    region: 'Los Baños, Laguna',
    image: 'assets/trails/t021.jpg',
    difficulty: 'Moderate',
    distance: '12 km',
    elevation: '1,090 m',
    height: '1,090 m',
    duration: '8 hrs',
    trailType: 'Mossy Forest',
    category: 'Forest',
    description:
      'A classic forested trail inside a nature reserve known for its rich biodiversity, mud springs, and mossy peak.',
    lat: 14.1358,
    lng: 121.1944,
  },
  {
    ...COMPAT,
    id: 'T022',
    name: 'Mt. Makiling (MTP Trail)',
    region: 'Sto. Tomas, Batangas',
    image: 'assets/trails/t022.jpg',
    difficulty: 'Hard',
    distance: '14 km',
    elevation: '1,090 m',
    height: '1,090 m',
    duration: '10 hrs',
    trailType: 'Jungle Traverse',
    category: 'Forest',
    description:
      'A challenging traverse featuring steep technical ascents, thick jungle vegetation, and sharp ridge scrambles.',
    lat: 14.1275,
    lng: 121.1817,
  },
  {
    ...COMPAT,
    id: 'T023',
    name: 'Mt. Cristobal',
    region: 'San Pablo, Laguna / Dolores, Quezon',
    image: 'assets/trails/t023.jpg',
    difficulty: 'Hard',
    distance: '12 km',
    elevation: '1,470 m',
    height: '1,470 m',
    duration: '9 hrs',
    trailType: 'Rainforest / Crater',
    category: 'Forest',
    description:
      "Known as the 'Devil's Mountain', it offers a dense rainforest trek leading to a dark, misty volcanic crater rim.",
    lat: 14.0500,
    lng: 121.4333,
  },
  {
    ...COMPAT,
    id: 'T024',
    name: 'Mount Gulugod Baboy',
    region: 'Mabini, Batangas',
    image: 'assets/trails/t024.jpg',
    difficulty: 'Easy',
    distance: '6 km',
    elevation: '525 m',
    height: '525 m',
    duration: '3 hrs',
    trailType: 'Coastal Grassland',
    category: 'Scenic',
    description:
      'A gentle coastal hike through rolling green hills offering scenic, wide-angle views of Balayan and Batangas Bays.',
    lat: 13.7003,
    lng: 120.8833,
  },
  {
    ...COMPAT,
    id: 'T025',
    name: 'Mt. Marami',
    region: 'Maragondon, Cavite',
    image: 'assets/trails/t025.jpg',
    difficulty: 'Moderate',
    distance: '16 km',
    elevation: '405 m',
    height: '405 m',
    duration: '8 hrs',
    trailType: 'Pasture / Rock Peak',
    category: 'Scenic',
    description:
      'A long trek across open pastures and river beds leading to dramatic, crown-like composite rock peaks.',
    lat: 14.2167,
    lng: 120.7333,
  },
  {
    ...COMPAT,
    id: 'T026',
    name: 'Mt. Pigingan',
    region: 'Itogon, Benguet',
    image: 'assets/trails/t026.jpg',
    difficulty: 'Moderate',
    distance: '8 km',
    elevation: '1,650 m',
    height: '1,650 m',
    duration: '6 hrs',
    trailType: 'Pine Forest',
    category: 'Forest',
    description:
      'Features pine forest trails, mountain streams, and a narrow rocky summit ridge overlooking the Agno River.',
    lat: 16.3247,
    lng: 120.7458,
  },
  {
    ...COMPAT,
    id: 'T027',
    name: 'Mt. Yangbew',
    region: 'La Trinidad, Benguet',
    image: 'assets/trails/t027.jpg',
    difficulty: 'Easy',
    distance: '2 km',
    elevation: '1,680 m',
    height: '1,680 m',
    duration: '1.5 hrs',
    trailType: 'Grassland Plateau',
    category: 'Scenic',
    description:
      "Known as the 'Little Pulag', offering a very gentle climb to an expansive grassy summit plateau with 360-degree Valley views.",
    lat: 16.4483,
    lng: 120.6117,
  },
  {
    ...COMPAT,
    id: 'T028',
    name: 'Mt. Damas',
    region: 'San Clemente, Tarlac',
    image: 'assets/trails/t028.jpg',
    difficulty: 'Hard',
    distance: '18 km',
    elevation: '1,300 m',
    height: '1,300 m',
    duration: '2 days',
    trailType: 'Ridge / River',
    category: 'Forest',
    description:
      'A rugged mountain trek involving steep ridge climbs, river trekking, and a side trip to the scenic Ubod Falls.',
    lat: 15.5453,
    lng: 120.4919,
  },
  {
    ...COMPAT,
    id: 'T029',
    name: 'Mt. Labo',
    region: 'Camarines Norte',
    image: 'assets/trails/t029.jpg',
    difficulty: 'Hard',
    distance: '24 km',
    elevation: '1,544 m',
    height: '1,544 m',
    duration: '2 days',
    trailType: 'Mossy Forest',
    category: 'Forest',
    description:
      'An extensive jungle trek in the Bicol region featuring river crossings, mossy forests, and lush biodiversity.',
    lat: 14.0167,
    lng: 122.7833,
  },
  {
    ...COMPAT,
    id: 'T030',
    name: 'Mt. Ugo',
    region: 'Kayapa, Nueva Vizcaya / Itogon, Benguet',
    image: 'assets/trails/t030.jpg',
    difficulty: 'Hard',
    distance: '28 km',
    elevation: '2,150 m',
    height: '2,150 m',
    duration: '2 days',
    trailType: 'Pine Forest',
    category: 'Forest',
    description:
      'A premier multi-day traverse through vast pine forests, indigenous Cordillera villages, and high-altitude ridges.',
    lat: 16.3806,
    lng: 120.8508,
  },
];

/** Case-insensitive search across name, region and description. */
export function searchTrails(query: string): ExploreTrail[] {
  const q = query.trim().toLowerCase();
  if (!q) return TRAILS_30;
  return TRAILS_30.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q),
  );
}