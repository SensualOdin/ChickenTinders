import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import toast, { Toaster } from 'react-hot-toast';
import { useGroup } from '../../lib/hooks/useGroup';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { copyToClipboard, vibrate, formatPriceTier } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { getUserId, setUserId, getDisplayName, setDisplayName } from '../../lib/storage';
import { RESTAURANT_LIMIT } from '../../lib/constants';
import { colors } from '../../lib/designTokens';

export default function LobbyPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { group, members, loading, error } = useGroup(id || '');
  const [joining, setJoining] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [tempName, setTempName] = useState('');
  const [swipeProgress, setSwipeProgress] = useState<Record<string, number>>({});
  const [onlineMembers, setOnlineMembers] = useState<Set<string>>(new Set());
  const [userFinished, setUserFinished] = useState(false);
  const [hypeEvents, setHypeEvents] = useState<string[]>([]);
  const previousProgress = useRef<Record<string, number>>({});

  // Check if current user is in the group, if not prompt to join
  useEffect(() => {
    const checkMembership = async () => {
      if (!group || loading) return;

      const userId = await getUserId();
      console.log('Checking membership:', { userId, membersCount: members.length });

      if (!userId) {
        // New user, prompt for name
        console.log('No userId found, showing name prompt');
        setShowNamePrompt(true);
        return;
      }

      // Verify user exists in database
      const { data: userExists } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!userExists) {
        // User ID in storage but not in DB, treat as new user
        console.log('User ID in storage but not in DB, showing name prompt');
        setShowNamePrompt(true);
        return;
      }

      // Check if user is already a member
      const isMember = members.some((m) => m.user_id === userId);
      console.log('Is member?', isMember);

      if (!isMember && members.length > 0) {
        // Existing user but not in this group, auto-join
        console.log('Auto-joining group');
        await joinGroup(userId);
      }
    };

    checkMembership();
  }, [group, members, loading]);

  // Fetch swipe progress for all members
  useEffect(() => {
    if (!id || members.length === 0) return;

    const fetchSwipeProgress = async () => {
      try {
        // Total restaurants is limited per session (defined in constants)
        const totalRestaurants = RESTAURANT_LIMIT;

        // Get swipe counts for each member
        const { data: swipes, error: swipeError } = await supabase
          .from('swipes')
          .select('user_id')
          .eq('group_id', id);

        if (swipeError) throw swipeError;

        // Count swipes per user
        const progressMap: Record<string, number> = {};
        members.forEach((member) => {
          const userSwipes = swipes?.filter((s) => s.user_id === member.user_id) || [];
          progressMap[member.user_id] = userSwipes.length;
        });

        setSwipeProgress(progressMap);

        // Check if all members have finished swiping
        const allFinished = members.every((member) => {
          const userSwipeCount = progressMap[member.user_id] || 0;
          return userSwipeCount >= totalRestaurants;
        });

        console.log('Swipe progress check:', {
          progressMap,
          allFinished,
          memberCount: members.length,
          totalRestaurants
        });

        // If everyone is done, redirect to results
        if (allFinished && members.length >= 2) {
          console.log('All members finished! Redirecting to results...');
          setTimeout(() => {
            router.push(`/results/${id}`);
          }, 1000); // Small delay to show the "Done swiping" status
        }
      } catch (err) {
        console.error('Error fetching swipe progress:', err);
      }
    };

    fetchSwipeProgress();

    // Subscribe to swipe changes
    const subscription = supabase
      .channel(`swipes-${id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'swipes',
          filter: `group_id=eq.${id}`,
        },
        () => {
          console.log('Swipe change detected, refetching progress...');
          fetchSwipeProgress();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id, members, router]);

  useEffect(() => {
    if (members.length === 0) return;
    const previous = previousProgress.current;
    const updates: string[] = [];

    members.forEach((member) => {
      const current = swipeProgress[member.user_id] || 0;
      const prev = previous[member.user_id] || 0;
      if (current > prev) {
        updates.push(`${member.user.display_name} is on a roll! (${current} swipes)`);
      }
    });

    const finishedCount = members.filter((member) => {
      const count = swipeProgress[member.user_id] || 0;
      return count >= RESTAURANT_LIMIT && count > 0;
    }).length;

    if (finishedCount > 0 && finishedCount === Math.ceil(members.length / 2)) {
      updates.push('A majority just finished swiping.');
    }

    if (updates.length > 0) {
      setHypeEvents((prev) => [...updates, ...prev].slice(0, 6));
    }

    previousProgress.current = swipeProgress;
  }, [members, swipeProgress]);

  // Presence tracking - track who's online
  useEffect(() => {
    if (!id) return;

    let channel: any = null;

    const initPresence = async () => {
      try {
        const userId = await getUserId();
        if (!userId) {
          console.log('No userId for presence tracking');
          return;
        }

        console.log('Initializing presence for user:', userId);

        channel = supabase.channel(`lobby-presence-${id}`, {
          config: {
            presence: {
              key: userId,
            },
          },
        });

        channel
          .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            console.log('Presence sync:', state);
            const online = new Set(Object.keys(state));
            console.log('Online members:', Array.from(online));
            setOnlineMembers(online);
          })
          .on('presence', { event: 'join' }, ({ key }) => {
            console.log('User joined:', key);
            setOnlineMembers((prev) => new Set([...prev, key]));
          })
          .on('presence', { event: 'leave' }, ({ key }) => {
            console.log('User left:', key);
            setOnlineMembers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(key);
              return newSet;
            });
          })
          .subscribe(async (status) => {
            console.log('Presence subscription status:', status);
            if (status === 'SUBSCRIBED') {
              // Track our presence
              const trackResult = await channel.track({
                online_at: new Date().toISOString(),
                user_id: userId,
              });
              console.log('Presence tracked:', trackResult);
            }
          });
      } catch (error) {
        console.error('Error initializing presence:', error);
      }
    };

    initPresence();

    return () => {
      if (channel) {
        console.log('Unsubscribing from presence channel');
        channel.unsubscribe();
      }
    };
  }, [id]);

  // Check if current user has finished swiping
  useEffect(() => {
    const checkFinished = async () => {
      const userId = await getUserId();
      if (!userId) {
        setUserFinished(false);
        return;
      }

      const swipeCount = swipeProgress[userId] || 0;
      const totalRestaurants = RESTAURANT_LIMIT;
      const finished = swipeCount >= totalRestaurants && swipeCount > 0;
      setUserFinished(finished);
    };
    checkFinished();
  }, [swipeProgress]);

  const joinGroup = async (userId: string) => {
    if (!id || joining) return;

    try {
      setJoining(true);

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: id,
          user_id: userId,
        });

      if (joinError) throw joinError;

      toast.success('Joined the group!');
      vibrate();
    } catch (err: any) {
      console.error('Error joining group:', err);
      toast.error(err.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  const handleJoinWithName = async () => {
    if (!tempName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      setJoining(true);

      // Create new user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert({
          display_name: tempName.trim(),
          dietary_tags: [],
        })
        .select()
        .single();

      if (userError) throw userError;

      // Save to local storage
      await setUserId(newUser.id);
      await setDisplayName(tempName.trim());

      // Join the group
      await joinGroup(newUser.id);
      setShowNamePrompt(false);
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast.error(err.message || 'Failed to join');
    } finally {
      setJoining(false);
    }
  };

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const success = await copyToClipboard(url);

    if (success) {
      toast.success('Link copied! 🎉');
      vibrate();
    } else {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyCode = async () => {
    const success = await copyToClipboard(id || '');

    if (success) {
      toast.success('Code copied! 🎉');
      vibrate();
    } else {
      toast.error('Failed to copy code');
    }
  };

  const handleStartSwiping = () => {
    // TODO: Navigate to swipe screen
    router.push(`/swipe/${id}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-surface-main items-center justify-center">
        <ActivityIndicator size="large" color={colors.brand.primary} />
        <Text className="text-text-body mt-4">Loading lobby...</Text>
      </View>
    );
  }

  if (error || !group) {
    return (
      <View className="flex-1 bg-surface-main items-center justify-center px-4">
        <Text className="text-6xl mb-4">😕</Text>
        <Text className="text-2xl font-bold text-text-display mb-2">Group Not Found</Text>
        <Text className="text-base text-text-body text-center mb-6">
          {error || 'This group doesn\'t exist or has expired.'}
        </Text>
        <Button
          href="/"
          variant="primary"
          size="md"
        >
          Go Home
        </Button>
      </View>
    );
  }

  // Name prompt modal
  if (showNamePrompt) {
    return (
      <View className="flex-1 bg-surface-main items-center justify-center px-4">
        <Toaster position="top-center" />
        <View className="bg-surface-card rounded-2xl p-6 w-full max-w-md shadow-lg">
          <Text className="text-2xl font-bold text-text-display mb-2">Join Group</Text>
          <Text className="text-base text-text-body mb-6">
            Enter your name to join the group
          </Text>
          <Input
            placeholder="Your name"
            value={tempName}
            onChangeText={setTempName}
            maxLength={50}
            autoFocus
            size="md"
            className="mb-4"
          />
          <Button
            onPress={handleJoinWithName}
            disabled={joining}
            loading={joining}
            variant="primary"
            size="md"
            fullWidth
          >
            Join Group
          </Button>
        </View>
      </View>
    );
  }

  const canStartSwiping = members.length >= 2;

  return (
    <ScrollView className="flex-1 bg-surface-main">
      <Toaster position="top-center" />
      <View className="max-w-app mx-auto w-full px-4 py-6">
        {/* Header */}
        <View className="items-center mb-6">
          <Text className="text-6xl mb-4">🍗</Text>
          <Text className="text-lg text-text-body mb-2">Group Code</Text>
          <Pressable
            onPress={handleCopyCode}
            className="bg-surface-card px-6 py-3 rounded-xl border-2 border-brand-primary active:scale-95 mb-2"
          >
            <Text className="text-3xl font-bold font-mono text-brand-primary tracking-wider">
              {id}
            </Text>
          </Pressable>
          <Text className="text-sm text-text-muted">Tap code to copy</Text>
        </View>

        {/* Group Settings */}
        <View className="bg-surface-card rounded-2xl p-4 mb-4 shadow-soft">
          <Text className="text-lg font-bold text-text-display mb-3">Group Settings</Text>
          <View className="gap-2">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">📍</Text>
              <Text className="text-base text-text-body">
                Zip: {group.zip_code} • {group.radius} miles
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl">💰</Text>
              <Text className="text-base text-text-body">
                Price: {formatPriceTier(group.price_tier)}
              </Text>
            </View>
          </View>
        </View>

        {/* Members */}
        <View className="bg-surface-card rounded-2xl p-4 mb-4 shadow-soft">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text-display">
              Members ({members.length})
            </Text>
            {!canStartSwiping && (
              <Text className="text-sm text-text-muted">Need 2+ to start</Text>
            )}
          </View>
          <View className="gap-3">
            {members.map((member) => {
              const swipeCount = swipeProgress[member.user_id] || 0;
              const totalRestaurants = RESTAURANT_LIMIT;
              const hasFinished = swipeCount >= totalRestaurants && swipeCount > 0;
              const isSwiping = swipeCount > 0 && !hasFinished;

              const isOnline = onlineMembers.has(member.user_id);

              return (
                <View key={member.id} className="flex-row items-center gap-3">
                  {/* Avatar with online indicator */}
                  <View className="relative">
                    <Avatar name={member.user.display_name} size="medium" />
                    {isOnline && (
                      <View className="absolute bottom-0 right-0 w-3 h-3 bg-feedback-success border-2 border-surface-card rounded-full" />
                    )}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-base font-semibold text-text-display">
                        {member.user.display_name}
                      </Text>
                      {isOnline && (
                        <View className="w-2 h-2 bg-feedback-success rounded-full" />
                      )}
                    </View>
                    <Text className="text-sm text-text-muted">
                      {hasFinished
                        ? 'Done swiping'
                        : isSwiping
                          ? `${swipeCount} swipes`
                          : isOnline
                            ? 'Online'
                            : 'Offline'}
                    </Text>
                  </View>
                  {isSwiping && (
                    <Badge variant="success" size="sm">
                      Swiping
                    </Badge>
                  )}
                  {hasFinished && (
                    <Badge variant="primary" size="sm" icon="✓">
                      Finished
                    </Badge>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Invite Friends Section */}
        <View className="bg-brand-secondary/10 border-2 border-brand-secondary/30 rounded-2xl p-4 mb-4">
          <Text className="text-base font-bold text-brand-secondary mb-2">
            📤 Invite Friends
          </Text>
          <Text className="text-sm text-text-body mb-3">
            Share the code <Text className="font-mono font-bold">{id}</Text> or send the link
          </Text>
          <Button
            onPress={handleCopyLink}
            variant="secondary"
            size="md"
            fullWidth
          >
            Copy Invite Link
          </Button>
        </View>

        {/* Start Swiping Button */}
        <Button
          onPress={handleStartSwiping}
          disabled={!canStartSwiping || userFinished}
          variant="primary"
          size="lg"
          fullWidth
        >
          {userFinished
            ? '✅ You finished swiping'
            : canStartSwiping
              ? '▶️ Start Swiping'
              : '⏳ Waiting for more people...'}
        </Button>

        {/* Hype Feed */}
        <View className="bg-surface-card rounded-2xl p-4 mt-6 shadow-soft">
          <Text className="text-base font-bold text-text-display mb-2">
            🔥 Hype Feed
          </Text>
          {hypeEvents.length === 0 ? (
            <Text className="text-sm text-text-muted">
              Waiting for the first swipes...
            </Text>
          ) : (
            <View className="gap-2">
              {hypeEvents.map((event, index) => (
                <View key={`${event}-${index}`} className="bg-surface-main rounded-xl px-3 py-2">
                  <Text className="text-sm text-text-body">{event}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Back Button */}
        <Button
          href="/"
          variant="ghost"
          size="md"
          fullWidth
          className="mt-4"
        >
          ← Back to Home
        </Button>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
