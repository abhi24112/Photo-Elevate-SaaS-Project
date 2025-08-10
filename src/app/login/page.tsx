"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { NextResponse } from "next/server";
import Spinner from "@/components/ui/Spinner";
import { useUserDetail } from "@/store/userDetailStore";
import SignInBtn from "@/components/sign-in";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    isGoogleAuth: false,
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(true);
  const [resultMessage, setResultMessage] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const setUsername = useUserDetail((state) => state.setUsername);
  const setEmail = useUserDetail((state) => state.setEmail);
  const setCredits = useUserDetail((state) => state.setCredits);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      const responseData = response.data;
      console.log(responseData);

      const responseUserData = responseData.data;
      console.log(responseUserData);

      if (responseUserData) {
        // Storing in the global state using zustand
        setUsername(responseUserData.username);
        setEmail(responseUserData.email);
        setCredits(responseUserData.credits);
      }

      console.log(responseData.success);
      if (!responseData.success) {
        setResult(false);
        setResultMessage(responseData.message);
      }

      console.log(responseData.success);
      if (responseData.success) {
        router.push("/");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setUser((prev) => ({
        ...prev,
        email: session?.user?.email!,
        isGoogleAuth: true,
      }));
    }
  }, [status, session?.user?.email]);

  // 2. Call onLogin when user.email is set (and not empty)
  React.useEffect(() => {
    if (user.email && status === "authenticated") {
      onLogin();
    }
  }, [user.email, status]);

  React.useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
        {/* --- Header --- */}
        <div className="text-center">
          <div className="mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Photo Elevate
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-400">
            Sign in to continue enhancing your images
          </p>
        </div>

        {/* --- Form --- */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onLogin();
          }}
        >
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-blue-400 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Eye-slashed icon when password is visible
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
                    />
                  </svg>
                ) : (
                  // Eye icon when password is hidden
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.432 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* --- Result Message --- */}
          {resultMessage && (
            <div className="text-center text-sm">
              <p
                className={`${
                  result ? "text-green-400" : "text-red-400"
                } font-medium`}
              >
                {resultMessage}
              </p>
            </div>
          )}

          {/* --- Login Button --- */}
          <div>
            <button
              type="submit"
              disabled={buttonDisabled || loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <SignInBtn />
        </div>

        {/* --- Signup Link --- */}
        <div className="mt-6 flex justify-between text-sm">
          <p className="text-gray-400">
            Didn&apos;t have an Account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </p>
          <Link
            href="/forgotpassword"
            className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            Forgot Your Password?
          </Link>
        </div>
      </div>
    </main>
  );
}
