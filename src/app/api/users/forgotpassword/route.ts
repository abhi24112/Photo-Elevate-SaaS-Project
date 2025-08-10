import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helper/mailer";
import User from "@/model/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        await connect()

        const response = await request.json()
        const reqBody = response.user
        const {email} = reqBody
        

        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({
                message: "Please enter correct email.",
                success: false
            })
        }

        // sending mail to user
        await sendEmail({email, emailType: "RESET", userId: user._id})

        return NextResponse.json({
            message: "Check your email to reset the password",
            success: true
        })

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Please enter correct email";
        return NextResponse.json({
            message: errorMessage,
            success: false
        })        
    }
}