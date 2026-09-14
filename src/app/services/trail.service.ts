import { Injectable, signal, computed } from '@angular/core';
import { Trail, TrailCategory } from '../models/trail.model';

@Injectable({ providedIn: 'root' })
export class TrailService {
  private readonly _trails = signal<Trail[]>([
    {
      id: 't1',
      name: 'Mt. Ulap Traverse',
      region: 'Itogon, Benguet',
      image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Moderate',
      distance: '8.4 km',
      elevation: '1846 m',
      duration: '4-6 hrs',
      rating: 4.8,
      category: 'Popular',
      description: 'A stunning sea-of-clouds traverse through the Cordillera range, famous for its rolling grasslands, pine forests, and panoramic sunrise views. A must-do for anyone chasing the iconic Ampucao-Sta. Fe ridgeline walk.',
      status: 'OPEN',
      height: '1846 m',
      trailType: 'Grassland',
      price: 2500,
      reviewCount: 96,
      reviews: [
        {
          author: 'Sofia Vergara',
          avatar: 'https://i.pravatar.cc/100?img=5',
          rating: 5,
          date: '2 days ago',
          text: 'Amazing sunrise views over the sea of clouds. Trail is well marked and the guides were great.',
          photos: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop',
          ],
        },
      ],
      communityStories: [
        {
          title: 'Sea of Clouds at Dawn',
          author: '@trail_juan',
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop',
        },
        {
          title: 'Ridgeline Sunset',
          author: '@hikergirl_ph',
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 't2',
      name: 'Mt. Dulang-Dulang',
      region: 'Kitanglad Range, Bukidnon',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Hard',
      distance: '14 km',
      elevation: '2941 m',
      duration: '2 days',
      rating: 4.9,
      category: 'Scenic',
      description: 'The second highest peak in the Philippines, home to ancient mossy forests, pygmy trees, and rare pitcher plants. A challenging climb rewarded with breathtaking views over the Kitanglad range.',
      status: 'OPEN',
      height: '2941 m',
      trailType: 'Mossy Forest',
      price: 3500,
      reviewCount: 128,
      reviews: [
        {
          author: 'Sofia Vergara',
          avatar: 'https://i.pravatar.cc/100?img=5',
          rating: 5,
          date: '2 days ago',
          text: 'The mossy forest was mystical and ancient. Definitely bring extra layers, it gets extremely cold at the summit. The "White Rock" view of Kitanglad was breathtaking.',
          photos: [
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=400&auto=format&fit=crop',
          ],
        },
      ],
      communityStories: [
        {
          title: 'Mist in the Mossy Forest',
          author: '@nature_boy',
          image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=400&auto=format&fit=crop',
        },
        {
          title: 'Sacred Talaandig Grounds',
          author: '@ecos_x',
          image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 't3',
      name: 'Mt. Pulag Ambangeg Trail',
      region: 'Kabayan, Benguet',
      image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Easy',
      distance: '11 km',
      elevation: '2922 m',
      duration: '2 days',
      rating: 4.7,
      category: 'Nearby',
      description: 'The most beginner-friendly route up the "Playground of the Gods". Wide grassy trails lead to a legendary sea of clouds above the summit campsite.',
      status: 'OPEN',
      height: '2922 m',
      trailType: 'Grassland',
      price: 3000,
      reviewCount: 214,
      reviews: [
        {
          author: 'Miguel Santos',
          avatar: 'https://i.pravatar.cc/100?img=12',
          rating: 5,
          date: '1 week ago',
          text: 'Perfect first major climb. The sea of clouds at the summit campsite is unforgettable.',
        },
      ],
      communityStories: [
        {
          title: 'Playground of the Gods',
          author: '@pulag_chaser',
          image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=400&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 't4',
      name: 'Mt. Kitanglad Forest Trail',
      region: 'Bukidnon',
      image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Hard',
      distance: '16 km',
      elevation: '2899 m',
      duration: '2 days',
      rating: 4.6,
      category: 'Forest',
      description: 'A dense mossy-forest expedition through a protected natural park, rich in biodiversity and home to the Philippine eagle. Expect muddy trails and cool mountain air.',
      status: 'OPEN',
      height: '2899 m',
      trailType: 'Mossy Forest',
      price: 3800,
      reviewCount: 61,
      reviews: [
        {
          author: 'Ana Reyes',
          avatar: 'https://i.pravatar.cc/100?img=9',
          rating: 4,
          date: '3 weeks ago',
          text: 'Very muddy but worth it for the biodiversity. Saw traces of Philippine eagle nesting sites.',
        },
      ],
      communityStories: [
        {
          title: 'Home of the Eagle',
          author: '@birdwatcher_ph',
          image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=400&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 't5',
      name: 'Mt. Batulao Rolling Hills',
      region: 'Nasugbu, Batangas',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Easy',
      distance: '9 km',
      elevation: '811 m',
      duration: '3-4 hrs',
      rating: 4.5,
      category: 'Nearby',
      description: 'A picture-perfect day hike with rolling green ridges just outside Manila, ideal for beginners looking for a scenic weekend escape.',
      status: 'OPEN',
      height: '811 m',
      trailType: 'Grassland',
      price: 1200,
      reviewCount: 340,
      reviews: [
        {
          author: 'Carlo Dizon',
          avatar: 'https://i.pravatar.cc/100?img=15',
          rating: 4,
          date: '4 days ago',
          text: 'Great for a Saturday day trip. Gets crowded early but the rolling hills views are worth it.',
        },
      ],
      communityStories: [
        {
          title: 'Rolling Green Ridges',
          author: '@weekend_wanderer',
          image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=400&auto=format&fit=crop',
        },
      ],
    },
    {
      id: 't6',
      name: 'Mt. Kitanglad Sea of Clouds',
      region: 'Bukidnon',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
      difficulty: 'Moderate',
      distance: '10 km',
      elevation: '2100 m',
      duration: '1 day',
      rating: 4.4,
      category: 'Scenic',
      description: 'A shorter viewpoint trek offering one of the best sunrise sea-of-clouds vantage points in Mindanao.',
      status: 'OPEN',
      height: '2100 m',
      trailType: 'Viewpoint',
      price: 1800,
      reviewCount: 47,
      reviews: [
        {
          author: 'Liza Cruz',
          avatar: 'https://i.pravatar.cc/100?img=20',
          rating: 4,
          date: '5 days ago',
          text: 'Shorter than the full traverse but the sunrise view is just as good. Great for a single-day trip.',
        },
      ],
      communityStories: [
        {
          title: 'Sunrise Over Mindanao',
          author: '@mindanao_treks',
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop',
        },
      ],
    },
  ]);

  readonly trails = computed(() => this._trails());

  getById(id: string): Trail | undefined {
    return this._trails().find(t => t.id === id);
  }

  search(query: string, category: TrailCategory | 'All' = 'All'): Trail[] {
    const q = query.trim().toLowerCase();
    return this._trails().filter(t => {
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.region.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || t.category === category;
      return matchesQuery && matchesCategory;
    });
  }
}
