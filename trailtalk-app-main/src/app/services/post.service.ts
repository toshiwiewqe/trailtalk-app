import { Injectable, signal, computed } from '@angular/core';
import { Post, PostComment } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly _posts = signal<Post[]>([
    {
      id: 'p1',
      author: 'Elena Rivera',
      handle: '@elena_hikes',
      avatar: 'https://i.pravatar.cc/150?img=47',
      timeAgo: '2h ago',
      content: 'Just finished the Mt. Ulap Traverse! The sea of clouds this morning was absolutely breathtaking. Highly recommend starting before sunrise to catch the best views. 🏔️✨',
      tags: ['#MtUlap', '#HikingPH'],
      images: ['https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1200&auto=format&fit=crop'],
      likes: 1200,
      liked: false,
      comments: [
        { id: 'c1', author: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=12', text: 'Absolutely stunning! Adding this to my list.', timeAgo: '1h ago' },
        { id: 'c2', author: 'Priya Santos', avatar: 'https://i.pravatar.cc/150?img=32', text: 'What time did you start the hike?', timeAgo: '45m ago' },
      ],
    },
    {
      id: 'p2',
      author: 'Marcus Chen',
      handle: '@marcus_trails',
      avatar: 'https://i.pravatar.cc/150?img=12',
      timeAgo: '5h ago',
      isPro: true,
      content: 'Explored some new paths in the Cordillera range. The mossy forest sections are magical. 🌲💚',
      images: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800&auto=format&fit=crop',
      ],
      likes: 452,
      liked: false,
      comments: [
        { id: 'c3', author: 'Elena Rivera', avatar: 'https://i.pravatar.cc/150?img=47', text: 'Love the mossy forest shots!', timeAgo: '3h ago' },
      ],
    },
    {
      id: 'p3',
      author: 'Isabel Cruz',
      handle: '@isabel_c',
      avatar: 'https://i.pravatar.cc/150?img=25',
      timeAgo: '1d ago',
      content: 'Reminder to everyone heading to Dulang-Dulang this weekend: bring extra layers, it gets freezing at the summit campsite. Stay safe out there! ❄️',
      tags: ['#TrailSafety'],
      images: [],
      likes: 289,
      liked: true,
      comments: [],
    },
  ]);

  readonly posts = computed(() => this._posts());

  toggleLike(id: string) {
    this._posts.update(list =>
      list.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
    );
  }

  addComment(postId: string, text: string) {
    const comment: PostComment = {
      id: 'c' + Date.now(),
      author: 'Alex Rivera',
      avatar: 'https://i.pravatar.cc/150?img=68',
      text,
      timeAgo: 'now',
    };
    this._posts.update(list =>
      list.map(p => p.id === postId ? { ...p, comments: [...p.comments, comment] } : p)
    );
  }

  addPost(content: string, image?: string) {
    const post: Post = {
      id: 'p' + Date.now(),
      author: 'Alex Rivera',
      handle: '@alex_rivera',
      avatar: 'https://i.pravatar.cc/150?img=68',
      timeAgo: 'now',
      content,
      images: image ? [image] : [],
      likes: 0,
      liked: false,
      comments: [],
    };
    this._posts.update(list => [post, ...list]);
  }
}
