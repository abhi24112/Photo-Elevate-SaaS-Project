"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useUserDetail } from "@/store/userDetailStore";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

// Modern Navbar Component
export const ModernNavbar = () => {
  const email = useUserDetail((state) => state.email);
  // from google auth
  const { status, data: session } = useSession();
  const [useData, setUserData] = useState(false);
  const setCredit = useUserDetail((state) => state.setCredits);
  const [credits, setCredits] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = React.useState(false);

  // check if the user is logged in
  const isLoggedIn = !!email; // (!!) is a common trick to convert any value into a boolean

  // logour the user
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");

      // clearing the userDetail form localstorage
      useUserDetail.persist.clearStorage();
      useUserDetail.getState().reset();

      if (status === "authenticated") {
        signOut();
      }

      setMessage("Logout SuccessFully");
    } catch {
      setMessage("Logout is not Successful");
    }
  };

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const time = setTimeout(() => {
        setIsVisible(false);
        setMessage("");
      }, 5000);

      return () => clearTimeout(time); // Cleanup the timer
    } else {
      setIsVisible(false);
    }
  }, [message]);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!email) return;
      const response = await axios.post("/api/users/credits", { email });
      setCredits(response.data.credits);
      setCredit(response.data.credits);
    };
    if (isLoggedIn) fetchCredits();
  }, [email, isLoggedIn]);

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Guide", href: "/#guide" },
    { name: "Sample", href: "/#sample" },
    { name: "Buy Credits", href: "/purchase" },
    { name: "Contact", href: "/#contact" },
    // {
    //   name: "Services",
    //   href: "/services",
    //   dropdown: [
    //     { name: "Image Upscaling", href: "/upscale" },
    //     { name: "Image Enhancement", href: "/enhance" },
    //     { name: "Batch Processing", href: "/batch" },
    //   ],
    // },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md notransition"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link
              className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              href="/"
            >
              Photo Elevate
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                if (item.name === "Buy Credits" && !isLoggedIn) {
                  return null; // Hide Buy Credits if not logged in
                }
                return (
                  <div key={item.name} className="relative">
                    <motion.a
                      href={item.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      {item.name}
                    </motion.a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Auth Buttons - Conditional Rendering */}
          <div className="flex gap-5 justify-center items-center">
            {isLoggedIn ? (
              // Logged in user buttons
              <>
                <div className="lg:block hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className=" w-35 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                  >
                    Credits: {credits} left
                  </motion.button>
                </div>
                {status === "authenticated" ? (
                  <div
                    className="rounded-full border-2 p-1"
                    onClick={() => setUserData((prev) => !prev)}
                  >
                    <Image
                      className="rounded-full"
                      src={session?.user?.image || "/default-avatar.png"}
                      width={35}
                      height={35}
                      alt="Avatar"
                    />
                  </div>
                ) : (
                  <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="hidden lg:block w-full bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:bg-red-600 cursor-pointer"
                  >
                    Logout
                  </motion.button>
                )}
                {useData && (
                  <div className="absolute bg-black rounded-lg shadow-lg border border-gray-200 p-4 min-w-[280px] top-16 right-5 lg:top-16 lg:right-15 xl:top-18 xl:right-50">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          className="rounded-full"
                          src={session?.user?.image || "/default-avatar.png"}
                          width={50}
                          height={50}
                          alt="Avatar"
                        />
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-md">
                            {session?.user?.name || "User Name"}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {session?.user?.email}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="md:hidden w-full mb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                      >
                        Credits: {credits}/5
                      </motion.button>
                      <motion.button
                        onClick={logout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:bg-red-600"
                      >
                        Logout
                      </motion.button>
                    </motion.div>
                  </div>
                )}
              </>
            ) : (
              // Not logged in user buttons
              <div className="md:gap-4 justify-center items-center hidden md:flex">
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200 shadow-md"
                >
                  Login
                </motion.a>
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-all duration-200 shadow-md"
                >
                  Sign Up
                </motion.a>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute lg:hidden bg-white dark:bg-gray-900 border-1 border-gray-200 dark:border-gray-700 w-1/2 right-3 top-15 rounded-2xl p-3"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 ">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ x: 5 }}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}

              {/* Mobile Auth Buttons */}
              {!isLoggedIn ? (
                <div className="pt-4 space-y-2">
                  <a
                    href="/login"
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </a>
                </div>
              ) : (
                status !== "authenticated" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className=" w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                    >
                      Credits: {credits} left
                    </motion.button>
                    <motion.button
                      onClick={logout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded text-sm font-medium transition-all duration-200 shadow-sm hover:bg-red-600"
                    >
                      Logout
                    </motion.button>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isVisible && (
        <div
          className={`absolute left-15 sm:left-60 lg:left-100 z-50 transition-all duration-500 ease-in-out ${
            isVisible ? "top-6" : "-top-100"
          }`}
        >
          <div className="bg-red-700 text-white rounded-xl shadow-lg px-10 tracking-wider py-4 flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
      )}
    </motion.nav>
  );
};
