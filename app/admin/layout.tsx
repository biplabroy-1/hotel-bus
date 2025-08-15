import Sidebar from "@/components/sidebar";
import React from "react";

export function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default layout;
