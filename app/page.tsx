"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <SignInButton signUpForceRedirectUrl="/admin" mode="modal">
        <Button size="lg" className="px-8 py-6 text-lg font-semibold shadow-lg">
          Sign In to Continue
        </Button>
      </SignInButton>
    </div>
  );
}
