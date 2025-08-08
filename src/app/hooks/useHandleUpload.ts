import { useImageStore } from "@/store/imageStore";
import { useUserDetail } from "@/store/userDetailStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import React from "react";

export const useHandleUpload = () => {
  const router = useRouter();
  const email = useUserDetail((state) => state.email);
  const setImageFile = useImageStore((state) => state.setImageFile);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleUpload = async (file: File | null, redirectRoute: string) => {
    setLoading(true);

    if (!file) {
      setErrorMsg("No file selected");
      setLoading(false);
      return;
    }

    // Check file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setErrorMsg("Only PNG, JPG, and JPEG files are allowed");
      setLoading(false);
      return;
    }

    // Fetch initial credit BEFORE setting the file
    try {
      const response = await axios.post("/api/users/credits", { email });
      const currentCredits = response.data.credits;

      if (currentCredits <= 0) {
        setErrorMsg("You don't have enough credits");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("Credit check failed");
      setLoading(false);
      return;
    }

    // Only set the file after all validations pass
    setImageFile(file);

    // Update credits and redirect
    try {
      await axios.post("/api/users/creditupdate", { email });
      setErrorMsg(null);
      router.push(redirectRoute);
      router.refresh();
    } catch (error) {
      console.log("Updating of credits failed");
      setErrorMsg("Failed to process upload");
    }

    setLoading(false);
  };

  return { handleUpload, loading, errorMsg };
};
