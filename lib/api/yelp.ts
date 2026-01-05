// Yelp Fusion API wrapper
// For production, this should be moved to a Supabase Edge Function to keep API key secure

export type YelpBusiness = {
  id: string;
  name: string;
  image_url: string;
  url: string;
  rating: number;
  price?: string;
  categories: Array<{ alias: string; title: string }>;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
    display_address: string[];
  };
  distance: number; // in meters
  phone: string;
  display_phone: string;
};

export type YelpSearchParams = {
  latitude?: number;
  longitude?: number;
  location?: string; // zip code or address
  radius?: number; // in meters (max 40000)
  categories?: string; // e.g., "restaurants"
  price?: string; // "1,2,3,4"
  limit?: number; // max 50
  open_now?: boolean;
};

const YELP_API_BASE = 'https://api.yelp.com/v3';

export async function searchYelpBusinesses(
  params: YelpSearchParams
): Promise<YelpBusiness[]> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    throw new Error('Yelp API key not configured');
  }

  // Build query string
  const queryParams = new URLSearchParams();

  if (params.latitude && params.longitude) {
    queryParams.append('latitude', params.latitude.toString());
    queryParams.append('longitude', params.longitude.toString());
  } else if (params.location) {
    queryParams.append('location', params.location);
  } else {
    throw new Error('Either location or coordinates must be provided');
  }

  if (params.radius) {
    // Convert miles to meters (Yelp uses meters)
    const meters = Math.min(params.radius * 1609.34, 40000);
    queryParams.append('radius', Math.round(meters).toString());
  }

  if (params.categories) {
    queryParams.append('categories', params.categories);
  }

  if (params.price) {
    queryParams.append('price', params.price);
  }

  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  if (params.open_now !== undefined) {
    queryParams.append('open_now', params.open_now.toString());
  }

  const url = `${YELP_API_BASE}/businesses/search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.description || 'Yelp API request failed');
    }

    const data = await response.json();
    return data.businesses || [];
  } catch (error: any) {
    console.error('Yelp API error:', error);
    throw error;
  }
}

// Get businesses for a group based on their settings
export async function getRestaurantsForGroup(
  zipCode: string,
  radius: number, // in miles
  priceTier: number, // 1-4
  dietaryTags: string[]
): Promise<YelpBusiness[]> {
  // Build price string (e.g., "1,2" for $ and $$)
  const priceValues = Array.from({ length: priceTier }, (_, i) => i + 1).join(',');

  // For now, we search all restaurants
  // TODO: Filter by dietary restrictions using categories
  const businesses = await searchYelpBusinesses({
    location: zipCode,
    radius: radius,
    categories: 'restaurants',
    price: priceValues,
    limit: 50,
    open_now: false,
  });

  // TODO: Filter based on dietary tags
  // This would require checking categories for things like:
  // - vegan: categories includes 'vegan'
  // - vegetarian: categories includes 'vegetarian' or 'vegan'
  // - gluten-free: categories includes 'gluten_free'
  // etc.

  return businesses;
}
