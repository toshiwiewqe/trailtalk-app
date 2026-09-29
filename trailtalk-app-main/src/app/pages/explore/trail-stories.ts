/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TRAIL STORIES — editorial content for each of the 30 mountains
 *
 * Keyed by Trail.id. Additive: nothing here modifies trail.model.ts or
 * trail.service.ts, so the shared model keeps its shape.
 *
 * ACCURACY NOTE — read before shipping.
 * These draw on well-documented Philippine hiking lore: the Bernardo Carpio
 * legend at Pamitinan, Mariang Sinukuan at Arayat, Maria Makiling, Pulag's
 * standing as Luzon's highest peak, Pinatubo's 1991 eruption. Where a story
 * rests on folklore it says so ("local legend holds", "hikers say") rather
 * than asserting it as fact.
 *
 * Even so, a name, date or figure can drift. Before this ships, have someone
 * who has climbed these — or PinoyMountaineer, or the LGU tourism office —
 * read them. Elevations and trail conditions especially change with DENR
 * closures and rehabilitation programmes.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface TrailStory {
  /** One line under the title. Sets the mood, not a summary. */
  tagline: string;
  /** Three or four concrete reasons people choose this climb. */
  whyHike: string[];
  /** 200+ words of history, legend and character. */
  story: string;
}

