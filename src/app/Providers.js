"use client";

import { SessionProvider } from "next-auth/react";

export const NextAuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

// It makes authentication session data (user info, login state, etc.) available to all components in your React app using NextAuth.
// Any component inside <NextAuthProvider>...</NextAuthProvider> can access the user's session via hooks like useSession() from next-auth/react.