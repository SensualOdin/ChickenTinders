import { supabase } from '../supabase';

export type SavedGroup = {
  id: string;
  owner_id: string;
  name: string;
  zip_code: string;
  radius: number;
  price_tier: number;
  created_at: string;
  updated_at: string;
  members?: SavedGroupMember[];
};

export type SavedGroupMember = {
  id: string;
  saved_group_id: string;
  display_name: string;
  email: string | null;
  dietary_tags: string[];
  created_at: string;
};

export type CreateSavedGroupInput = {
  name: string;
  zip_code: string;
  radius: number;
  price_tier: number;
  members: {
    display_name: string;
    email?: string;
    dietary_tags?: string[];
  }[];
};

export type UpdateSavedGroupInput = Partial<Omit<CreateSavedGroupInput, 'members'>>;

/**
 * Get all saved groups for the current authenticated user
 */
export async function getSavedGroups(userId: string): Promise<SavedGroup[]> {
  const { data, error } = await supabase
    .from('saved_groups')
    .select(`
      *,
      members:saved_group_members(*)
    `)
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved groups:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get a single saved group by ID
 */
export async function getSavedGroup(groupId: string): Promise<SavedGroup | null> {
  const { data, error } = await supabase
    .from('saved_groups')
    .select(`
      *,
      members:saved_group_members(*)
    `)
    .eq('id', groupId)
    .single();

  if (error) {
    console.error('Error fetching saved group:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new saved group
 */
export async function createSavedGroup(
  userId: string,
  input: CreateSavedGroupInput
): Promise<SavedGroup> {
  console.log('createSavedGroup called with:', { userId, input });

  // Create the group
  const { data: group, error: groupError } = await supabase
    .from('saved_groups')
    .insert({
      owner_id: userId,
      name: input.name,
      zip_code: input.zip_code,
      radius: input.radius,
      price_tier: input.price_tier,
    })
    .select()
    .single();

  if (groupError) {
    console.error('Error creating saved group:', groupError);
    console.error('Group error details:', JSON.stringify(groupError, null, 2));
    throw groupError;
  }

  console.log('Group created successfully:', group);

  // Add members
  if (input.members && input.members.length > 0) {
    console.log('Adding members to group:', input.members);
    const { error: membersError } = await supabase
      .from('saved_group_members')
      .insert(
        input.members.map((member) => ({
          saved_group_id: group.id,
          display_name: member.display_name,
          email: member.email || null,
          dietary_tags: member.dietary_tags || [],
        }))
      );

    if (membersError) {
      console.error('Error adding members:', membersError);
      console.error('Members error details:', JSON.stringify(membersError, null, 2));
      throw membersError;
    }
    console.log('Members added successfully');
  }

  // Fetch the complete group with members
  console.log('Fetching complete group with members...');
  const result = await getSavedGroup(group.id) as SavedGroup;
  console.log('Final group result:', result);
  return result;
}

/**
 * Update a saved group
 */
export async function updateSavedGroup(
  groupId: string,
  input: UpdateSavedGroupInput
): Promise<SavedGroup> {
  const { data, error } = await supabase
    .from('saved_groups')
    .update(input)
    .eq('id', groupId)
    .select()
    .single();

  if (error) {
    console.error('Error updating saved group:', error);
    throw error;
  }

  return getSavedGroup(groupId) as Promise<SavedGroup>;
}

/**
 * Delete a saved group
 */
export async function deleteSavedGroup(groupId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_groups')
    .delete()
    .eq('id', groupId);

  if (error) {
    console.error('Error deleting saved group:', error);
    throw error;
  }
}

/**
 * Add a member to a saved group
 */
export async function addSavedGroupMember(
  groupId: string,
  member: {
    display_name: string;
    email?: string;
    dietary_tags?: string[];
  }
): Promise<SavedGroupMember> {
  const { data, error } = await supabase
    .from('saved_group_members')
    .insert({
      saved_group_id: groupId,
      display_name: member.display_name,
      email: member.email || null,
      dietary_tags: member.dietary_tags || [],
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding member:', error);
    throw error;
  }

  return data;
}

/**
 * Update a saved group member
 */
export async function updateSavedGroupMember(
  memberId: string,
  updates: {
    display_name?: string;
    email?: string;
    dietary_tags?: string[];
  }
): Promise<SavedGroupMember> {
  const { data, error } = await supabase
    .from('saved_group_members')
    .update(updates)
    .eq('id', memberId)
    .select()
    .single();

  if (error) {
    console.error('Error updating member:', error);
    throw error;
  }

  return data;
}

/**
 * Remove a member from a saved group
 */
export async function removeSavedGroupMember(memberId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_group_members')
    .delete()
    .eq('id', memberId);

  if (error) {
    console.error('Error removing member:', error);
    throw error;
  }
}
