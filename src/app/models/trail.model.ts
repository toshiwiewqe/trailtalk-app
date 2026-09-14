export type TrailCategory = 'Popular' | 'Scenic' | 'Nearby' | 'Forest';

export interface TrailReview {
  author: string;
  avatar: string;
  rating: number;      // 1-5
  date: string;
  text: string;
  photos?: string[];
}

export interface CommunityStory {
  title: string;
  author: string;
  image: string;
}

export interface Trail {
  id: string;
  name: string;
  region: string;
  image: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  distance: string;
  elevation: string;
  duration: string;
  rating: number;
  category: TrailCategory;
  description: string;

  // Fields the trail-detail template needs that were missing before:
  status: string;          // e.g. 'OPEN' / 'CLOSED'
  height: string;          // e.g. '1846 m' (can reuse elevation if same value)
  trailType: string;       // e.g. 'Mossy Forest', 'Grassland'
  price: number;           // e.g. 3500
  reviewCount: number;
  reviews: TrailReview[];
  communityStories: CommunityStory[];
}
