"use client";
import React from "react";
import { useImageStore } from "@/store/imageStore";
import { Compare } from "./ui/compare";
import { useHandleUpload } from "@/app/hooks/useHandleUpload";

export default function Upscale() {
  const imageFile = useImageStore((state) => state.imageFile);
  const { handleUpload, loading, errorMsg } = useHandleUpload();
  const [upscaleImgURL, setUpscaleImgURL] = React.useState<string | null>(null);
  const [originalImgURL, setOriginalImgURL] = React.useState<string | null>(
    null
  );
  const [originalImgDimensions, setOriginalImgDimensions] = React.useState<{
    width: number;
    height: number;
  } | null>(null);
  const [upscaleLoading, setUpscaleLoading] = React.useState<boolean>(false);
  const [upscaleImgDimensions, setUpscaleImgDimensions] = React.useState<{
    width: number;
    height: number;
  } | null>(null);
  const [errorUpscaleMsg, setUpscaleErrorMsg] = React.useState<string | null>(
    null
  );
  const [isVisible, setIsVisible] = React.useState(false);
  const [width, setwidth] = React.useState<number | null>(null);
  const [height, setheight] = React.useState<number | null>(null);

  // Helper for ClipDrop fallback (ClipDrop's limits (between 1-4096 pixels):
  const handleClipDropUpscale = async (imageFile: File) => {
    const form = new FormData();
    form.append("image_file", imageFile);

    console.log("Original dimensions:", originalImgDimensions); // Debug if this is null

    if (originalImgDimensions) {
      // Calculate target dimensions (4x scaling)
      let targetWidth = originalImgDimensions.width * 4;
      let targetHeight = originalImgDimensions.height * 4;

      // Preserve aspect ratio if either dimension exceeds 4096
      if (targetWidth > 4096 || targetHeight > 4096) {
        const aspectRatio =
          originalImgDimensions.width / originalImgDimensions.height;

        if (targetWidth > targetHeight) {
          // Width is the limiting dimension
          targetWidth = 4096;
          targetHeight = Math.round(targetWidth / aspectRatio);
        } else {
          // Height is the limiting dimension
          targetHeight = 4096;
          targetWidth = Math.round(targetHeight * aspectRatio);
        }
      }

      // Ensure minimum size of 1
      targetWidth = Math.max(targetWidth, 1);
      targetHeight = Math.max(targetHeight, 1);

      console.log(`Calculated dimensions: ${targetWidth}×${targetHeight}`);

      // Add dimensions to form
      form.append("target_width", targetWidth.toString());
      form.append("target_height", targetHeight.toString());

      // Verify they were added correctly
      console.log("FormData check:", {
        width: form.get("target_width"),
        height: form.get("target_height"),
      });

      // Update state for display
      setwidth(targetWidth);
      setheight(targetHeight);
    }

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

  // Upscaling the images
  const handleScaling = async () => {
    if (!imageFile) {
      setUpscaleErrorMsg("No file is uploaded");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      setUpscaleLoading(true);
      setUpscaleErrorMsg(null);

      // Try your local API first
      const response = await fetch("http://127.0.0.1:5000/upscale", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Try ClipDrop fallback
        try {
          const clipDropUrl = await handleClipDropUpscale(imageFile);
          setUpscaleImgURL(clipDropUrl);
          setUpscaleLoading(false);
          return;
        } catch {
          setUpscaleErrorMsg("Both upscaling services failed");
          setUpscaleLoading(false);
          return;
        }
      }

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);
      setUpscaleImgURL(imageURL);
      setUpscaleLoading(false);
    } catch {
      // If fetch itself fails (e.g., server down), try ClipDrop
      try {
        const clipDropUrl = await handleClipDropUpscale(imageFile);
        setUpscaleImgURL(clipDropUrl);
      } catch {
        setUpscaleErrorMsg("Both upscaling services failed");
      }
      setUpscaleLoading(false);
    } finally {
      setUpscaleLoading(false);
    }
  };

  React.useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setOriginalImgURL(url);

      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setOriginalImgDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        URL.revokeObjectURL(url); // Clean up
        handleScaling();
      };
      img.src = url;
    } else {
      setOriginalImgURL(null);
      setOriginalImgDimensions(null);
    }
  }, [imageFile]);

  React.useEffect(() => {
    if (upscaleImgURL) {
      // Get image dimensions
      const img = new window.Image();
      img.onload = () => {
        setUpscaleImgDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = upscaleImgURL;
    } else {
      setUpscaleImgDimensions(null);
    }
  }, [upscaleImgURL]);

  React.useEffect(() => {
    setUpscaleErrorMsg(errorMsg);
  }, [errorMsg]);

  React.useEffect(() => {
    if (errorUpscaleMsg) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setUpscaleErrorMsg(""); // Clear the error message so it doesn't reappear
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorUpscaleMsg]);

  return (
    <div className="w-full flex flex-col lg:flex-row lg:justify-end justify-center gap-4">
      {/* Compare Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 flex flex-col justify-center items-center">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Before & After Comparison
          </h2>
          <p className="text-gray-400 text-sm">
            Slide to see the enhancement difference
          </p>
        </div>

        <div className="flex justify-center mb-5">
          <div className="relative">
            <Compare
              firstImage={originalImgURL || ""}
              secondImage={upscaleLoading ? "" : upscaleImgURL || ""}
              firstImageClassName="object-cover object-left-top"
              secondImageClassname="object-cover object-left-top"
              className="h-[250px] w-[250px] md:h-[500px] md:w-[500px] lg:h-[550px] lg:w-[550px] rounded-xl shadow-2xl border border-gray-600"
            />

            {/* Loading overlay */}
            {upscaleLoading && (
              <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white font-medium">
                    Processing your image...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[100%] flex gap-x-4 justify-center items-start flex-col md:flex-row lg:flex-col mx-2 my-3">
        <div className="text-white hidden lg:block mb-5">
          <h1 className="text-3xl mb-2">
            {upscaleLoading
              ? "Your Image is being Processed..."
              : "Enhancement Complete!"}
          </h1>
          {/* Show original image dimensions */}
          {!upscaleLoading && originalImgDimensions && (
            <div className="mb-2 text-gray-400 text-xs text-center">
              Original size: {originalImgDimensions.width.toString()} ×{" "}
              {originalImgDimensions.height} px
            </div>
          )}
          {/* Show Upscaled image dimensions */}
          {!upscaleLoading && upscaleImgDimensions && (
            <div className="mb-2 text-gray-400 text-xs text-center">
              Upscale size: {width} × {height} px
            </div>
          )}
          {upscaleLoading ? (
            ""
          ) : (
            <p className="text-md text-gray-500">
              Your low-resolution image is now a high-quality masterpiece.
              Download the enhanced version and experience the power of
              professional-grade AI upscaling.
            </p>
          )}
        </div>
        <div className="w-[100%] md:w-[50%] lg:w-[100%]">
          <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full text-center px-8 py-4 mb-2 rounded-lg text-sm tracking-wider font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md cursor-pointer block">
            <div className="flex justify-center gap-3 items-center">
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-upload"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                  <path d="M7 9l5 -5l5 5" />
                  <path d="M12 4l0 12" />
                </svg>
              )}

              {loading && upscaleImgURL ? "Uploading..." : "Upscale New Image"}
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) handleUpload(file, "/upscale");
              }}
            />
          </label>
        </div>
        <div className="w-[100%] lg:w-[100%]">
          {/* Download Button */}
          {upscaleImgURL && (
            <div className="text-center text-md ">
              <a
                href={upscaleImgURL!}
                download={"upscaled.jpg"}
                className="w-[100%] flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-7 py-4.5 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Enhanced Image
              </a>

              {/* Additional info */}
              <p className="text-gray-400 text-xs mt-3">
                High-quality image ready for download
              </p>
            </div>
          )}
        </div>
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 transition-all duration-500 ease-in-out ${
            isVisible ? "top-5" : "-top-100"
          }`}
        >
          <div className="bg-red-700 text-white rounded-xl shadow-lg px-10 tracking-wider py-4 flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{errorUpscaleMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
