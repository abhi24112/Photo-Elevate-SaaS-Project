"use client";
import axios from "axios";
import React from "react";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";

export default function ForgotPassword() {
  const [user, setUser] = React.useState({
    email: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [responseMessage, setResponseMessage] = React.useState("");
  const [result, setResult] = React.useState(false);

  const onForgotPass = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", { user });
      const responseData = response.data;

      if (responseData.success) {
        setResponseMessage(responseData.message);
        setResult(true);
      } else {
        setResponseMessage(responseData.message);
        setResult(false);
      }
    } catch (error) {
      console.log("Enter correct Email. Or try again later.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user.email.length > 0) {
      setButtonDisabled(false);
    } else setButtonDisabled(true);
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
          <h2 className="text-2xl font-bold text-white mb-2">
            Forgot Password
          </h2>
          <p className="text-gray-400">
            Enter your email to reset your password
          </p>
        </div>

        {/* --- Form --- */}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onForgotPass();
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
                onChange={(e) => setUser({ email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>
          {/* --- Result Message --- */}
          {responseMessage && (
            <div className="text-center text-sm">
              <p
                className={`${
                  result ? "text-green-400" : "text-red-400"
                } font-medium`}
              >
                {responseMessage}
              </p>
            </div>
          )}

          {/* --- Submit Button --- */}
          <div>
            <button
              type="submit"
              disabled={buttonDisabled || loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800 transition-all transform hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Spinner />
                  <span>Sending Mail...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
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
              {" "}
              Or
              {" "}
              <Link
                href="/login"
                className="font-medium text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
