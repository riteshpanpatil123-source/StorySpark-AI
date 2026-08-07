import { Story, Joke, Character, World } from '@/types';

const INITIAL_STORIES: Story[] = [
  {
    id: 'story_1',
    userId: 'usr_mock_123',
    authorName: 'Alex Rivers',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    title: 'Echoes of Orion',
    slug: 'echoes-of-orion',
    synopsis: 'A rogue AI pilot discovers an ancient interstellar broadcast at the outer rim of the Andromeda constellation.',
    genre: 'Sci-Fi',
    tags: ['sci-fi', 'space-opera', 'cyberpunk', 'ai'],
    coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isPublic: true,
    viewCount: 2450,
    likeCount: 389,
    commentCount: 42,
    ratingAverage: 4.9,
    ratingCount: 56,
    wordCount: 5400,
    createdAt: '2026-07-28T14:32:00.000Z',
    updatedAt: '2026-08-01T09:15:00.000Z',
  },
  {
    id: 'story_2',
    userId: 'usr_mock_123',
    authorName: 'Alex Rivers',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    title: 'The Alchemist of Aethelgard',
    slug: 'alchemist-of-aethelgard',
    synopsis: 'In a sanctuary built on floating crystal spires, an apprentice alchemist accidentally ignites the Forbidden Flame.',
    genre: 'Fantasy',
    tags: ['fantasy', 'magic', 'adventure', 'alchemy'],
    coverImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    status: 'draft',
    isPublic: false,
    viewCount: 620,
    likeCount: 94,
    commentCount: 11,
    ratingAverage: 4.7,
    ratingCount: 18,
    wordCount: 3200,
    createdAt: '2026-08-02T11:00:00.000Z',
    updatedAt: '2026-08-05T16:20:00.000Z',
  },
  {
    id: 'story_3',
    userId: 'usr_2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    title: 'Shadows Over Venice',
    slug: 'shadows-over-venice',
    synopsis: 'A Renaissance detective untangles a secret society hidden beneath canals and masquerade balls.',
    genre: 'Mystery',
    tags: ['mystery', 'historical', 'thriller'],
    coverImageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isPublic: true,
    viewCount: 3890,
    likeCount: 512,
    commentCount: 68,
    ratingAverage: 4.8,
    ratingCount: 84,
    wordCount: 7100,
    createdAt: '2026-07-15T08:00:00.000Z',
    updatedAt: '2026-07-20T10:00:00.000Z',
  },
  {
    id: 'story_4',
    userId: 'usr_3',
    authorName: 'Marcus Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    title: 'Chronicles of Neo-Kyoto',
    slug: 'chronicles-of-neo-kyoto',
    synopsis: 'Neon lights reflection in rain soaked alleyways as android mercenaries battle for sovereignty.',
    genre: 'Sci-Fi',
    tags: ['cyberpunk', 'action', 'sci-fi'],
    coverImageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isPublic: true,
    viewCount: 1980,
    likeCount: 275,
    commentCount: 19,
    ratingAverage: 4.6,
    ratingCount: 31,
    wordCount: 4800,
    createdAt: '2026-07-25T18:45:00.000Z',
    updatedAt: '2026-07-26T12:30:00.000Z',
  }
];

const INITIAL_JOKES: Joke[] = [
  {
    id: 'jk_1',
    userId: 'usr_mock_123',
    setup: 'Why do programmers prefer dark mode?',
    punchline: 'Because light attracts bugs!',
    category: 'Dad Joke',
    ratingAverage: 4.9,
    ratingCount: 142,
    isPublic: true,
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'jk_2',
    userId: 'usr_mock_123',
    setup: 'There are 10 types of people in the world...',
    punchline: 'Those who understand binary, and those who do not.',
    category: 'Pun',
    ratingAverage: 4.7,
    ratingCount: 88,
    isPublic: true,
    createdAt: '2026-08-03T15:20:00.000Z',
  },
  {
    id: 'jk_3',
    userId: 'usr_mock_123',
    setup: 'Why did the neural network break up with the database?',
    punchline: 'Because it found its relationships too rigid!',
    category: 'Stand-up One-liner',
    ratingAverage: 4.8,
    ratingCount: 65,
    isPublic: true,
    createdAt: '2026-08-04T12:00:00.000Z',
  }
];

