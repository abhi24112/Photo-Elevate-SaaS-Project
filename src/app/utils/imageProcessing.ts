// Image processing utilities extracted from Upscale.tsx

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImageResult {
  url: string;
  dimensions: ImageDimensions;
}

/**
 * Creates an object URL from a File object
 */
export const createImageURL = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Gets image dimensions from a URL
 */
export const getImageDimensions = (url: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Handles ClipDrop upscaling as fallback
 */
export const handleClipDropUpscale = async (
  imageFile: File,
  originalDimensions: ImageDimensions
): Promise<string> => {
  const form = new FormData();
  form.append("image_file", imageFile);

  // Calculate target dimensions (4x scaling with ClipDrop limits)
  let targetWidth = originalDimensions.width * 4;
  let targetHeight = originalDimensions.height * 4;

  // ClipDrop limits: between 1-4096 pixels
  if (targetWidth > 4096 || targetHeight > 4096) {
    const aspectRatio = originalDimensions.width / originalDimensions.height;

    if (targetWidth > targetHeight) {
      targetWidth = 4096;
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else {
      targetHeight = 4096;
      targetWidth = Math.round(targetHeight * aspectRatio);
    }
  }

  targetWidth = Math.max(targetWidth, 1);
  targetHeight = Math.max(targetHeight, 1);

  form.append("target_width", targetWidth.toString());
  form.append("target_height", targetHeight.toString());

  const response = await fetch("/api/users/clipdropupscale", {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error("ClipDrop upscaling failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Handles local API upscaling
 */
export const handleLocalUpscale = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("http://127.0.0.1:5000/upscale", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Local upscaling failed");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Main upscaling function with fallback logic
 */
export const upscaleImage = async (
  imageFile: File,
  originalDimensions: ImageDimensions
): Promise<ProcessedImageResult> => {
  try {
    // Try local API first
    const url = await handleLocalUpscale(imageFile);
    const dimensions = await getImageDimensions(url);
    return { url, dimensions };
  } catch (localError) {
    console.log("Local upscaling failed, trying ClipDrop fallback:", localError);
    
    try {
      // Fallback to ClipDrop
      const url = await handleClipDropUpscale(imageFile, originalDimensions);
      const dimensions = await getImageDimensions(url);
      return { url, dimensions };
    } catch (clipDropError) {
      console.error("ClipDrop upscaling also failed:", clipDropError);
      throw new Error("Both upscaling services failed");
    }
  }
};

/**
 * Validates image file based on useHandleUpload.ts conditions
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only PNG, JPG, and JPEG files are allowed" };
  }

  return { valid: true };
};
