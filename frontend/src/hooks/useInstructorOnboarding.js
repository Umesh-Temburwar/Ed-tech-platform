import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import toast from "react-hot-toast";

export const useInstructorOnboarding = (user) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [onboardingData, setOnboardingData] = useState(null);
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [payout, setPayout] = useState(null);

  const validateInstructorSetup = async () => {
    if (!user?.id) {
      setProfile(null);
      setSkills([]);
      setPayout(null);
      setIsSetupComplete(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [profileResult, skillsResult, payoutResult] = await Promise.all([
        supabase
          .from("instructor_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("instructor_skills")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("instructor_payouts")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      const safeSkills = Array.isArray(skillsResult.data) ? skillsResult.data : [];
      const profileExists = !!profileResult.data;
      const skillsExist = safeSkills.length > 0;
      const payoutExists = !!payoutResult.data;
      const isComplete = profileExists && skillsExist && payoutExists;

      setProfile(profileResult.data);
      setSkills(safeSkills);
      setPayout(payoutResult.data);
      setIsSetupComplete(isComplete);
      setOnboardingData({
        profile: profileResult.data,
        skills: safeSkills,
        payout: payoutResult.data,
      });
    } catch (err) {
      console.error("[useInstructorOnboarding] Validation error:", err);
      setProfile(null);
      setSkills([]);
      setPayout(null);
      setIsSetupComplete(false);
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async ({ currentStep, formData = {}, skills: skillsToSave = [], payout: payoutToSave = {} }) => {
    try {
      setSaving(true);
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const fullName = formData.full_name || "Instructor";

      const { error: profileError } = await supabase
        .from("instructor_profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: fullName,
            headline: formData.headline,
            about: formData.about,
            location: formData.location,
            website: formData.website,
            timezone: formData.timezone,
            teaching_languages: formData.teaching_languages,
            onboarding_step: currentStep,
            draft_saved: true,
            onboarding_completed: false,
            last_saved_at: new Date().toISOString(),
            ...formData,
          },
          { onConflict: "user_id" }
        );

      if (profileError) throw profileError;

      const safeSkillsToSave = Array.isArray(skillsToSave) ? skillsToSave : [];
      if (safeSkillsToSave.length > 0) {
        await supabase.from("instructor_skills").delete().eq("user_id", user.id);
        const { error: skillsError } = await supabase.from("instructor_skills").insert(
          safeSkillsToSave.map(({ skill, skill_category, proficiency_level }) => ({
            user_id: user.id, skill, skill_category, proficiency_level,
          }))
        );
        if (skillsError) throw skillsError;
      }

      if (payoutToSave && Object.keys(payoutToSave).length > 0) {
        const { error: payoutError } = await supabase.from("instructor_payouts").upsert(
          {
            user_id: user.id,
            payout_provider: payoutToSave.payout_provider,
            payout_method: payoutToSave.payout_method,
            payout_account_token: payoutToSave.payout_account_token,
            payout_account_last4: payoutToSave.payout_account_last4,
            payout_speed: payoutToSave.payout_speed,
            currency: payoutToSave.currency,
            tax_form_status: payoutToSave.tax_form_status,
          },
          { onConflict: "user_id" }
        );
        if (payoutError) throw payoutError;
      }

      toast.success("Draft saved successfully!");
      await validateInstructorSetup();
      return true;
    } catch (err) {
      console.error("[useInstructorOnboarding] Save draft error:", err);
      toast.error(err.message || "Failed to save draft");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateStep = async (newStep) => {
    try {
      if (!user?.id) return;

      const { data: existing } = await supabase
        .from("instructor_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      const fullName = existing?.full_name || "Instructor";

      await supabase
        .from("instructor_profiles")
        .upsert({
          user_id: user.id,
          full_name: fullName,
          onboarding_step: newStep,
          last_saved_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
    } catch (err) {
      console.error("[useInstructorOnboarding] Update step error:", err);
    }
  };

  const completeOnboarding = async () => {
    try {
      if (!user?.id) return;

      const { data: existing } = await supabase
        .from("instructor_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .maybeSingle();

      const fullName = existing?.full_name || "Instructor";

      await supabase
        .from("instructor_profiles")
        .upsert({
          user_id: user.id,
          full_name: fullName,
          onboarding_completed: true,
          draft_saved: false,
          onboarding_step: 4,
          last_saved_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      await validateInstructorSetup();
    } catch (err) {
      console.error("[useInstructorOnboarding] Complete onboarding error:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      validateInstructorSetup();
    } else {
      setProfile(null);
      setSkills([]);
      setPayout(null);
      setIsSetupComplete(false);
      setLoading(false);
    }
  }, [user]);

  return {
    loading: loading ?? false,
    saving: saving ?? false,
    profile: profile ?? null,
    skills: skills ?? [],
    payout: payout ?? null,
    isSetupComplete: isSetupComplete ?? false,
    onboardingData: onboardingData ?? null,
    validateInstructorSetup,
    saveDraft,
    updateStep,
    completeOnboarding,
  };
};
