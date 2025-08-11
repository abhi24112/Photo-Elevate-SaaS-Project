"use client"
import React from "react";
import Upscale from "@/components/Upscale";

function page() {

  return (
    <main className="p-6 flex justify-center items-center">
      <div className="max-w-7xl w-full">
        <div className="mt-20">
          <Upscale />
        </div>
      </div>
    </main>
  );
}

export default page;
