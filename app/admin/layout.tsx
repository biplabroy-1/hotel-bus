// app/admin/layout.tsx
import Sidebar from "@/components/sidebar";
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();  // ⬅️ Await auth()

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin");  // This will use Clerk's built-in sign-in page
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
