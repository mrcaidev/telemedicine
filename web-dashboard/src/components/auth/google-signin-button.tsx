"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function GoogleSignInButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => signIn("google")}
      className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-sm font-medium text-gray-700
        hover:bg-gray-100 active:scale-[0.98] transition-all duration-150 shadow-sm
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer"
    >
      <svg className="w-5 h-5" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.5 0 6.5 1.2 8.9 3.4l6.6-6.6C35.3 2.3 29.9 0 24 0 14.6 0 6.9 5.4 2.9 13.3l7.8 6.1C13 12.3 18.2 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.7-2.1 5-4.3 6.6l7.1 5.5c4.2-3.9 6.9-9.7 6.9-16.6z"
        />
        <path
          fill="#FBBC05"
          d="M10.7 28.2c-.5-1.5-.8-3.1-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1.1 16.7 0 20.2 0 24s1.1 7.3 2.9 10.3l7.8-6.1z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.5 0 12-2.1 16-5.6l-7.1-5.5c-2 1.3-4.5 2-7.2 2-5.8 0-10.8-3.9-12.6-9.2l-7.8 6.1C6.9 42.6 14.6 48 24 48z"
        />
      </svg>
      Google
    </Button>
  );
}