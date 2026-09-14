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
