import nodemailer from "nodemailer";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";

interface SendEmailParams {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams) => {
  const startTime = Date.now();

  try {
    console.log("🚀 Starting email send process...");
    console.log("📧 Email:", email);
    console.log("📝 Email type:", emailType);
    console.log("👤 User ID:", userId);
    console.log("🌐 Domain:", process.env.DOMAIN);

    // Log environment variables (without exposing sensitive data)
    console.log("⚙️ SMTP Config check:", {
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      user: process.env.NODEMAILER_USER?.substring(0, 10) + "***",
      hasPassword: !!process.env.NODEMAILER_PASSWORD,
    });

    console.log("🔒 Generating hashed token...");
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    console.log("✅ Token generated:", hashedToken.substring(0, 15) + "...");

    if (emailType == "VERIFY") {
      console.log("✅ Updating user with verify token...");
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
      console.log("✅ User updated with verify token");
    } else if (emailType == "RESET") {
      console.log("🔑 Updating user with reset token...");
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
      console.log("✅ User updated with reset token");
    }

    console.log("📮 Creating nodemailer transport...");
    const transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: Number(process.env.NODEMAILER_PORT),
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    console.log("✅ Transport created successfully");

    // --- Dynamic Content ---
    const subject =
      emailType === "VERIFY"
        ? "Verify Your Email Address"
        : "Reset Your Password";

    const title =
      emailType === "VERIFY" ? "Confirm Your Email" : "Reset Your Password";

    const bodyText =
      emailType === "VERIFY"
        ? "Thank you for registering. Please click the button below to verify your email address and complete your registration."
        : "You have requested to reset your password. Click the button below to set a new password.";

    const buttonText =
      emailType === "VERIFY" ? "Verify Email" : "Reset Password";

    const verificationLink =
      emailType === "VERIFY"
        ? `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`
        : `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;

    console.log("🔗 Verification link created:", verificationLink);

    // --- Email Options Object ---
    const mailOption = {
      from: '"Authenitication Photo Elevate" <noreply@photoelevate.tech>',
      to: email,
      subject: subject,
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-g">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
                <td style="padding: 20px 0;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        
                        <tr>
                            <td align="center" style="padding: 40px 0 30px 0; border-bottom: 1px solid #eeeeee;">
                                <h1 style="color: #333333; margin: 0; font-size: 28px;">${title}</h1>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 40px 30px; color: #555555; font-size: 16px; line-height: 1.6;">
                                <p style="margin: 0;">${bodyText}</p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 0 30px 40px 30px;">
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="border-radius: 5px;" bgcolor="#4A90E2">
                                            <a href="${verificationLink}" target="_blank" style="font-size: 16px; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 5px; display: inline-block; font-weight: bold;">
                                                ${buttonText}
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 0 30px 20px 30px; color: #888888; font-size: 12px; text-align: center;">
                                <p style="margin: 0;">If the button above doesn't work, copy and paste this link into your browser:</p>
                                <p style="margin: 10px 0 0 0; word-break: break-all;"><a href="${verificationLink}" target="_blank" style="color: #4A90E2;">${verificationLink}</a></p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td align="center" style="padding: 20px 30px; background-color: #f9f9f9; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; color: #aaaaaa; font-size: 12px;">
                                <p style="margin: 0;">© ${new Date().getFullYear()} Profile Authenticator. All rights reserved.</p>
                                <p style="margin: 5px 0 0 0;">If you did not request this, please ignore this email.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `,
    };

    console.log("📧 Mail options prepared:", {
      from: mailOption.from,
      to: mailOption.to,
      subject: mailOption.subject,
    });

    console.log("📤 Attempting to send email...");
    const mailresponse = await transport.sendMail(mailOption);

    const endTime = Date.now();
    console.log("✅ EMAIL SENT SUCCESSFULLY!");
    console.log("⏱️ Time taken:", endTime - startTime, "ms");
    console.log("📊 Response details:", {
      messageId: mailresponse.messageId,
      accepted: mailresponse.accepted,
      rejected: mailresponse.rejected,
      response: mailresponse.response,
    });

    return mailresponse;
  } catch (error: unknown) {
    const endTime = Date.now();
    console.error("❌ EMAIL SEND FAILED!");
    console.error("⏱️ Failed after:", endTime - startTime, "ms");
    console.error("🔥 Error details:", error);

    if (error instanceof Error) {
      console.error("📝 Error message:", error.message);
      console.error("📜 Error stack:", error.stack);
      throw new Error(error.message);
    } else {
      console.error("❓ Unknown error type:", error);
      throw new Error("An unknown error occurred");
    }
  }
};
