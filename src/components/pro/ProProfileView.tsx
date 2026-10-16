import React from "react";
import { ProUser } from "@/data/proData";
import { DemoProfileDashboardContent } from "@/pages/DemoProfile";

interface ProProfileViewProps {
  user: ProUser;
  onSaveProfile: (updated: ProUser) => void;
  onToast: (msg: string) => void;
  avatarSrc?: string;
}

/**
 * Employee "My Profile" inside Talento Pro (/talento-pro?view=profile):
 * renders the exact /demo-profile dashboard layout beneath the Pro header.
 */
export const ProProfileView: React.FC<ProProfileViewProps> = () => (
  <DemoProfileDashboardContent embedded />
);

export default ProProfileView;