export const TRAIL_STORIES: Record<string, TrailStory> = {

  T001: {
    tagline: 'The Playground of the Gods',
    whyHike: [
      'The most famous sea of clouds in the country, seen from above',
      'Dwarf bamboo grasslands found almost nowhere else in the Philippines',
      'Luzon\'s highest summit, reachable by beginners on the Ambangeg trail',
      'Genuinely cold — temperatures near freezing before dawn',
    ],
    story:
      'Mt. Pulag is the highest mountain in Luzon and the third highest in the ' +
      'Philippines, and for a generation of Filipino hikers it has been the ' +
      'climb you save up for. The summit rises out of a grassland of dwarf ' +
      'bamboo, a plant community shaped by altitude and cold that looks like ' +
      'nowhere else in the archipelago — low, wind-combed, faintly silver at ' +
      'first light.\n\n' +
      'What draws the crowds is the sea of clouds. Because the summit sits ' +
      'above the usual cloud deck, hikers who reach it before sunrise often ' +
      'find themselves looking down on an unbroken white floor with distant ' +
      'peaks breaking through like islands. It is not guaranteed — plenty of ' +
      'climbers arrive to find only grey — and that uncertainty is part of why ' +
      'people keep going back.\n\n' +
      'The mountain matters to the Ibaloi, Kalanguya and Kankanaey peoples ' +
      'whose ancestral lands surround it, and it is understood as a sacred ' +
      'place — in local belief, a resting place for the souls of ancestors. ' +
      'Park rules reflect that: registration, orientation briefings, strict ' +
      'limits on visitor numbers, and a firm leave-no-trace policy. The park ' +
      'has closed for rehabilitation more than once after grassland fires and ' +
      'trampling damage.\n\n' +
      'Come for the clouds; understand that you are a guest on someone\'s ' +
      'sacred ground, and dress for cold that catches lowlanders by surprise.',
  },

  T002: {
    tagline: 'Rolling hills an hour from the city',
    whyHike: [
      'The classic first mountain for new Filipino hikers',
      'Open grassy ridges with views the whole way up, not just at the top',
      'Close enough to Manila and Tagaytay for a genuine day trip',
      'Two route options, so you can traverse rather than backtrack',
    ],
    story:
      'If a Filipino hiker can name the mountain where they started, there is ' +
      'a good chance it was Batulao. Sitting above Nasugbu in Batangas, within ' +
      'easy reach of Manila and a short drive from Tagaytay, it has introduced ' +
      'more people to the sport than almost any other peak in the country.\n\n' +
      'The appeal is the shape of the walk. Where many Philippine mountains ' +
      'bury you in forest until a sudden summit reveal, Batulao is open almost ' +
      'from the start — a sequence of grassy humps and saddles, numbered as ' +
      'stations, with the jagged summit visible ahead for most of the climb. ' +
      'You can see where you are going and how far you have come, which is ' +
      'exactly what a first-time hiker needs.\n\n' +
      'There are two established routes, the old and the new trail, and most ' +
      'groups go up one and down the other. The new trail is the gentler ' +
      'approach; the old trail is steeper and more direct, with a few scrambly ' +
      'sections near the top that feel more serious than the elevation ' +
      'suggests.\n\n' +
      'Go early. The ridges are entirely exposed, the grass reflects heat, and ' +
      'by mid-morning the same terrain that felt pleasant at six becomes a ' +
      'slog. Bring more water than you think a short mountain deserves.',
  },

  T003: {
    tagline: 'A community\'s mountain, opened to visitors',
    whyHike: [
      'Pine ridges and a sea of clouds without Pulag\'s altitude',
      'Gungal Rock — the photograph everyone takes home',
      'Managed by the Ampucao community, with local guides required',
      'Close to Baguio, making it an easy add-on to a Benguet trip',
    ],
    story:
      'Mt. Ulap is a relatively recent arrival on the Philippine hiking map, ' +
      'and that is precisely what makes it interesting. The Ampucao–Sta. Fe ' +
      'ridge trail was developed and is managed by the community of Ampucao in ' +
      'Itogon, Benguet, as an eco-tourism livelihood project. Guides are local, ' +
      'fees go back into the barangay, and the trail exists because people ' +
      'living there decided to open it.\n\n' +
      'The walk itself is a ridgeline, which is unusual and welcome — instead ' +
      'of a forested tunnel with a viewpoint at the end, you get exposure and ' +
      'perspective for most of the route. Cordillera pines thin out into open ' +
      'grass, the ridge narrows and swells, and on a good morning the valleys ' +
      'below fill with cloud while you walk above it.\n\n' +
      'The landmark is Gungal Rock, a protruding slab that has become one of ' +
      'the most photographed spots in Benguet. Expect a queue. Nearby are ' +
      'Ibaloi burial caves, which are part of the cultural landscape here and ' +
      'are treated with respect rather than as an attraction.\n\n' +
      'It is often described as a gentler alternative to Pulag, and it is, but ' +
      'not a trivial one. The ridge is long, the sun is unfiltered, and the ' +
      'descent to Sta. Fe is harder on the knees than the ascent is on the ' +
      'lungs.',
  },

  T004: {
    tagline: 'A crater lake where a mountaintop used to be',
    whyHike: [
      'One of the most dramatic crater lakes in Southeast Asia',
      'A 4x4 ride across lahar canyons that is half the experience',
      'Short walking distance, so it suits mixed-ability groups',
      'Standing inside the aftermath of a world-historic eruption',
    ],
    story:
      'In June 1991, Mount Pinatubo produced one of the largest volcanic ' +
      'eruptions of the twentieth century. It removed the top of the mountain, ' +
      'buried surrounding provinces in ash and lahar, altered global ' +
      'temperatures for the following two years, and displaced tens of ' +
      'thousands of people — above all the Aeta communities who had lived on ' +
      'its slopes for generations.\n\n' +
      'What is left is a caldera holding a lake of extraordinary colour, ' +
      'somewhere between turquoise and jade depending on the light and the ' +
      'season. Getting there from Capas in Tarlac means a 4x4 ride across the ' +
      'lahar fields — grey canyons of consolidated ash carved by rivers into ' +
      'shapes that look more like Iceland or Utah than the Philippines — ' +
      'followed by a comparatively short walk to the crater rim.\n\n' +
      'That combination makes Pinatubo unusual among the climbs on this list. ' +
      'The trekking is modest; the landscape does the work. It is one of the ' +
      'few destinations here that a family with children or an unpractised ' +
      'walker can reasonably attempt.\n\n' +
      'It is worth arriving with the history in mind. The scenery is ' +
      'spectacular because of a catastrophe, and the Aeta communities who guide ' +
      'and drive here are the descendants of the people it displaced. The ' +
      'trip is better for knowing that.',
  },

  T005: {
    tagline: 'A wind-blasted ridge above Manila Bay',
    whyHike: [
      'A genuinely demanding climb within reach of Manila',
      'Camping on a ridge with the bay and Corregidor laid out below',
      'Papaya River crossings to start, forest to finish',
      'A recognised step up for hikers outgrowing beginner peaks',
    ],
    story:
      'Tarak Ridge is where a lot of Filipino hikers discover the difference ' +
      'between a walk and a climb. It sits in the Mariveles mountains at the ' +
      'southern tip of Bataan, and while its elevation is unremarkable on ' +
      'paper, the route earns its reputation through sustained steepness and ' +
      'very little shade in the upper sections.\n\n' +
      'The approach begins along the Papaya River, with crossings that vary ' +
      'from ankle-deep to genuinely awkward depending on recent rain. From ' +
      'there the trail turns upward through forest and does not really stop ' +
      'turning upward. The last push to the ridge is the part people remember, ' +
      'usually with a certain grim affection.\n\n' +
      'The reward is one of the better campsites in Luzon. The ridge opens out ' +
      'to a view across Manila Bay, with Corregidor sitting in the water and, ' +
      'on clear nights, the lights of Manila itself scattered along the far ' +
      'shore. Wind is constant — pitch carefully and stake everything.\n\n' +
      'Bataan\'s wartime history sits underneath all of this. The peninsula was ' +
      'the site of the 1942 defence and the death march that followed, and ' +
      'these mountains were the ground that fighting was conducted across. ' +
      'Most climbers come for the ridge and the view, but the place carries ' +
      'more than scenery.',
  },

  T006: {
    tagline: 'The parrot\'s beak on the Cavite coast',
    whyHike: [
      'A monolith silhouette unlike anything else in the region',
      'Views spanning Cavite, Batangas and the South China Sea',
      'Accessible from Manila without an overnight stay',
      'Protected landscape status, with real conservation rules',
    ],
    story:
      'Pico de Loro — Spanish for "parrot\'s beak" — takes its name from the ' +
      'rock monolith standing beside its summit, a near-vertical tooth of ' +
      'stone that gives the mountain one of the most recognisable profiles in ' +
      'Luzon. Its formal name is Mt. Palay-Palay, and it sits within the ' +
      'Mount Palay-Palay–Mataas na Gulod Protected Landscape spanning the ' +
      'Cavite and Batangas border.\n\n' +
      'For years the monolith was the point. Hikers queued to scramble up it ' +
      'for a photograph on the narrow top, and the images circulated widely ' +
      'enough to make the mountain a weekend fixture. That popularity became ' +
      'the problem. Erosion from constant foot traffic, along with crowding on ' +
      'a feature with no room for error, led authorities to close the mountain ' +
      'for rehabilitation and to restrict monolith access when it reopened.\n\n' +
      'It remains a rewarding climb without it. The trail passes through ' +
      'forest that still holds decent biodiversity for somewhere this close to ' +
      'Metro Manila, and the summit ridge gives a long view over the coastline ' +
      'toward Nasugbu and out to the water.\n\n' +
      'Check current rules before going. This is one of several Philippine ' +
      'peaks where access policy has changed more than once in recent years, ' +
      'and conditions set by the DENR and the local government are worth ' +
      'confirming rather than assuming.',
  },

  T007: {
    tagline: 'The lone mountain on the Pampanga plain',
    whyHike: [
      'A solitary volcano rising straight out of flat farmland',
      'Twin peaks and a traverse route between them',
      'Dense jungle, unusual this close to Central Luzon\'s rice belt',
      'The legend of Mariang Sinukuan, still told locally',
    ],
    story:
      'Mount Arayat is impossible to miss. The Pampanga plain is flat for ' +
      'kilometres in every direction, planted with rice and cut by irrigation ' +
      'channels, and then Arayat simply rises out of it — an isolated extinct ' +
      'stratovolcano with no range attached, visible from a great distance and ' +
      'from almost every direction.\n\n' +
      'That isolation gave it a place in Kapampangan culture long before it ' +
      'became a hiking destination. Local legend holds that the mountain is ' +
      'home to Mariang Sinukuan, a diwata who guards it and its forests, ' +
      'rewarding those who behave well on her slopes and punishing those who ' +
      'do not. Versions of the story differ, but the figure recurs across ' +
      'generations of Kapampangan storytelling.\n\n' +
      'The climb has two sides. The Magalang route on the north and the Arayat ' +
      'route on the south can be linked into a traverse, which is how most ' +
      'serious hikers do it. The terrain is steeper and rougher than the ' +
      'modest elevation implies, with rock scrambles, thick vegetation and ' +
      'sections that demand hands as well as feet.\n\n' +
      'The jungle is the surprise. Surrounded by cultivated plain, the ' +
      'mountain holds forest cover that feels transplanted from somewhere ' +
      'wilder — humid, loud with insects, and noticeably darker than the ' +
      'fields you walked in from.',
  },

  T008: {
    tagline: 'High Peak of the Zambales range',
    whyHike: [
      'Pine forest at an altitude most Luzon hikers associate with Benguet',
      'One of the longest single trails in the region',
      'Cold nights and genuine remoteness',
      'Mining-road history written into the route itself',
    ],
    story:
      'Mount Tapulao is known locally as High Peak, and it is the highest ' +
      'point in the Zambales range. The number that defines it, though, is not ' +
      'its elevation but its length: the standard route from Palauig follows ' +
      'an old mining road for a very long way, and the distance rather than ' +
      'the gradient is what breaks people.\n\n' +
      'That road is the mountain\'s history. Chromite mining operated in these ' +
      'hills, and the track hikers walk today was cut for trucks rather than ' +
      'boots. It makes for straightforward navigation and punishing ' +
      'monotony — hours of loose rock underfoot with the summit staying ' +
      'stubbornly distant.\n\n' +
      'The payoff arrives near the top, where the vegetation changes character ' +
      'entirely. Pine forest takes over, the air turns cold, and the landscape ' +
      'stops resembling Zambales and starts resembling the Cordillera. ' +
      'Campsites among the pines are quiet in a way that lower mountains ' +
      'never manage, and night temperatures drop enough to matter.\n\n' +
      'Most groups take two days. Attempting it as a day hike is possible for ' +
      'the very fit and is generally regarded as a way to see a lot of gravel ' +
      'and not much else. The mountain rewards the slower approach, and the ' +
      'pines are worth arriving with enough energy left to notice them.',
  },

  T009: {
    tagline: 'Where the coast turns vertical',
    whyHike: [
      'Ocean views the entire way up the Zambales coastline',
      'Connects to Nagsasa and Silanguin coves for a hike-and-beach trip',
      'Exposed rock and steep grades that demand respect',
      'Far fewer crowds than the Batangas and Rizal peaks',
    ],
    story:
      'Mt. Balingkilat rises behind the coves of the Zambales coast, and it is ' +
      'one of the few Philippine mountains where the sea is a constant ' +
      'presence rather than a distant glimpse. The name is often translated in ' +
      'connection with lightning, and the mountain has a local reputation for ' +
      'weather that arrives fast.\n\n' +
      'It is a hard climb, and its difficulty is easy to underestimate because ' +
      'the elevation looks modest. The problem is exposure. Much of the route ' +
      'crosses open rock and grass with no shade at all, on a coast that gets ' +
      'strong sun for most of the year. Hikers who start late on Balingkilat ' +
      'tend to remember it for the heat rather than the view.\n\n' +
      'What makes it worth the effort is the setting. The trail can be linked ' +
      'with Nagsasa Cove and Silanguin Cove, which means a trip that combines ' +
      'a serious mountain with a boat ride and a night on a beach — a ' +
      'combination no other peak on this list offers quite so directly.\n\n' +
      'It sees far less traffic than the Rizal or Batangas day hikes, partly ' +
      'because of the approach, partly because word has not spread as widely. ' +
      'For hikers who have grown tired of queuing for photographs, that is ' +
      'the strongest argument for going.',
  },

  T010: {
    tagline: 'The Rockies above Taal Lake',
    whyHike: [
      'One of the best views of Taal Lake and Volcano anywhere',
      'A true day hike — up and down before lunch is realistic',
      'Three destinations in one: the Rockies, the grotto and the summit',
      'Easy public transport access from Manila',
    ],
    story:
      'Mt. Maculot is a Batangas institution. The mountain sits above Cuenca ' +
      'on the eastern shore of Taal Lake, and its most famous feature is not ' +
      'the summit at all but a rocky outcrop partway up, universally known as ' +
      'the Rockies.\n\n' +
      'The Rockies deliver the postcard: an open ledge looking straight across ' +
      'Taal Lake to the volcano island in its centre, with the crater lake ' +
      'inside it visible on clear days. It is one of the most photographed ' +
      'views in the country, and for many visitors it is where the hike ends — ' +
      'reached in roughly an hour and a half of steady uphill.\n\n' +
      'There are two other destinations. The grotto, a religious shrine on the ' +
      'mountainside, draws pilgrims as well as hikers. The actual summit sits ' +
      'higher and further back, is forested, and gives a different and less ' +
      'celebrated view. Doing all three makes for a full but very manageable ' +
      'day.\n\n' +
      'Its accessibility is both the attraction and the drawback. Weekends ' +
      'bring serious crowds, the trail is heavily trodden, and the Rockies ' +
      'can have a queue for photographs. Going on a weekday, or starting ' +
      'before dawn, transforms the experience entirely — and the sunrise from ' +
      'that ledge is worth the alarm.\n\n' +
      'The descent deserves a mention of its own. The trail is steep, dusty ' +
      'in dry months and slick in wet ones, and more hikers hurt themselves ' +
      'coming down Maculot than going up it. Take the last half hour slowly.',
  },
  T011: {
    tagline: 'Coffee at the summit cross',
    whyHike: [
      'Among the gentlest real mountains in Batangas',
      'Coffee farms along the trail, and coffee served near the top',
      'A white summit cross that has become a pilgrimage of sorts',
      'Shaded almost the whole way, unusual for the region',
    ],
    story:
      'Mt. Manabu is the friendliest mountain in the Malipunyo range, and it ' +
      'has built a reputation on hospitality rather than drama. The name is ' +
      'commonly explained as a contraction of "madaling abutin" — easy to ' +
      'reach — and the trail lives up to it.\n\n' +
      'The route climbs through working farmland in Sto. Tomas, Batangas, ' +
      'passing coffee plants, banana and other smallholdings before entering ' +
      'forest. That agricultural stretch is part of the charm: this is not ' +
      'wilderness but a cultivated mountainside where people live and work, ' +
      'and the trail runs through their livelihood.\n\n' +
      'The tradition most hikers remember is the coffee. A hut near the upper ' +
      'section, long associated with a caretaker known to generations of ' +
      'climbers, has served brewed local coffee to passing hikers, and for ' +
      'many the stop matters more than the summit. Arrangements change over ' +
      'the years, but the custom of pausing there has stuck.\n\n' +
      'At the top stands a large white cross, a landmark visible from the ' +
      'surrounding lowlands and a destination for religious visitors as well ' +
      'as hikers, particularly during Holy Week.\n\n' +
      'Shade is the practical advantage. Where Batulao and Maculot bake, ' +
      'Manabu keeps you under canopy for most of the climb, which makes it a ' +
      'far kinder introduction for anyone nervous about the heat.',
  },

  T012: {
    tagline: 'Finish the hike on a beach',
    whyHike: [
      'One of the only Luzon climbs that ends at the sea',
      'Rolling coastal pasture with constant sea breeze',
      'Camp on the summit, swim at Laiya the next morning',
      'A rare combination of mountain and beach in one trip',
    ],
    story:
      'Mt. Daguldol offers something almost no other mountain on this list ' +
      'can: a descent that finishes on sand. It rises above San Juan in ' +
      'Batangas, close to the beaches of Laiya, and the standard itinerary ' +
      'sends hikers up through pasture and forest, over the summit, and down ' +
      'to the coast.\n\n' +
      'The climb itself is unglamorous in the best way. Cattle graze the lower ' +
      'slopes, the trail crosses open grassland and smallholder farms, and the ' +
      'sea stays in view for much of the ascent. Sea breeze makes the exposure ' +
      'more bearable than it would be inland, though the middle sections are ' +
      'still genuinely steep.\n\n' +
      'Most groups camp on or near the summit. The appeal is obvious — ' +
      'sunset over water from a mountaintop, then the sound of surf ' +
      'somewhere below you in the dark — and it turns a moderate hike into a ' +
      'proper weekend.\n\n' +
      'The descent to the beach is the part people plan around. Arriving at ' +
      'Laiya sweaty and tired and walking straight into the sea is a specific ' +
      'pleasure that Daguldol regulars will describe at length.\n\n' +
      'Water is the constraint. There are sources along the route but they are ' +
      'seasonal and not always reliable, so most hikers carry what they need ' +
      'for the summit camp.',
  },

  T013: {
    tagline: 'Limestone, and a giant in chains',
    whyHike: [
      'Genuine rock scrambling within two hours of Manila',
      'Sharp limestone crags above the Wawa Gorge',
      'A cave with a real place in Philippine revolutionary history',
      'Pairs naturally with Binacayan for a two-peak day',
    ],
    story:
      'Mt. Pamitinan stands over the Wawa Gorge in Rodriguez, Rizal — ' +
      'Montalban to most people who go there — and it is where hikers from ' +
      'Metro Manila go when they want to use their hands. The limestone here ' +
      'is sharp, fractured and vertical in places, and the summit is a cluster ' +
      'of jagged rock rather than a comfortable clearing.\n\n' +
      'Two stories sit on this mountain. The older is the legend of Bernardo ' +
      'Carpio, a figure of extraordinary strength said to be trapped between ' +
      'two great rocks in these mountains, whose struggles were held to cause ' +
      'earthquakes. The legend became a symbol of a people held down and ' +
      'straining to break free, and it was read that way during the Spanish ' +
      'colonial period.\n\n' +
      'The second is documented history. In April 1895, Andres Bonifacio and ' +
      'fellow Katipuneros went to Pamitinan Cave and left inscriptions there ' +
      'declaring Philippine independence — an act that tied the mountain ' +
      'directly to the revolution that followed a year later.\n\n' +
      'Practically, the climb is short but demanding, with exposed scrambling ' +
      'near the top that is not for anyone uneasy about heights. Guides are ' +
      'required, the limestone is abrasive, and gloves are a genuinely good ' +
      'idea rather than an affectation.\n\n' +
      'Go on a weekday if you can. Pamitinan\'s combination of history, ' +
      'proximity to Manila and a summit that photographs well means weekend ' +
      'queues form on the scrambling sections, which is exactly where a queue ' +
      'is least welcome.',
  },

  T014: {
    tagline: 'Pamitinan\'s twin across the gorge',
    whyHike: [
      'The same limestone drama with noticeably fewer people',
      'Low-elevation sea of clouds over the Montalban countryside',
      'Views directly across to Pamitinan and the Wawa Dam',
      'Short enough to combine with a second peak in one day',
    ],
    story:
      'Mt. Binacayan faces Pamitinan across the Wawa Gorge, and the two are ' +
      'usually spoken of together. They are made of the same limestone, rise ' +
      'to almost the same height, and are separated by the river that cuts ' +
      'between them — so the view from either summit is largely a view of the ' +
      'other.\n\n' +
      'Binacayan is the quieter of the pair. Pamitinan has the cave, the ' +
      'legend and the historical marker, which draws the crowds; Binacayan ' +
      'gets the hikers who have already done Pamitinan, or who checked the ' +
      'queue and changed their minds. The rock is just as sharp and the ' +
      'scrambling just as engaging.\n\n' +
      'Its particular claim is the sea of clouds. At only a few hundred ' +
      'metres, it should not produce one — that phenomenon usually needs ' +
      'altitude — but the geography of the Montalban valley traps morning ' +
      'mist below the summits often enough that early starters are frequently ' +
      'rewarded. It is one of the lowest reliable sea-of-clouds spots in ' +
      'Luzon.\n\n' +
      'The practical note is the same as its twin: guides are required, the ' +
      'limestone will cut you if you fall on it, and the descent demands more ' +
      'attention than the climb. Doing both peaks in a day is common and ' +
      'genuinely satisfying, though it makes for a long one.',
  },

  T015: {
    tagline: 'Resting place of the hawk',
    whyHike: [
      'The most technical of the three Montalban limestone peaks',
      'A 360-degree summit with no comfortable place to sit',
      'Karst terrain that rewards confident scrambling',
      'Completes the Montalban trilogy with Pamitinan and Binacayan',
    ],
    story:
      'Mt. Hapunang Banoi is the third and hardest of the Montalban limestone ' +
      'peaks. The name refers to the resting place of the banoi — a hawk or ' +
      'eagle — and the summit lives up to it: a perch rather than a platform, ' +
      'with sheer drops and very little level ground.\n\n' +
      'Where Pamitinan and Binacayan are scrambles with a few exposed moments, ' +
      'Hapunang Banoi is more sustained. The karst here is heavily weathered ' +
      'into blades and pockets, sharp enough to shred gloves and skin, and the ' +
      'route requires committing moves on rock rather than walking with ' +
      'occasional assistance. Hikers who found the other two comfortable ' +
      'often find this one a step further than expected.\n\n' +
      'The reward is the view, which is genuinely 360 degrees. From the top ' +
      'the Sierra Madre stretches away on one side and the Montalban valley ' +
      'and the Rizal lowlands open on the other, with the neighbouring peaks ' +
      'below and the gorge somewhere beneath them.\n\n' +
      'Many hikers link all three in a single traverse, which has become a ' +
      'recognised challenge among Metro Manila climbers. It is a long, hot, ' +
      'abrasive day that finishes with hands in worse condition than legs — ' +
      'and it is among the best value rock days within striking distance of ' +
      'the capital.',
  },

  T016: {
    tagline: 'Marble river, limestone summit',
    whyHike: [
      'The Tinipak River — white rock and startlingly clear water',
      'A summit of exposed limestone with Sierra Madre views',
      'Caves, swimming holes and a river you will not want to leave',
      'Guided by the Dumagat-Remontado community of Daraitan',
    ],
    story:
      'Mt. Daraitan is really two attractions that happen to share a name. The ' +
      'mountain is a limestone peak on the edge of the Sierra Madre in Tanay, ' +
      'Rizal, with a steep climb to a rocky summit and a long view across the ' +
      'range. The Tinipak River runs at its base, and for a good number of ' +
      'visitors the river is the reason they came.\n\n' +
      'Tinipak is unusual. The riverbed is formed of huge pale boulders, often ' +
      'described as marble, worn smooth and stacked in formations you can ' +
      'climb over and swim between. The water runs cold and remarkably clear, ' +
      'and there are caves and pools along its length. After a hot climb it ' +
      'is an almost absurdly good reward.\n\n' +
      'The area is the ancestral domain of the Dumagat-Remontado people, and ' +
      'visits are organised through the community in Barangay Daraitan. Local ' +
      'guides are mandatory, registration is enforced, and visitor numbers ' +
      'have been managed in response to the volume of weekend traffic.\n\n' +
      'The combination of a genuine summit and a genuine river makes this one ' +
      'of the best single-overnight trips in the region. Go in the dry season ' +
      'if you want the river at its clearest, and treat the water as the ' +
      'community\'s resource rather than a swimming pool.',
  },

  T017: {
    tagline: 'A sea of clouds that starts before sunrise',
    whyHike: [
      'A night hike that puts you on the summit for first light',
      'Sea of clouds at an unusually low elevation',
      'Gentle enough for genuine first-timers',
      'Rock formations that make the summit feel bigger than it is',
    ],
    story:
      'Mt. Kulis in Tanay is a mountain built around a single moment. The ' +
      'standard itinerary is a night hike — leaving the jump-off in darkness, ' +
      'walking by headlamp, and reaching the summit in time for the sun to ' +
      'come up over the Sierra Madre with mist pooled in the valleys ' +
      'below.\n\n' +
      'That it works at all is slightly surprising. Sea of clouds is usually ' +
      'an altitude phenomenon, the preserve of Pulag and the high Cordillera. ' +
      'Kulis manages it because of how cold air settles in the valleys around ' +
      'Tanay overnight, filling them with mist that burns off within an hour ' +
      'or two of sunrise. Arrive late and you have climbed a pleasant small ' +
      'hill; arrive on time and you have the view people come for.\n\n' +
      'The climb is well within reach of beginners — short, not especially ' +
      'steep, and navigable in the dark with a guide. That makes it a popular ' +
      'first mountain for people who want the reward without a full day of ' +
      'suffering to earn it.\n\n' +
      'The summit area has scattered rock formations that give it more ' +
      'character than the elevation suggests, and enough room to sit and wait ' +
      'for the light. Bring a jacket. It is colder up there at four in the ' +
      'morning than anyone expects in Rizal.',
  },

  T018: {
    tagline: 'Grassland ridges and a hidden waterfall',
    whyHike: [
      'Open rolling ridges with almost no tree cover to block the view',
      'Kay-ibon Falls as a side trip on the way out',
      'Several connected ridges, so the route can be short or long',
      'Cool breeze on the ridgeline even in the middle of the day',
    ],
    story:
      'Mt. Batolusong is a ridge walk rather than a summit push. The trail ' +
      'above Tanay climbs to a series of connected open ridges — Duhatan and ' +
      'Rangyayan among them — covered in grass and cut by wind, with views ' +
      'over the Rizal lowlands on one side and the Sierra Madre rolling away ' +
      'on the other.\n\n' +
      'The character of the hike comes from that openness. There is very ' +
      'little canopy, which means sun exposure but also means you see ' +
      'everything, continuously, for most of the walk. The ridges rise and dip ' +
      'in a way that keeps revealing new ground rather than presenting one ' +
      'view at the end.\n\n' +
      'The usual itinerary includes Kay-ibon Falls, reached by dropping off ' +
      'the ridge into a wooded gully. It is a genuinely good waterfall rather ' +
      'than a token one, and the cold water at the end of an exposed ridge ' +
      'walk is well judged.\n\n' +
      'Because the ridges connect, groups can tailor the distance — a short ' +
      'outing to the first viewpoint, or a longer traverse taking in several. ' +
      'That flexibility makes it a good choice for mixed groups where not ' +
      'everyone wants the same day.\n\n' +
      'Start early. The grass offers no shelter, and by late morning the ' +
      'ridgeline is a different and less pleasant place.',
  },

  T019: {
    tagline: 'Above the lake, beside the wind farms',
    whyHike: [
      'Sweeping views over Laguna de Bay, the largest lake in the country',
      'Wind turbines on the neighbouring ridges, visible from the summit',
      'A mix of shaded forest and open grass, so the climb varies',
      'Quieter than the Tanay peaks despite similar access',
    ],
    story:
      'Mt. Sembrano rises on the Rizal side of Laguna de Bay, near Pililla and ' +
      'the Jalajala peninsula, and its defining feature is water. From the ' +
      'summit the lake spreads out below — Laguna de Bay is the largest in the ' +
      'Philippines — with the peninsula reaching into it and, on clear days, ' +
      'the far shore and the mountains beyond.\n\n' +
      'The second feature is modern. The Pililla wind farm occupies the ridges ' +
      'nearby, and its turbines are visible from much of the climb. Opinions ' +
      'differ on whether they improve the view or intrude on it, but they give ' +
      'the landscape a distinctive look and have made the area a destination ' +
      'in their own right.\n\n' +
      'The trail alternates between forest and open grassland, which makes it ' +
      'more varied than the purely exposed ridge walks nearby. The shaded ' +
      'sections are welcome; the open ones are where the views arrive.\n\n' +
      'It sees noticeably fewer hikers than Daraitan or Batolusong despite ' +
      'comparable access from Manila, which is part of the appeal for anyone ' +
      'tired of weekend queues. The summit is usually uncrowded even on a ' +
      'Saturday, and there is room to sit and watch the light move across the ' +
      'lake without negotiating for space.\n\n' +
      'Haze is the one thing that can spoil it. Laguna de Bay sits in a basin ' +
      'ringed by dense population, and on still days the far shore disappears ' +
      'into it. Clear weather after rain gives the best chance of the long ' +
      'view the mountain is capable of.',
  },

  T020: {
    tagline: 'Through the orchards to open grass',
    whyHike: [
      'Fruit orchards on the lower slopes, unusual on a hiking trail',
      'Views of Laguna\'s lakes and the Makiling and Banahaw massifs',
      'Short and forgiving, well suited to a first climb',
      'Very close to Manila for a half-day trip',
    ],
    story:
      'Mt. Kalisungan sits above Calauan in Laguna, and the walk up it passes ' +
      'through working orchards — lanzones, rambutan and coconut on the lower ' +
      'slopes, depending on the season. It is farmland rather than forest for ' +
      'the first stretch, and that gives the climb a domestic, lived-in ' +
      'quality that the wilder Rizal peaks do not have.\n\n' +
      'Higher up the cultivation gives way to open cogon grass, and the views ' +
      'arrive. Laguna\'s seven lakes are visible in the lowlands, Mt. Makiling ' +
      'sits to the west, and on a clear day the bulk of Banahaw and Cristobal ' +
      'fills the horizon to the south. For a mountain of this modest ' +
      'elevation, the sightlines are unusually generous.\n\n' +
      'It is genuinely beginner-friendly. The trail is short, the gradient is ' +
      'reasonable, and the whole thing can be done as a half-day out of ' +
      'Manila without a pre-dawn start. Groups often treat it as a warm-up ' +
      'before committing to Makiling or a Batangas overnight.\n\n' +
      'The main hazard is sun rather than terrain. The upper grassland has no ' +
      'shade, the cogon can be head-high in places, and it holds heat. A hat ' +
      'and long sleeves are worth more here than technical gear.\n\n' +
      'If the season is right, ask before picking anything. The orchards are ' +
      'someone\'s income, and the goodwill that keeps this trail open rests on ' +
      'hikers understanding they are walking through a farm, not a park.',
  },
  T021: {
    tagline: 'The enchanted mountain of Los Baños',
    whyHike: [
      'Exceptional biodiversity inside a protected forest reserve',
      'Mud Springs and Flatrocks as landmarks along the way',
      'A mossy summit that feels far higher than it is',
      'The Maria Makiling legend, known to every Filipino schoolchild',
    ],
    story:
      'Mt. Makiling is a dormant volcano on the border of Laguna and ' +
      'Batangas, and the UPLB trail approaches it from Los Baños through the ' +
      'forest reserve managed by the University of the Philippines. That ' +
      'protection matters: the mountain holds one of the richest concentrations ' +
      'of plant and animal species in the country, and the walk up is as much ' +
      'a biology lesson as a climb.\n\n' +
      'The trail passes numbered stations, the Mud Springs — a geothermal ' +
      'feature where the ground bubbles and steams — and the Flatrocks, a ' +
      'river section that makes a natural rest stop. Higher up the forest ' +
      'turns mossy, with trees draped in epiphytes and the light going green ' +
      'and dim. The peak most hikers reach is known as Peak 2.\n\n' +
      'No Philippine mountain carries a better-known legend. Maria Makiling is ' +
      'the diwata said to guard the mountain, protective of its forest and its ' +
      'creatures, and generous to those who treat it well. The story appears ' +
      'in school readers, in Rizal\'s writing, and in the way people still ' +
      'talk about getting lost on the slopes.\n\n' +
      'Limatik — small forest leeches — are the practical reality of the wet ' +
      'season here. They are harmless and deeply unpleasant, and regulars ' +
      'wear leech socks without embarrassment.',
  },

  T022: {
    tagline: 'The hard way up Makiling',
    whyHike: [
      'A steep, technical alternative to the UPLB approach',
      'A genuine traverse between two provinces in one day',
      'Thick jungle and ridge scrambling on the Batangas side',
      'The same mountain, a completely different experience',
    ],
    story:
      'The MTP trail climbs Makiling from the Sto. Tomas side in Batangas, and ' +
      'it bears very little resemblance to the UPLB route on the Laguna face. ' +
      'Where the university trail is graded, signposted and walked by students ' +
      'and researchers, this side is steep, rough and overgrown, and it is ' +
      'the one experienced hikers recommend when someone says Makiling was ' +
      'too easy.\n\n' +
      'The difficulty is sustained rather than concentrated. The route gains ' +
      'height quickly through dense vegetation, with sections that require ' +
      'pulling on roots and branches and ridge segments narrow enough to ' +
      'demand attention. Rain turns the clay surface into something closer to ' +
      'a slide than a path.\n\n' +
      'Most groups climb this side and descend to Los Baños, making a ' +
      'province-to-province traverse in a single long day. Doing it in that ' +
      'direction means the hard work comes first and the gentler, more ' +
      'scenic half comes when the legs are tired — generally judged the right ' +
      'way round.\n\n' +
      'The forest is the compensation. This face is less visited, which shows ' +
      'in the density of growth and the amount of wildlife noise. The mountain ' +
      'feels genuinely wild here in a way that the UPLB trail, for all its ' +
      'biodiversity, does not quite manage.\n\n' +
      'Do not attempt it as your first Makiling. Knowing the mountain from ' +
      'the Laguna side makes the traverse far more manageable, because you ' +
      'will already know what the second half asks of you.',
  },

  T023: {
    tagline: 'The Devil\'s Mountain',
    whyHike: [
      'A reputation unlike any other mountain in the Philippines',
      'Dense, dark rainforest and a misty volcanic crater',
      'Stands opposite Banahaw, the "holy mountain", in local belief',
      'A serious climb that stays genuinely quiet year-round',
    ],
    story:
      'Mt. Cristobal is known as the Devil\'s Mountain, and the name is not a ' +
      'marketing invention. It stands beside Mt. Banahaw on the Laguna–Quezon ' +
      'border, and in the folk belief of the region the two are opposites: ' +
      'Banahaw is the holy mountain, a site of pilgrimage for religious sects ' +
      'for over a century, while Cristobal is where the other thing lives.\n\n' +
      'Hikers report the atmosphere more consistently than they report the ' +
      'views. The forest is dense and dark, the mist sits in it for most of ' +
      'the day, and sound behaves strangely under that much canopy. Stories of ' +
      'disorientation, of groups hearing things, of people turning back ' +
      'without being able to explain why, are a standard part of the ' +
      'mountain\'s literature. Whether that is the place or the expectation is ' +
      'left to the individual.\n\n' +
      'Setting the folklore aside, it is a demanding rainforest climb to a ' +
      'crater rim, with steep muddy sections, thick vegetation and limited ' +
      'water. The crater itself is forested and often fogged in, which ' +
      'frustrates anyone expecting a panorama and delights anyone who came ' +
      'for the mood.\n\n' +
      'It sees far fewer climbers than Makiling next door. Guides are ' +
      'strongly advised — the trail network is confusing and the consequences ' +
      'of getting it wrong here are real.',
  },

  T024: {
    tagline: 'A green ridge above the dive capital',
    whyHike: [
      'Rolling coastal hills with views over two bays',
      'Short, gentle and suitable for almost anyone',
      'Anilao\'s diving and snorkelling in the same trip',
      'Sunset from the ridge with the sea on both sides',
    ],
    story:
      'Gulugod Baboy takes its name from the shape of its ridgeline — the ' +
      'phrase translates roughly as pig\'s spine, describing the series of ' +
      'humps running along the top. It sits above Mabini in Batangas, in the ' +
      'Anilao area better known for scuba diving than hiking.\n\n' +
      'The climb is short and the gradient is kind, which has made it one of ' +
      'the most reliable recommendations for people who want a mountain ' +
      'without committing to a mountain. Much of the route is open grass, so ' +
      'views arrive early and stay. From the ridge you look over Balayan Bay ' +
      'on one side and Batangas Bay on the other, with Sombrero Island sitting ' +
      'offshore and Maricaban Island beyond it.\n\n' +
      'Cattle graze the upper slopes, which keeps the grass short and gives ' +
      'the ridge an oddly pastoral feel — closer to a hillside in temperate ' +
      'farmland than a tropical peak.\n\n' +
      'The real argument for it is the combination. Anilao is one of the ' +
      'country\'s best-known diving and snorkelling destinations, and a ' +
      'weekend here can pair a sunrise ridge walk with an afternoon in the ' +
      'water. Few mountains on this list sit so close to something entirely ' +
      'different and equally good.\n\n' +
      'Sunset from the ridge is the local favourite. Bring a headlamp for ' +
      'the walk down.',
  },

  T025: {
    tagline: 'The stone chair at the end of a long walk',
    whyHike: [
      'Silyang Bato — a rock formation genuinely worth the distance',
      'Crown-like composite peaks, unusual in shape and colour',
      'A long approach across pasture and riverbed',
      'Solitude, because the distance filters out casual visitors',
    ],
    story:
      'Mt. Marami in Maragondon, Cavite, is defined by its approach. The ' +
      'summit is not especially high, but reaching it means a long trek across ' +
      'open pasture, through farmland and along riverbeds, with multiple ' +
      'crossings and very little shade. The walking is easy; there is simply ' +
      'a great deal of it.\n\n' +
      'The landmark is Silyang Bato — the stone chair — a rock formation near ' +
      'the summit that has become the mountain\'s signature. The upper peaks ' +
      'are composite rock, weathered into crown-like shapes that look ' +
      'assembled rather than eroded, and the final scramble onto them is the ' +
      'one technical moment in an otherwise long walk.\n\n' +
      'That distance is the mountain\'s protection. Marami does not get the ' +
      'weekend crowds that fill Pico de Loro a short drive away, because the ' +
      'trek deters anyone looking for a quick photograph. Hikers who make the ' +
      'effort usually have the summit rocks to themselves.\n\n' +
      'The river crossings are the variable. In dry months they are ankle-deep ' +
      'and pleasant; after heavy rain they become the reason a trip gets ' +
      'called off. Check conditions, and ask locally rather than guessing — ' +
      'the difference between the two states can arrive overnight.\n\n' +
      'Start very early. The pasture sections in full afternoon sun are what ' +
      'people remember, and not fondly.',
  },

  T026: {
    tagline: 'Pines, streams and a narrow summit ridge',
    whyHike: [
      'Cordillera pine forest without the crowds of Ulap next door',
      'Mountain streams along the route, rare on Luzon day hikes',
      'A narrow rocky summit with views down to the Agno River',
      'Cool Benguet air within reach of Baguio',
    ],
    story:
      'Mt. Pigingan sits in Itogon, Benguet, in the same country as Mt. Ulap ' +
      'and reached from the same general area, but it gets a fraction of the ' +
      'visitors. For hikers who found Ulap crowded, it is the obvious ' +
      'alternative.\n\n' +
      'The route climbs through Cordillera pine, the open, sweet-smelling ' +
      'forest that makes Benguet feel like a different country from the rest ' +
      'of Luzon. Mountain streams cross the trail in several places, which is ' +
      'uncommon enough on Philippine day hikes to be worth noting — most ' +
      'routes at this elevation are dry, and carrying less water changes the ' +
      'character of a climb.\n\n' +
      'The summit is a narrow rocky ridge rather than a clearing, with steep ' +
      'ground falling away and a long view down toward the Agno River valley. ' +
      'The Agno is the river the Cordillera\'s hydroelectric dams sit on, and ' +
      'the landscape below carries the marks of both mining and power ' +
      'generation alongside the forest.\n\n' +
      'It is a moderate climb rather than an easy one — steeper than Ulap, ' +
      'less developed, with a trail that assumes you know what you are doing. ' +
      'Guides from the local community are the sensible choice, and the fee ' +
      'supports the same kind of arrangement that made Ulap work.\n\n' +
      'Pair it with Ulap over a weekend if you are coming up from Manila. The ' +
      'two sit close enough to combine, and doing both gives a fuller picture ' +
      'of Itogon than either manages alone.',
  },

  T027: {
    tagline: 'Little Pulag, without the two-day commitment',
    whyHike: [
      'A grassy summit plateau with genuine 360-degree views',
      'Reachable in well under an hour of walking',
      'Sunrise over the Benguet valleys, close to Baguio',
      'The easiest real summit on this entire list',
    ],
    story:
      'Mt. Yangbew — sometimes written Jambo — sits above La Trinidad in ' +
      'Benguet, a short ride from Baguio, and it is often called Little Pulag. ' +
      'The comparison is about texture rather than scale: a broad grassy ' +
      'plateau at the top, open in every direction, that resembles Pulag\'s ' +
      'famous summit grassland in miniature.\n\n' +
      'What makes it remarkable is the effort required, which is almost none. ' +
      'The walk from the jump-off is short and gentle enough that visitors in ' +
      'ordinary shoes manage it, and the summit is broad enough for a crowd to ' +
      'spread out across. For anyone who wants a Cordillera sunrise without ' +
      'permits, guides, altitude sickness or a two-day itinerary, this is the ' +
      'answer.\n\n' +
      'The views justify it. The plateau looks out over the La Trinidad valley ' +
      'and the surrounding Benguet ridges, and on clear mornings the mist ' +
      'sits in the valleys below while the sun comes up over the higher ' +
      'mountains to the east.\n\n' +
      'Its accessibility is also the caveat. Yangbew gets busy, particularly ' +
      'at sunrise and on weekends, and the grassland has suffered from the ' +
      'traffic — access arrangements have changed over the years in response. ' +
      'Treat it as the fragile thing it is, and check whether it is open ' +
      'before making the trip.',
  },

  T028: {
    tagline: 'River trekking to a waterfall in Tarlac',
    whyHike: [
      'A genuine river trek rather than a dry-footed trail',
      'Ubod Falls as a side trip most groups build the day around',
      'Steep ridge climbing between the water sections',
      'Aeta guides who know the river as their own ground',
    ],
    story:
      'Mt. Damas in San Clemente, Tarlac, is a mountain that spends a lot of ' +
      'its time in water. The route involves substantial river trekking — ' +
      'walking in and alongside the riverbed rather than on a path above it — ' +
      'interspersed with steep climbs over ridges when the river becomes ' +
      'impassable.\n\n' +
      'That structure makes it unusual and physically varied. River sections ' +
      'are cool and slow-going, with attention needed for footing on wet ' +
      'stone; the ridge climbs are hot, steep and dry. A day on Damas asks for ' +
      'two different kinds of fitness and leaves most people tired in ' +
      'unfamiliar places.\n\n' +
      'The side trip to Ubod Falls is what many groups actually come for. It ' +
      'is a proper waterfall with a pool at its base, reached by following the ' +
      'river further than the summit route strictly requires, and it turns a ' +
      'hard climb into a rewarding one.\n\n' +
      'The area is home to Aeta communities, and guides from those communities ' +
      'lead most trips. Their knowledge of the river matters more than usual ' +
      'here, because the route changes with water levels and what worked last ' +
      'month may not work today.\n\n' +
      'Avoid it outright after heavy rain. River trekking and flash flooding ' +
      'are a combination with no margin for error.',
  },

  T029: {
    tagline: 'Deep jungle in the heart of Bicol',
    whyHike: [
      'One of the wildest multi-day treks in southern Luzon',
      'Mossy forest and dense biodiversity at altitude',
      'River crossings and genuine remoteness',
      'Very few other hikers — this is not a weekend peak',
    ],
    story:
      'Mt. Labo straddles the boundary country of Camarines Norte, and it is ' +
      'the most remote mountain on this list. There is no quick version: the ' +
      'standard route is a long multi-day trek through jungle, with river ' +
      'crossings, thick vegetation and campsites that take a full day of ' +
      'walking to reach.\n\n' +
      'The forest is the reason to go. Bicol\'s wet climate supports dense, ' +
      'layered growth, and the upper slopes carry mossy forest — the trees ' +
      'shrunken and wrapped in moss and epiphytes, the ground spongy, the ' +
      'light filtered green. It is a habitat type that only appears above a ' +
      'certain altitude and rainfall, and Labo has it in good condition ' +
      'precisely because so few people go.\n\n' +
      'That remoteness cuts both ways. Trail information is thinner than for ' +
      'the Luzon classics, conditions change between seasons, and local guides ' +
      'are not optional. Groups typically arrange everything through the ' +
      'municipality or established contacts rather than turning up.\n\n' +
      'Rain is the defining variable. Bicol receives a great deal of it, ' +
      'typhoons included, and a route that is merely difficult in March can ' +
      'be genuinely dangerous in the wet months. Plan the season first and ' +
      'the itinerary second — and build in a spare day, because this is not a ' +
      'mountain to rush off.',
  },

  T030: {
    tagline: 'The classic Cordillera traverse',
    whyHike: [
      'Pine forest at altitude for two days of walking',
      'Passing through working Cordillera villages, not around them',
      'A true traverse — you finish in a different province',
      'Widely regarded as one of the best multi-day routes in Luzon',
    ],
    story:
      'Mt. Ugo is the traverse that experienced Filipino hikers recommend when ' +
      'someone asks what to do after Pulag. The route runs between Kayapa in ' +
      'Nueva Vizcaya and Itogon in Benguet, crossing high pine ridges over two ' +
      'days and finishing in a different province from the one it started ' +
      'in.\n\n' +
      'What sets it apart is that it passes through inhabited country. The ' +
      'trail links Cordillera villages — Indupa and Lusod among the names ' +
      'that recur in trip accounts — and walkers pass schools, gardens and ' +
      'houses rather than skirting them. It is a working landscape, and the ' +
      'hospitality along it is part of what people remember. The ruins of an ' +
      'old sawmill at Lusod are a landmark on the route.\n\n' +
      'The pine forest is the other draw. Long stretches of the walk run ' +
      'through open Benguet pine at altitude, cool and quiet, with the ' +
      'Cordillera folding away in every direction.\n\n' +
      'The mountain also carries a sombre piece of history: a Philippine ' +
      'Airlines aircraft crashed on its slopes in 1987, and the site is part ' +
      'of local memory.\n\n' +
      'Two days is the standard, three is more comfortable, and the ' +
      'distances are long enough that fitness matters more than technique. ' +
      'Arrange guides and village stays in advance.',
  },
};

/** Editorial content for a trail, or undefined if none is written yet. */
export function storyFor(id: string): TrailStory | undefined {
  return TRAIL_STORIES[id];
}
