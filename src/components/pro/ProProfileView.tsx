import React from "react";
import { ProUser } from "@/data/proData";
import { DemoProfileBody } from "@/components/profile/DemoProfileBody";

interface ProProfileViewProps {
  user: ProUser;
  onSaveProfile: (updated: ProUser) => void;
  onToast: (msg: string) => void;
  avatarSrc?: string;
}

/**
 * "My Profile" inside Talento Pro: the exact /demo-profile page content, rendered beneath
 * the Pro header (no site navbar or footer, so the Pro navbar stays on top).
 */
export const ProProfileView: React.FC<ProProfileViewProps> = ({ onToast }) => (
  <DemoProfileBody onToast={onToast} />
);

export default ProProfileView;
