export interface UpcomingAdventure {
  id: string;
  trailId: string;
  name: string;
  image: string;
  date: string;
  duration: string;
}

export interface UserProfile {
  name: string;
  location: string;
  bio: string;
  avatar: string;
  totalHikes: number;
  totalDistanceKm: number;
  highestPeakM: number;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}
