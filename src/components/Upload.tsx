"use client";
import React from "react";
import { useUserDetail } from "@/store/userDetailStore";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { IconCloudUp } from "@tabler/icons-react";
import Image from "next/image";
import { useHandleUpload } from "@/app/hooks/useHandleUpload";

export default function Upload() {
  const router = useRouter();
  const { handleUpload, loading, errorMsg } = useHandleUpload();
  const email = useUserDetail((state) => state.email);
  const [choosedImage, setImageChoosed] = React.useState(false);
  const [uploadErrorMsg, setUploadErrorMsg] = React.useState<string | null>(
    null
  );
  const [isVisible, setIsVisible] = React.useState(false);

  // user logged in status
  const isLoggedIn = !!email;

  // Image Drag and Drop
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      handleUpload(file, "/upscale");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  
  React.useEffect(() => {
    setUploadErrorMsg(errorMsg);
  }, [errorMsg]);

  React.useEffect(() => {
    if (uploadErrorMsg) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setUploadErrorMsg(""); // Clear the error message so it doesn't reappear
      }, 5000); // 5000 milliseconds = 5 seconds
      
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [uploadErrorMsg]);

  React.useEffect(() => {
    if (!isLoggedIn && choosedImage) {
      router.push("/login");
    }
  }, [choosedImage]);

  return (
    <div className="px-4">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-x-2 gap-y-5">
        <Image
          src={"/mainImage.png"}
          alt="blur to clean image"
          width={530}
          height={285}
          className="rounded-2xl w-auto h-auto"
          priority={false}
        />
        <div className="flex flex-col justify-center items-center gap-y-5">
          <h1 className="text-3xl font-semibold tracking-wide text-center">
            Free AI Image Upscaler Online
          </h1>
          <p className="text-wrap text-center text-md tracking-wide text-gray-400">
            Instantly improve image quality and increase resolution to 4K with
            Photo Elevate&rsquo;s AI image upscaler. It&rsquo;s fast and free.
            Upload your image to enhance automatically.
          </p>
          {/* Drag and Drop Zone */}
          {/* Normal File Upload */}
          <div className="w-full">
            <label className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full text-center px-5 py-3 mb-2 rounded-2xl text-md tracking-wider font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md cursor-pointer block">
              <div className="flex justify-center gap-3 items-center">
                {loading && (
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
                )}
                {loading ? "Uploading..." : "Upscale Image"}
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) handleUpload(file, "/upscale");
                  setImageChoosed(true);
                }}
              />
            </label>
          </div>

          <div
            {...getRootProps()}
            className="md:flex flex-col items-center justify-center border-1 border-dashed border-gray-400 p-10 rounded-lg cursor-pointer hover:border-blue-400 transition hidden w-[90%] md:h-[200px]"
          >
            <input
              {...getInputProps()}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageChoosed(true);
                if (file) handleUpload(file, "/upscale");
              }}
            />
            {isDragActive ? (
              <p className="text-lg text-blue-600 flex justify-center gap-3">
                <IconCloudUp />
                Drop your image here...
              </p>
            ) : (
              <>
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-7 py-3 mb-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md">
                  {loading ? "Uploading..." : "Upscale Image"}
                </button>
                <p className="text-md text-gray-700">
                  Or drag & drop an image here to upscale
                </p>
              </>
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
              <span className="text-sm font-medium">{uploadErrorMsg}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
