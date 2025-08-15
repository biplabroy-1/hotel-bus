"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

interface TableLayoutProps {
  children: React.ReactNode;
  params: {
    hotelid: string;
    tableid: string;
  };
}

export default function TableLayout({ children, params }: TableLayoutProps) {
  const { hotelid, tableid } = params;
  const router = useRouter();
  const pathname = usePathname();

  const isChat = pathname.endsWith("/chat");
  const activeTab = isChat ? "chat" : "recommendations";

  const recommendationsPath = `/user/${hotelid}/${tableid}`;
  const chatPath = `/user/${hotelid}/${tableid}/chat`;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value === "recommendations") router.push(recommendationsPath);
          else if (value === "chat") router.push(chatPath);
        }}
        className="w-full"
      >
        <TabsList className="w-full justify-center gap-2 bg-muted p-1 rounded-lg">
          <TabsTrigger
            value="recommendations"
            className={cn(
              "px-4 py-6 rounded-md transition-colors",
              "data-[state=active]:bg-black data-[state=active]:text-white shadow-md",
              "dark:data-[state=active]:bg-white dark:data-[state=active]:text-black",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Recommendations
          </TabsTrigger>

          <TabsTrigger
            value="chat"
            className={cn(
              "px-4 py-6 rounded-md transition-colors",
              "data-[state=active]:bg-black data-[state=active]:text-white shadow-md",
              "dark:data-[state=active]:bg-white dark:data-[state=active]:text-black",
              "hover:bg-accent hover:text-accent-foreground"
            )}
          >
            Chat
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Page content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
