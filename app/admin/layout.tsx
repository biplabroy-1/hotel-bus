import Sidebar from "@/components/sidebar";
import React from "react";

export function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-col flex md:flex-row ">
      <Sidebar />
      {children}
    </div>
  );
}

export default layout;
