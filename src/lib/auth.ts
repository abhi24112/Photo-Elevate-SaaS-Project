import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import User from "@/model/userModel";
import { connect } from "@/dbConfig/dbConfig";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ profile }) {
      await connect();

      const name = profile?.name;
      const email = profile?.email;

      const user = await User.findOne({ email });

      // New User
      if (!user) {
        const newUser = new User({
          username: name,
          email: email,
          isVerified: true,
        });
        await newUser.save();
      }
      return true;
    },
  },
});
