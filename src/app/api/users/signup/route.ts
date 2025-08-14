import { connect } from "@/dbConfig/dbConfig";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helper/mailer";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 SIGNUP API CALLED");

    console.log("🔌 Connecting to database...");
    await connect();
    console.log("✅ Database connected");

    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log("📥 Request data:", { username, email, password: "***" });

    //check if user already exists
    console.log("👤 Checking if user exists...");
    const user = await User.findOne({ email });

    if (user) {
      console.log("❌ User already exists");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    console.log("✅ User doesn't exist, proceeding...");

    //hash password
    console.log("🔒 Hashing password...");
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log("✅ Password hashed");

    console.log("👤 Creating new user...");
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log("✅ User saved with ID:", savedUser._id);

    // send verification email
    console.log("📧 CALLING sendEmail function...");
    console.log("📧 Email params:", {
      email: email,
      emailType: "VERIFY",
      userId: savedUser._id.toString(),
    });

    try {
      await sendEmail({
        email,
        emailType: "VERIFY",
        userId: savedUser._id,
      });
      console.log("✅ sendEmail completed successfully");
    } catch (emailError) {
      console.error("❌ sendEmail FAILED:", emailError);
      // Don't return error here - user is already created
    }

    console.log("✅ SIGNUP API COMPLETED");
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: unknown) {
    console.error("❌ SIGNUP API ERROR:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
