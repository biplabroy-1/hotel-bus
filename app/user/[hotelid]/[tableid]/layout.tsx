"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect } from "react";

interface TableLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    hotelid: string;
    tableid: string;
  }>;
}

export default function TableLayout({ children, params }: TableLayoutProps) {
  const { hotelid, tableid } = use(params);
  const router = useRouter();
  const pathname = usePathname();

  const isChat = pathname.endsWith("/chat");
  const activeTab = isChat ? "chat" : "recommendations";

  const recommendationsPath = `/user/${hotelid}/${tableid}`;
  const chatPath = `/user/${hotelid}/${tableid}/chat`;

  // ✅ Ensure UID exists
  useEffect(() => {
    async function ensureUid() {
      let uid = localStorage.getItem("uid");

      if (!uid) {
        const res = await fetch("/api/uid");
        const data = await res.json();
        uid = data.uid;
        if (uid) {
        localStorage.setItem("uid", uid);
      }
      }
    }
    ensureUid();
  }, []);

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value === "recommendations") router.push(recommendationsPath);
          else if (value === "chat") router.push(chatPath);
        }}
        className="w-full px-4"
      >
        <TabsList className="w-full justify-center gap-2 bg-muted p-1 rounded-4xl">
          <TabsTrigger value="recommendations" className="bg-black text-white rounded-2xl">
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="chat" className="bg-black text-white rounded-2xl">
            Chat
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Page content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
