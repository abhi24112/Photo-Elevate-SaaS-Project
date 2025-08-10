import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import getServerSession from "next-auth";
import authOptions from "@/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    const session = getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, credits } = await request.json();

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} AI Image Upscaling Credits`,
              description: `Get ${credits} credits to upscale your images with AI`,
            },
            unit_amount: priceId, // price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/profile?success=true&credits=${credits}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/profile?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.email,
        credits: credits.toString(),
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
