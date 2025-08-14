"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, UserCheck, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function Sidebar() {
  const { theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: "KYC", label: "KYC", icon: UserCheck, path: "/" },
    { id: "Recipe", label: "Recipe", icon: Home, path: "/recipes" },
    { id: "QR", label: "QR", icon: FileText, path: "/qr" },
  ]

  return (
    <aside className="h-screen w-56 bg-muted flex flex-col p-2 border-r">
      {/* Tabs */}
      <div className="flex-1 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.path

          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                isActive &&
                  (theme === "light"
                    ? "bg-black text-white hover:bg-black"
                    : "bg-white text-black hover:bg-white")
              )}
              onClick={() => router.push(tab.path)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          )
        })}
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto flex justify-center p-2">
        <ThemeToggle />
      </div>
    </aside>
  )
}