const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char_1',
    userId: 'usr_mock_123',
    name: 'Jax Vane',
    archetype: 'Rogue Cyber Pilot',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    personalityTraits: ['Cynical', 'Resourceful', 'Tech-Savvy', 'Loyal'],
    backstory: 'Former orbital navy pilot turned freelance code-runner in Sector 7.',
    speechPattern: 'Short, clipped sentences with high-tech slang.',
    isPublic: true,
    createdAt: '2026-07-29T10:00:00.000Z',
  },
  {
    id: 'char_2',
    userId: 'usr_mock_123',
    name: 'Lyra Vance',
    archetype: 'Apprentice Alchemist',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    personalityTraits: ['Curious', 'Impulsive', 'Brilliant', 'Idealistic'],
    backstory: 'Raised in the Grand Spire academy, obsessed with ancient elemental fires.',
    speechPattern: 'Rapid, energetic explanations full of chemical terms.',
    isPublic: true,
    createdAt: '2026-08-01T14:00:00.000Z',
  }
];

const INITIAL_WORLDS: World[] = [
  {
    id: 'world_1',
    userId: 'usr_mock_123',
    name: 'Aethelgard',
    genre: 'High Fantasy',
    description: 'A floating realm suspended over a sea of liquid starlight and crystal spires.',
    rules: 'Elemental flame reacts with crystalline mana nodes to power floating islands.',
    magicSystem: 'Crystal Alchemy & Flame Weaving',
    technologyLevel: 'Magical Steampunk',
    isPublic: true,
    createdAt: '2026-07-30T16:00:00.000Z',
  },
  {
    id: 'world_2',
    userId: 'usr_mock_123',
    name: 'Sector 7 - Neo Osaka',
    genre: 'Cyberpunk Sci-Fi',
    description: 'A triple-tier megacity with perpetual neon rain and orbital satellite networks.',
    rules: 'Synthetic AI implants must be renewed monthly or neural lock occurs.',
    technologyLevel: 'Advanced Neural Cybernetics',
    isPublic: true,
    createdAt: '2026-08-02T18:00:00.000Z',
  }
];

export class MockDataService {
  private static STORAGE_KEY_STORIES = 'storyspark_stories';
  private static STORAGE_KEY_JOKES = 'storyspark_jokes';
  private static STORAGE_KEY_CHARACTERS = 'storyspark_characters';
  private static STORAGE_KEY_WORLDS = 'storyspark_worlds';

