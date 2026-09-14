export type TrailCategory = 'Nearby' | 'Popular' | 'Scenic' | 'Forest';
export type Difficulty = 'Easy' | 'Moderate' | 'Hard';

export interface Trail {
  id: string;
  name: string;
  region: string;
  image: string;
  difficulty: Difficulty;
  distance: string;
  elevation: string;
  duration: string;
  rating: number;
  category: TrailCategory;
  description: string;
}
