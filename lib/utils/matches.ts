import { supabase } from '../supabase';
import { YelpBusiness } from '../api/yelp';

export type MatchResult = {
  restaurant_id: string;
  restaurant_data: YelpBusiness;
  like_count: number;
  super_like_count: number;
  is_unanimous: boolean;
  likers: string[]; // user IDs who liked this
};

/**
 * Detect matches for a group
 * A match occurs when ALL members have liked the same restaurant
 */
export async function detectMatches(
  groupId: string,
  allRestaurants: YelpBusiness[]
): Promise<MatchResult[]> {
  try {
    // Get all members in the group
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId);

    if (membersError) throw membersError;

    const memberCount = members?.length || 0;
    if (memberCount === 0) return [];

    // Get all likes (not dislikes) for this group
    const { data: swipes, error: swipesError } = await supabase
      .from('swipes')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_liked', true);

    if (swipesError) throw swipesError;

    // Group swipes by restaurant
    const restaurantLikes: Record<string, {
      users: string[];
      superLikes: number;
    }> = {};

    swipes?.forEach((swipe) => {
      if (!restaurantLikes[swipe.restaurant_id]) {
        restaurantLikes[swipe.restaurant_id] = {
          users: [],
          superLikes: 0,
        };
      }
      restaurantLikes[swipe.restaurant_id].users.push(swipe.user_id);
      if (swipe.is_super_like) {
        restaurantLikes[swipe.restaurant_id].superLikes++;
      }
    });

    // Find matches (restaurants liked by ALL members)
    const matches: MatchResult[] = [];

    Object.entries(restaurantLikes).forEach(([restaurantId, data]) => {
      if (data.users.length === memberCount) {
        // Everyone liked it! It's a match!
        const restaurant = allRestaurants.find((r) => r.id === restaurantId);
        if (restaurant) {
          matches.push({
            restaurant_id: restaurantId,
            restaurant_data: restaurant,
            like_count: data.users.length,
            super_like_count: data.superLikes,
            is_unanimous: data.superLikes === memberCount, // Everyone super-liked
            likers: data.users,
          });
        }
      }
    });

    // Sort by super-like count first, then by total likes
    matches.sort((a, b) => {
      if (b.super_like_count !== a.super_like_count) {
        return b.super_like_count - a.super_like_count;
      }
      return b.like_count - a.like_count;
    });

    return matches;
  } catch (error) {
    console.error('Error detecting matches:', error);
    throw error;
  }
}

/**
 * Save matches to database
 */
export async function saveMatches(
  groupId: string,
  matches: MatchResult[]
): Promise<void> {
  try {
    if (matches.length === 0) return;

    const matchRecords = matches.map((match) => ({
      group_id: groupId,
      restaurant_id: match.restaurant_id,
      restaurant_data: match.restaurant_data,
      is_unanimous: match.is_unanimous,
    }));

    const { error } = await supabase
      .from('matches')
      .insert(matchRecords);

    if (error) throw error;

    // Update group status to 'matched'
    await supabase
      .from('groups')
      .update({ status: 'matched' })
      .eq('id', groupId);

  } catch (error) {
    console.error('Error saving matches:', error);
    throw error;
  }
}

/**
 * Get matches for a group
 */
export async function getMatches(groupId: string): Promise<MatchResult[]> {
  try {
    const { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .eq('group_id', groupId)
      .order('is_unanimous', { ascending: false });

    if (error) throw error;

    return matches?.map((match) => ({
      restaurant_id: match.restaurant_id,
      restaurant_data: match.restaurant_data as YelpBusiness,
      like_count: 0, // Not stored
      super_like_count: 0, // Not stored
      is_unanimous: match.is_unanimous,
      likers: [],
    })) || [];
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
}
