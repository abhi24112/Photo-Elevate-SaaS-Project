import { connect } from "@/dbConfig/dbConfig";
import bcrypt from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import User from "@/model/userModel";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email, password, isGoogleAuth } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: "User doesn't Exists",
        success: false,
      });
    }

    // validating password
    if (!isGoogleAuth) {
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return NextResponse.json({
          message: "Enter correct Password",
          success: false,
        });
      }
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    // for user verification status
    if (!user.isVerified) {
      const response = NextResponse.json({
        message: "Email is not verified, Check your email for verification",
        success: false,
      });

      response.cookies.set("token", token, { httpOnly: true });

      return response;
    }

    const response = NextResponse.json({
      message: "Login Successfully",
      success: true,
      data: {
        email: user.email,
        username: user.username,
        credits: user.credits,
      },
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
