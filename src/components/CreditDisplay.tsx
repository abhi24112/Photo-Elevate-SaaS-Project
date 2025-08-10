"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CreditPackage {
  id: string;
  credits: number;
  price: number; // in dollars
  popular?: boolean;
  title: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonStyle: string;
  cardStyle: string;
}

const creditPackages: CreditPackage[] = [
  {
    id: "basic",
    credits: 3,
    price: 0,
    title: "Free",
    description: "Try our AI image upscaling with limited free credits",
    features: [
      "3 free upscale credits",
      "Up to 2x resolution enhancement",
      "Basic image formats (JPG, PNG)",
      "Standard processing speed",
      "Watermark on results",
    ],
    buttonText: "Start Free",
    buttonStyle:
      "w-full bg-white text-black font-semibold py-2.5 rounded-full transition-transform duration-300 hover:scale-105",
    cardStyle:
      "w-full lg:w-1/3 flex flex-col bg-[#212121] border border-gray-700 rounded-3xl p-6 transition-transform duration-300",
  },
  {
    id: "pro",
    credits: 100,
    price: 19,
    popular: true,
    title: "Pro",
    description: "Perfect for regular users and content creators",
    features: [
      "100 upscale credits",
      "Up to 8x resolution enhancement",
      "All image formats supported",
      "Priority processing",
      "No watermarks",
      "Batch processing (up to 10 images)",
      "API access",
    ],
    buttonText: "Get Pro",
    buttonStyle:
      "w-full bg-[#008635] text-white font-semibold py-2.5 rounded-full border border-white transition-transform duration-300 hover:scale-105",
    cardStyle:
      "w-full lg:w-1/3 flex flex-col bg-gradient-to-br from-[#20512b] to-[#04210e] border-2 border-[#00ff00] rounded-3xl p-6 relative lg:scale-110 shadow-[0_0_20px_#008635] hover:shadow-[0_0_50px_#008635] lg:z-10 transition-all duration-300 hover:lg:scale-[1.15]",
  },
  {
    id: "premium",
    credits: 500,
    price: 79,
    title: "Premium",
    description: "For professionals and businesses with high volume needs",
    features: [
      "500 upscale credits",
      "Up to 16x resolution enhancement",
      "All formats + RAW support",
      "Fastest processing priority",
      "No watermarks",
      "Unlimited batch processing",
      "Advanced API with webhooks",
      "Custom model training",
      "Priority customer support",
    ],
    buttonText: "Get Premium",
    buttonStyle:
      "w-full bg-white text-black font-semibold py-2.5 rounded-full transition-transform duration-300 hover:scale-105",
    cardStyle:
      "w-full lg:w-1/3 flex flex-col bg-[#212121] border border-gray-700 rounded-3xl p-6 transition-transform duration-300",
  },
];

export default function CreditPurchase({
  userCredits,
}: {
  userCredits: number;
}) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (pkg: CreditPackage) => {
    setLoading(pkg.id);

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: pkg.price * 100, // Convert to cents
          credits: pkg.credits,
        }),
      });

      const { sessionId } = await response.json();

      if (sessionId) {
        const stripe = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen p-4 relative">

      {/* Development Warning Banner */}
      <div className="absolute top-15 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-5 px-4 z-20">
        <div className="flex items-center justify-center gap-2 text-md font-medium">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Payment System Under Development - Preview Mode Only</span>
        </div>
      </div>

      {/* Overlay for development mode */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10 pointer-events-none"></div>
      <div className="flex flex-col lg:flex-row lg:items-stretch justify-center gap-8 w-full max-w-5xl relative z-15">
        {creditPackages.map((pkg) => (
          <div key={pkg.id} className={pkg.cardStyle}>
            <div className="mb-5">
              <h1 className="text-white text-2xl font-bold mb-2">
                {pkg.title}
              </h1>
              <div className="mb-4">
                <span className="text-white text-2xl align-top">$</span>
                <span className="text-white text-5xl font-bold">
                  {pkg.price}
                </span>
                <span className="text-gray-400 text-sm">USD/month</span>
              </div>
              <p className="text-white">{pkg.description}</p>
            </div>
            <div className="mb-5">
              <button
                className={pkg.buttonStyle}
                onClick={() => {
                  alert(
                    "Payment system is currently under development. This is a preview version only."
                  );
                  // handlePurchase(pkg);
                }}
                disabled={loading === pkg.id}
              >
                {loading === pkg.id ? "Processing..." : pkg.buttonText}
              </button>
            </div>
            <ul className="space-y-2.5 flex-grow">
              {pkg.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-white text-sm"
                >
                  <img
                    src="https://img.icons8.com/ios-filled/16/40C057/ok--v1.png"
                    alt="check-mark"
                    className="w-4 h-4"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
