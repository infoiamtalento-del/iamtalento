import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ImagePlus, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import defaultCover from "@/assets/profile-office-cover.jpg";
import { uploadBannerPhotoFile, uploadProfilePhotoFile } from "@/services/candidate/profile";
import "@/components/profile/demo-profile.css";

interface Props {
  photoUrl: string;
  bannerUrl?: string;
  userId: string;
  fullName: string;
  onChange: (field: string, value: string) => void;
}

const ProfilePhotoSection = ({ photoUrl, bannerUrl = "", userId, fullName, onChange }: Props) => {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingPhoto(true);
    try {
      const publicUrl = await uploadProfilePhotoFile(file, userId);
      onChange("profile_photo_url", publicUrl);
      toast.success("Profile photo uploaded!");
    } catch (err: any) {
      toast.error(err?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;
    setUploadingBanner(true);
    try {
      const publicUrl = await uploadBannerPhotoFile(file, userId);
      onChange("banner_photo_url", publicUrl);
      toast.success("Cover banner uploaded!");
    } catch (err: any) {
      toast.error(err?.message || "Banner upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  const initials = (fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-5">
      {/* Cover Banner Preview & Uploader */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-foreground">Cover Banner Image</p>
            <p className="text-[11px] text-muted-foreground">
              Displayed across the top of your profile card (recommended 1600×400, JPG/PNG/WEBP up to 5 MB)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => bannerRef.current?.click()}
              disabled={uploadingBanner}
              className="h-8 text-xs gap-1.5"
            >
              {uploadingBanner ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {uploadingBanner ? "Uploading..." : bannerUrl ? "Change Banner" : "Upload Banner"}
            </Button>
            {bannerUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange("banner_photo_url", "")}
                disabled={uploadingBanner}
                className="h-8 text-xs gap-1 text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="relative h-36 rounded-xl overflow-hidden border border-border">
          <img
            src={bannerUrl || defaultCover}
            alt="Profile cover banner preview"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Avatar Preview & Uploader */}
      <div className="flex items-center gap-4 pt-1">
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={photoUrl} alt={fullName} />
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingPhoto}
            aria-label="Upload profile photo"
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
          >
            {uploadingPhoto ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingPhoto}
            className="h-8 text-xs gap-1.5"
          >
            {uploadingPhoto ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
            {uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}
          </Button>
          <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG, or WEBP up to 5 MB</p>
        </div>
      </div>

      <input
        ref={bannerRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleBannerUpload}
        className="dp-visually-hidden"
        aria-label="Choose cover banner image"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handlePhotoUpload}
        className="dp-visually-hidden"
        aria-label="Choose profile photo"
      />
    </div>
  );
};

export default ProfilePhotoSection;
