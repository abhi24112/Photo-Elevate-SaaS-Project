import CreditPurchase from "@/components/CreditDisplay";
import { ModernNavbar } from "@/components/ui/navbar-menu";
import React from "react";

function page() {
  return (
    <div>
      <ModernNavbar />
      <div id="home" className="mt-20">
        <CreditPurchase />
      </div>
    </div>
  );
}

export default page;
