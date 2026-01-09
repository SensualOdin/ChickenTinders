import { useEffect, useState } from 'react';
import { supabase, Group, User } from '../supabase';

export type GroupMemberWithUser = {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  user: User;
};

export function useGroup(groupId: string) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    // Fetch group and members
    const fetchGroupData = async () => {
      try {
        setLoading(true);

        // Get group details
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;
        setGroup(groupData);

        // Get group members with user details
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`
            *,
            user:users(*)
          `)
          .eq('group_id', groupId)
          .order('joined_at', { ascending: true });

        if (membersError) throw membersError;
        setMembers(membersData || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching group:', err);
        setError(err.message || 'Failed to load group');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();

    // Subscribe to real-time changes for group_members
    const channel = supabase
      .channel(`group_${groupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          console.log('Real-time update for group_members:', payload);

          // Refetch members when changes occur
          console.log('Refetching members for group:', groupId);
          const { data: membersData, error: refetchError } = await supabase
            .from('group_members')
            .select(`
              *,
              user:users(*)
            `)
            .eq('group_id', groupId)
            .order('joined_at', { ascending: true });

          console.log('Refetch result:', { data: membersData, error: refetchError });

          if (refetchError) {
            console.error('Error refetching members:', refetchError);
          } else if (membersData) {
            console.log('Updated members list:', membersData.length, 'members');
            setMembers(membersData);
          } else {
            console.warn('No members data returned from refetch');
          }
        }
      )
      .subscribe((status) => {
        console.log(`Group members subscription status for ${groupId}:`, status);
      });

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  return { group, members, loading, error };
}
