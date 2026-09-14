export interface PostComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  timeAgo: string;
  isPro?: boolean;
  content: string;
  tags?: string[];
  images: string[];
  likes: number;
  liked: boolean;
  comments: PostComment[];
}
