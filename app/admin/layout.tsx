import Sidebar from "@/components/sidebar";
import React from "react";

export function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
}

export default layout;
