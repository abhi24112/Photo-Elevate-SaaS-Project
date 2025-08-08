"use client"
import React from "react";
import Upscale from "@/components/Upscale";
import { ModernNavbar } from "@/components/ui/navbar-menu";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();

  React.useEffect(() => {
      const allowed = sessionStorage.getItem("allowUpscale");
      if (allowed !== "true") {
        router.replace("/"); // Redirect to home or any other page
      } else {
        sessionStorage.removeItem("allowUpscale"); 
      }
  }, [router]);


  return (
    <main className="p-6 flex justify-center items-center">
      <div className="max-w-7xl w-full">
        <ModernNavbar />
        <div className="mt-20">
          <Upscale />
        </div>
      </div>
    </main>
  );
}

export default page;
