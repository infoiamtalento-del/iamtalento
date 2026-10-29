import React from "react";
import { ProUser } from "@/data/proData";
import { DemoProfileDashboardContent } from "@/pages/DemoProfile";
import { LiveCandidateProfileView } from "./live/LiveCandidateProfileView";
import type { ProView } from "./proTypes";

interface ProProfileViewProps {
  user: ProUser;
  isLive?: boolean;
  onSaveProfile: (updated: ProUser) => void;
  onNavigate?: (view: ProView) => void;
  onProfileReloaded?: () => void;
  onToast: (msg: string) => void;
  avatarSrc?: string;
}

/**
 * Employee "My Profile" inside Talento Pro (/talento-pro?view=profile):
 * - For real signed-in candidates (`isLive`), renders their live Supabase profile,
 *   uploaded avatar, industry, verified badges, resume, public URL, and Edit Profile button.
 * - For the local demo candidate (`!isLive`), preserves the reference /demo-profile dashboard.
 */
export const ProProfileView: React.FC<ProProfileViewProps> = ({
  isLive = false,
  onNavigate,
  onProfileReloaded,
  onToast,
}) => {
  if (isLive && onNavigate) {
    return (
      <LiveCandidateProfileView
        onNavigate={onNavigate}
        onToast={onToast}
        onProfileReloaded={onProfileReloaded}
      />
    );
  }
  return <DemoProfileDashboardContent embedded />;
};

export default ProProfileView;
