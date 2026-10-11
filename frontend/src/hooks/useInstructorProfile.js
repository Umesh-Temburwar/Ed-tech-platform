import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';

export const useInstructorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getInstructorName = (user, profileData) => {
    return (
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.user_metadata?.display_name ||
      profileData?.firstName ||
      profileData?.first_name ||
      profileData?.lastName ||
      profileData?.last_name ||
      user?.email?.split("@")[0] ||
      "Instructor"
    );
  };

  const getInstructorEmail = (user, profileData) => {
    return (
      user?.email ||
      profileData?.email ||
      ""
    );
  };

  const getInstructorAvatar = (user, profileData) => {
    return (
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.picture ||
      profileData?.image ||
      profileData?.avatar_url ||
      `https://api.dicebear.com/5.x/initials/svg?seed=${getInstructorName(user, profileData)}`
    );
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        return;
      }

      let profileData = null;
      try {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profileError) {
          profileData = data;
        }
      } catch (err) {
      }

      const instructorProfile = {
        id: user.id,
        name: getInstructorName(user, profileData),
        email: getInstructorEmail(user, profileData),
        avatar: getInstructorAvatar(user, profileData),
        user_metadata: user.user_metadata,
        profile: profileData,
      };

      setProfile(instructorProfile);
    } catch (err) {
      console.error('Error fetching instructor profile:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    getInstructorName,
    getInstructorEmail,
    getInstructorAvatar,
  };
};
