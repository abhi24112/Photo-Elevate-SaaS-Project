// store/imageStore.ts
import { create } from "zustand";

// Image scaling
type ImageStore = {
  imageFile: File | null;
  upscaledImageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  setImageFile: (file: File | null) => void;
  setUpscaledImageUrl: (url: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  imageFile: null,
  upscaledImageUrl: null,
  isLoading: false,
  error: null,
  setImageFile: (file: File | null) => set({ imageFile: file }),
  setUpscaledImageUrl: (url: string | null) => set({ upscaledImageUrl: url }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error })
}));