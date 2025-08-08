// Debug version of the Compare component with fixes

"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconArrowNarrowLeft } from "@tabler/icons-react";
import { IconArrowNarrowRight } from "@tabler/icons-react";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  showHandlebar?: boolean;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  showHandlebar = true,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // // Debug: Log the image URLs
  // useEffect(() => {
  //   console.log("Debug - First Image:", firstImage);
  //   console.log("Debug - Second Image:", secondImage);
  // }, [firstImage, secondImage]);

  const handleStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      requestAnimationFrame(() => {
        setSliderXPercent(Math.max(0, Math.min(100, percent)));
      });
    },
    [isDragging]
  );

  const handleNativeMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleNativeMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleNativeMouseUp);
      window.addEventListener("mousemove", handleNativeMouseMove);
    }
    return () => {
      window.removeEventListener("mouseup", handleNativeMouseUp);
      window.removeEventListener("mousemove", handleNativeMouseMove);
    };
  }, [isDragging, handleNativeMouseUp, handleNativeMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleStart();
    },
    [handleStart]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart();
    },
    [handleStart]
  );

  const handleTouchEnd = useCallback(() => handleEnd(), [handleEnd]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => handleMove(e.touches[0].clientX),
    [handleMove]
  );

  // Show placeholder when images are missing
  if (!firstImage && !secondImage) {
    return (
      <div
        className={cn(
          "w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[350px] bg-gray-200 rounded-2xl flex items-center justify-center",
          className
        )}
      >
        <p className="text-gray-500">No images to compare</p>
      </div>
    );
  }

  return (
    <div
      ref={sliderRef}
      className={cn(
        "w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[350px] overflow-hidden relative",
        "notransition",
        className
      )}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
    >
      {/* Second image (After) - background layer */}
      <AnimatePresence initial={false}>
        {secondImage ? (
          <motion.div
            className={cn(
              "absolute inset-0 z-10 rounded-2xl w-full h-full select-none overflow-hidden",
              secondImageClassname
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              className="absolute inset-0 rounded-2xl w-full h-full select-none object-cover"
              alt="After image"
              src={secondImage}
              draggable={false}
              onError={() =>
                console.error("Failed to load second image:", secondImage)
              }
            />
            <div className="absolute right-2 bottom-2 text-sm px-3 py-2 bg-black/60 rounded-lg text-white z-50 pointer-events-none">
              After
            </div>
          </motion.div>
        ) : (
          // Placeholder for missing second image
          <div className="absolute inset-0 z-10 rounded-2xl w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600">After Image</p>
          </div>
        )}
      </AnimatePresence>

      {/* First image (Before) - foreground layer with clipping */}
      <AnimatePresence initial={false}>
        {firstImage ? (
          <motion.div
            className={cn(
              "absolute inset-0 z-20 rounded-2xl w-full h-full select-none overflow-hidden",
              firstImageClassName
            )}
            style={{
              clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img
              alt="Before image"
              src={firstImage}
              className="absolute inset-0 rounded-2xl w-full h-full select-none object-cover"
              draggable={false}
              onError={() =>
                console.error("Failed to load first image:", firstImage)
              }
            />
            <div className="absolute left-2 bottom-2 text-sm px-3 py-2 bg-black/60 rounded-lg text-white z-50 pointer-events-none">
              Before
            </div>
          </motion.div>
        ) : (
          // Show placeholder with clipping when firstImage is missing
          <motion.div
            className="absolute inset-0 z-20 rounded-2xl w-full h-full bg-gray-400 flex items-center justify-center"
            style={{
              clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)`,
            }}
          >
            <p className="text-gray-700">Before Image</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider handle */}
      <AnimatePresence initial={false}>
        <motion.div
          className="h-full w-1 absolute top-0 bg-white shadow-lg z-30"
          style={{
            left: `calc(${sliderXPercent}% - 2px)`,
          }}
          transition={{ duration: 0 }}
        >
          {showHandlebar && (
            <div className="h-8 w-8 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white z-40 absolute flex items-center justify-center shadow-lg border border-gray-200 cursor-grab hover:cursor-grabbing">
              <IconArrowNarrowLeft className="h-3 w-3 text-black -mr-1" />
              <IconArrowNarrowRight className="h-3 w-3 text-black -ml-1" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// COMMON SOLUTIONS:

// 1. Check how you're calling the component:
/*
// ❌ Wrong - missing originalImgURL
<Compare
  firstImage={loading ? "" : ""}
  secondImage={upscaleImgURL || ""}
/>

// ✅ Correct - both images provided
<Compare
  firstImage={loading ? "" : originalImgURL || ""}
  secondImage={upscaleImgURL || ""}
/>
*/

// 2. Make sure originalImgURL is not undefined:
/*
// Add debugging in your parent component:
console.log("originalImgURL:", originalImgURL);
console.log("upscaleImgURL:", upscaleImgURL);
console.log("loading:", loading);
*/

// 3. Check if the image URLs are valid:
/*
// Test the URLs directly in browser
// Make sure they're not returning 404 or blocked by CORS
*/
