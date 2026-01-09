import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { getUserId, setUserId, getDisplayName, setDisplayName, clearUserData } from '../storage';
import { identifyUser, resetUser } from '../monitoring/analytics';
import { setSentryUser, clearSentryUser } from '../monitoring/sentry';

type AuthContextType = {
  // Auth state
  user: User | null;
  session: Session | null;
  loading: boolean;

  // User profile from our users table
  profile: UserProfile | null;
  isGuest: boolean;

  // Auth methods
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;

  // Guest to auth conversion
  linkGuestAccount: (email: string, password: string) => Promise<{ error: AuthError | null }>;

  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
};

type UserProfile = {
  id: string;
  auth_user_id: string | null;
  display_name: string;
  email: string | null;
  dietary_tags: string[];
  is_guest: boolean;
  created_at: string;
  last_active_at: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isGuest = !user || profile?.is_guest === true;

  // Load session and profile
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        // Check for active Supabase auth session
        const { data: { session: activeSession } } = await supabase.auth.getSession();

        if (activeSession && mounted) {
          setSession(activeSession);
          setUser(activeSession.user);
          await loadProfile(activeSession.user.id);
        } else {
          // No auth session, check for guest user in local storage
          await loadGuestProfile();
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);

      if (newSession && mounted) {
        setSession(newSession);
        setUser(newSession.user);
        await loadProfile(newSession.user.id);
      } else {
        setSession(null);
        setUser(null);
        await loadGuestProfile();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load authenticated user profile
  const loadProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        // Sync to local storage for compatibility
        await setUserId(data.id);
        await setDisplayName(data.display_name);

        // Set user context for monitoring
        identifyUser(data.id, {
          email: data.email,
          display_name: data.display_name,
          is_guest: data.is_guest,
        });
        setSentryUser(data.id, data.email || undefined, data.display_name);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Load guest user profile from local storage
  const loadGuestProfile = async () => {
    try {
      const guestUserId = await getUserId();
      const guestDisplayName = await getDisplayName();

      if (guestUserId) {
        // Fetch guest profile from database
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', guestUserId)
          .single();

        if (!error && data) {
          setProfile(data);
        } else {
          // Guest user exists in storage but not in DB (edge case)
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading guest profile:', error);
      setProfile(null);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) return { error };

      // Profile will be auto-created by database trigger
      // Wait a bit for trigger to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (data.user) {
        await loadProfile(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err as AuthError };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        await loadProfile(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err as AuthError };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);

      // Clear monitoring user context
      resetUser();
      clearSentryUser();

      // Clear local storage but keep guest data if needed
      // User can continue as guest after sign out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Link guest account to new auth account
  const linkGuestAccount = async (email: string, password: string) => {
    try {
      const guestUserId = await getUserId();
      if (!guestUserId) {
        return { error: new Error('No guest account to link') as AuthError };
      }

      // Create auth account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: profile?.display_name || 'User',
          },
        },
      });

      if (signUpError) return { error: signUpError };

      if (data.user) {
        // Link the guest account to the new auth user
        const { error: linkError } = await supabase.rpc('link_guest_to_auth_user', {
          guest_user_id: guestUserId,
          auth_user_id: data.user.id,
        });

        if (linkError) throw linkError;

        // Reload profile
        await loadProfile(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      console.error('Error linking guest account:', err);
      return { error: err as AuthError };
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;

      // Update local state
      setProfile({ ...profile, ...updates });

      // Update local storage
      if (updates.display_name) {
        await setDisplayName(updates.display_name);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Refresh profile from database
  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    } else {
      await loadGuestProfile();
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    profile,
    isGuest,
    signUp,
    signIn,
    signOut,
    linkGuestAccount,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
