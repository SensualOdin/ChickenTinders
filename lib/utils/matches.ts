import { supabase } from '../supabase';
import { YelpBusiness } from '../api/yelp';

export type MatchResult = {
  restaurant_id: string;
  restaurant_data: YelpBusiness;
  like_count: number;
  super_like_count: number;
  is_unanimous: boolean;
  likers: string[]; // user IDs who liked this
  match_score: number; // Weighted score (0-100)
};

/**
 * Calculate match score with weighted factors
 * Score = (super_like_weight * super_likes) + (rating_weight * rating) + (unanimity_bonus)
 */
function calculateMatchScore(
  superLikeCount: number,
  memberCount: number,
  rating: number,
  isUnanimous: boolean
): number {
  // Weights (should total ~100 for max score of 100)
  const SUPER_LIKE_WEIGHT = 30; // 30 points per super-like percentage
  const RATING_WEIGHT = 20; // 20 points for max rating (5.0)
  const UNANIMITY_BONUS = 25; // 25 point bonus for unanimous super-likes
  const BASE_MATCH_SCORE = 25; // 25 points for being a match at all

  // Calculate super-like percentage (0-1)
  const superLikePercentage = memberCount > 0 ? superLikeCount / memberCount : 0;

  // Calculate rating score (normalized to 0-1)
  const ratingScore = rating / 5.0;

  // Calculate total score
  let score = BASE_MATCH_SCORE;
  score += SUPER_LIKE_WEIGHT * superLikePercentage;
  score += RATING_WEIGHT * ratingScore;
  if (isUnanimous) {
    score += UNANIMITY_BONUS;
  }

  return Math.round(score);
}

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
          const isUnanimous = data.superLikes === memberCount;
          const matchScore = calculateMatchScore(
            data.superLikes,
            memberCount,
            restaurant.rating || 0,
            isUnanimous
          );

          matches.push({
            restaurant_id: restaurantId,
            restaurant_data: restaurant,
            like_count: data.users.length,
            super_like_count: data.superLikes,
            is_unanimous: isUnanimous,
            likers: data.users,
            match_score: matchScore,
          });
        }
      }
    });

    // Sort by match score (highest first)
    matches.sort((a, b) => b.match_score - a.match_score);

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

    const matchRecords = matches.map((match, index) => ({
      group_id: groupId,
      restaurant_id: match.restaurant_id,
      restaurant_data: match.restaurant_data,
      is_unanimous: match.is_unanimous,
      sort_order: index, // Preserve the original sort order
    }));

    // Use upsert to avoid conflicts when multiple users try to save at once
    const { error } = await supabase
      .from('matches')
      .upsert(matchRecords, {
        onConflict: 'group_id,restaurant_id', // Unique constraint
        ignoreDuplicates: false, // Update existing records
      });

    if (error) {
      // If sort_order column doesn't exist, try without it
      if (error.message?.includes('sort_order') || error.code === '42703') {
        console.warn('sort_order column not found, upserting without it...');
        const matchRecordsWithoutSort = matches.map((match) => ({
          group_id: groupId,
          restaurant_id: match.restaurant_id,
          restaurant_data: match.restaurant_data,
          is_unanimous: match.is_unanimous,
        }));

        const { error: retryError } = await supabase
          .from('matches')
          .upsert(matchRecordsWithoutSort, {
            onConflict: 'group_id,restaurant_id',
            ignoreDuplicates: false,
          });

        if (retryError) throw retryError;
      } else {
        throw error;
      }
    }

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
    // Try with sort_order first
    let { data: matches, error } = await supabase
      .from('matches')
      .select('*')
      .eq('group_id', groupId)
      .order('sort_order', { ascending: true }); // Use sort_order to preserve original ranking

    // If sort_order doesn't exist, fallback to is_unanimous ordering
    if (error && (error.message?.includes('sort_order') || error.code === '42703')) {
      console.warn('sort_order column not found, falling back to is_unanimous ordering...');
      const result = await supabase
        .from('matches')
        .select('*')
        .eq('group_id', groupId)
        .order('is_unanimous', { ascending: false });

      matches = result.data;
      error = result.error;
    }

    if (error) throw error;

    return matches?.map((match) => ({
      restaurant_id: match.restaurant_id,
      restaurant_data: match.restaurant_data as YelpBusiness,
      like_count: 0, // Not stored
      super_like_count: 0, // Not stored
      is_unanimous: match.is_unanimous,
      likers: [],
      match_score: 0, // Not stored (calculated during detection)
    })) || [];
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
}