  // STORIES
  static getStories(): Story[] {
    const data = localStorage.getItem(this.STORAGE_KEY_STORIES);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_STORIES, JSON.stringify(INITIAL_STORIES));
      return INITIAL_STORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_STORIES;
    }
  }

  static getStoryById(id: string): Story | undefined {
    const stories = this.getStories();
    return stories.find((s) => s.id === id);
  }

  static saveStory(story: Partial<Story>): Story {
    const stories = this.getStories();
    const existingIndex = stories.findIndex((s) => s.id === story.id);
    let updatedStory: Story;

    if (existingIndex >= 0) {
      updatedStory = {
        ...stories[existingIndex],
        ...story,
        updatedAt: new Date().toISOString(),
      };
      stories[existingIndex] = updatedStory;
    } else {
      updatedStory = {
        id: story.id || 'story_' + Date.now(),
        userId: story.userId || 'usr_mock_123',
        authorName: story.authorName || 'Alex Rivers',
        authorAvatar: story.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        title: story.title || 'Untitled Story',
        slug: story.slug || (story.title ? story.title.toLowerCase().replace(/\s+/g, '-') : 'untitled-story'),
        synopsis: story.synopsis || 'An exciting new AI generated story.',
        genre: story.genre || 'Sci-Fi',
        tags: story.tags || ['ai', 'creative'],
        coverImageUrl: story.coverImageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        status: story.status || 'draft',
        isPublic: story.isPublic ?? false,
        viewCount: story.viewCount || 1,
        likeCount: story.likeCount || 0,
        commentCount: story.commentCount || 0,
        ratingAverage: story.ratingAverage || 5.0,
        ratingCount: story.ratingCount || 1,
        wordCount: story.wordCount || 500,
        createdAt: story.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      stories.unshift(updatedStory);
    }

    localStorage.setItem(this.STORAGE_KEY_STORIES, JSON.stringify(stories));
    return updatedStory;
  }

  static deleteStory(id: string): void {
    const stories = this.getStories().filter((s) => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY_STORIES, JSON.stringify(stories));
  }

  static duplicateStory(id: string): Story | undefined {
    const original = this.getStoryById(id);
    if (!original) return undefined;
    const clone: Story = {
      ...original,
      id: 'story_' + Date.now(),
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'draft',
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.saveStory(clone);
  }

  static likeStory(id: string): { liked: boolean; likeCount: number } {
    const stories = this.getStories();
    const story = stories.find((s) => s.id === id);
    if (!story) return { liked: false, likeCount: 0 };
    story.likeCount += 1;
    localStorage.setItem(this.STORAGE_KEY_STORIES, JSON.stringify(stories));
    return { liked: true, likeCount: story.likeCount };
  }

  // JOKES
  static getJokes(): Joke[] {
    const data = localStorage.getItem(this.STORAGE_KEY_JOKES);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_JOKES, JSON.stringify(INITIAL_JOKES));
      return INITIAL_JOKES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_JOKES;
    }
  }

  static saveJoke(joke: Partial<Joke>): Joke {
    const jokes = this.getJokes();
    const newJoke: Joke = {
      id: joke.id || 'jk_' + Date.now(),
      userId: joke.userId || 'usr_mock_123',
      setup: joke.setup || '',
      punchline: joke.punchline || '',
      category: joke.category || 'General',
      ratingAverage: joke.ratingAverage || 5.0,
      ratingCount: joke.ratingCount || 1,
      isPublic: joke.isPublic ?? true,
      createdAt: joke.createdAt || new Date().toISOString(),
    };
    jokes.unshift(newJoke);
    localStorage.setItem(this.STORAGE_KEY_JOKES, JSON.stringify(jokes));
    return newJoke;
  }

  // CHARACTERS
  static getCharacters(): Character[] {
    const data = localStorage.getItem(this.STORAGE_KEY_CHARACTERS);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_CHARACTERS, JSON.stringify(INITIAL_CHARACTERS));
      return INITIAL_CHARACTERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CHARACTERS;
    }
  }

  static saveCharacter(char: Partial<Character>): Character {
    const chars = this.getCharacters();
    const newChar: Character = {
      id: char.id || 'char_' + Date.now(),
      userId: char.userId || 'usr_mock_123',
      name: char.name || 'New Character',
      archetype: char.archetype || 'Protagonist',
      avatarUrl: char.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      personalityTraits: char.personalityTraits || ['Brave'],
      backstory: char.backstory || 'A newly forged character backstory.',
      speechPattern: char.speechPattern,
      isPublic: char.isPublic ?? true,
      createdAt: char.createdAt || new Date().toISOString(),
    };
    chars.unshift(newChar);
    localStorage.setItem(this.STORAGE_KEY_CHARACTERS, JSON.stringify(chars));
    return newChar;
  }

  // WORLDS
  static getWorlds(): World[] {
    const data = localStorage.getItem(this.STORAGE_KEY_WORLDS);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_WORLDS, JSON.stringify(INITIAL_WORLDS));
      return INITIAL_WORLDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_WORLDS;
    }
  }

  static saveWorld(world: Partial<World>): World {
    const worlds = this.getWorlds();
    const newWorld: World = {
      id: world.id || 'world_' + Date.now(),
      userId: world.userId || 'usr_mock_123',
      name: world.name || 'New Realm',
      genre: world.genre || 'Sci-Fi',
      description: world.description || 'A mysterious uncharted dimension.',
      rules: world.rules || 'Standard physics.',
      magicSystem: world.magicSystem,
      technologyLevel: world.technologyLevel,
      isPublic: world.isPublic ?? true,
      createdAt: world.createdAt || new Date().toISOString(),
    };
    worlds.unshift(newWorld);
    localStorage.setItem(this.STORAGE_KEY_WORLDS, JSON.stringify(worlds));
    return newWorld;
  }
}
