"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase";
import { toast } from "react-toastify";
import Script from "next/script";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in and redirect to admin
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);

      // Verify Google reCAPTCHA v3 script is loaded
      if (!window.grecaptcha) {
        toast.error("reCAPTCHA validation library is still loading. Please try again.");
        setIsLoading(false);
        return;
      }

      // Execute reCAPTCHA client-side to generate verification token
      const recaptchaToken = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action: "login" }
      );

      if (!recaptchaToken) {
        toast.error("Failed to generate reCAPTCHA token.");
        setIsLoading(false);
        return;
      }

      // Submit credentials and token to our secure backend API route
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Invalid credentials.");
        return;
      }

      // Set the active session in our client-side Supabase client
      const { error: sessionError } = await supabase.auth.setSession(data.session);

      if (sessionError) {
        toast.error("Session configuration failed. Please try again.");
        return;
      }

      toast.success("Successfully logged in!");
      router.push("/admin");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center py-12">
      {/* Load Google reCAPTCHA v3 script dynamically */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
      />

      <div className="w-full max-w-md rounded-lg border border-[#464c6a] bg-[#0f1429] p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold tracking-tight text-white">
          Admin <span className="text-[#16f2b3]">Portal</span>
        </h2>
        <p className="mb-8 text-center text-sm text-[#d3d8e8]">
          Log in with your credentials to access the admin dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d3d8e8]" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#353a52] bg-[#10172d] px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-[#16f2b3] focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#d3d8e8]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[#353a52] bg-[#10172d] px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-[#16f2b3] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-gradient-to-r from-pink-500 to-violet-600 py-3 text-center text-sm font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
