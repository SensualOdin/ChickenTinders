import { YelpBusiness } from './yelp';

// Mock restaurant data for testing
export const MOCK_RESTAURANTS: YelpBusiness[] = [
  {
    id: 'mock-1',
    name: "Joe's Pizza",
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
    url: 'https://yelp.com',
    rating: 4.5,
    price: '$$',
    categories: [{ alias: 'pizza', title: 'Pizza' }],
    location: {
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      display_address: ['123 Main St', 'New York, NY 10001'],
    },
    distance: 804.67, // ~0.5 miles in meters
    phone: '+12125551234',
    display_phone: '(212) 555-1234',
  },
  {
    id: 'mock-2',
    name: 'Sushi Paradise',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    url: 'https://yelp.com',
    rating: 4.8,
    price: '$$$',
    categories: [{ alias: 'sushi', title: 'Sushi Bars' }, { alias: 'japanese', title: 'Japanese' }],
    location: {
      address1: '456 Oak Ave',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      display_address: ['456 Oak Ave', 'New York, NY 10001'],
    },
    distance: 1207.01, // ~0.75 miles
    phone: '+12125555678',
    display_phone: '(212) 555-5678',
  },
  {
    id: 'mock-3',
    name: 'The Burger Joint',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    url: 'https://yelp.com',
    rating: 4.2,
    price: '$',
    categories: [{ alias: 'burgers', title: 'Burgers' }],
    location: {
      address1: '789 Elm St',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      display_address: ['789 Elm St', 'New York, NY 10001'],
    },
    distance: 1609.34, // ~1 mile
    phone: '+12125559012',
    display_phone: '(212) 555-9012',
  },
  {
    id: 'mock-4',
    name: 'Pasta Bella',
    image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    url: 'https://yelp.com',
    rating: 4.6,
    price: '$$',
    categories: [{ alias: 'italian', title: 'Italian' }],
    location: {
      address1: '321 Pine Rd',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      display_address: ['321 Pine Rd', 'New York, NY 10001'],
    },
    distance: 965, // ~0.6 miles
    phone: '+12125553456',
    display_phone: '(212) 555-3456',
  },
  {
    id: 'mock-5',
    name: 'Taco Fiesta',
    image_url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
    url: 'https://yelp.com',
    rating: 4.4,
    price: '$',
    categories: [{ alias: 'mexican', title: 'Mexican' }],
    location: {
      address1: '555 Broadway',
      city: 'New York',
      state: 'NY',
      zip_code: '10001',
      display_address: ['555 Broadway', 'New York, NY 10001'],
    },
    distance: 1450, // ~0.9 miles
    phone: '+12125557890',
    display_phone: '(212) 555-7890',
  },
];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get mock restaurants, randomized and limited
 * @param limit Maximum number of restaurants to return (default: 20)
 * @param seed Optional seed for consistent randomization (e.g., group_id)
 */
export function getMockRestaurants(limit: number = 20, seed?: string): YelpBusiness[] {
  // If seed is provided, use it to create a pseudo-random but consistent order
  let restaurants = [...MOCK_RESTAURANTS];

  if (seed) {
    // Convert seed to number for consistent ordering
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use hash to seed the shuffle
    const seededRandom = (function() {
      let seed = Math.abs(hash);
      return function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    })();

    // Shuffle with seeded random
    const shuffled = [...restaurants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    restaurants = shuffled;
  } else {
    // Random shuffle
    restaurants = shuffleArray(restaurants);
  }

  // Limit the results
  return restaurants.slice(0, Math.min(limit, restaurants.length));
}
