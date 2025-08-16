"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, UserCheck, Sun, Moon, QrCode, Building2, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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

function SidebarContent() {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: "kyc", label: "KYC", icon: UserCheck, path: "/admin/kyc" },
    { id: "recipes", label: "Recipes", icon: Home, path: "/admin/recipes" },
    { id: "qr", label: "QR Codes", icon: QrCode, path: "/admin/qr" },
    { id: "hotels", label: "Hotels", icon: Building2, path: "/admin/hotels" },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* App Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Hotel Bus</h1>
        <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.path

            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => router.push(tab.path)}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-2 left-2 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-screen w-64 bg-card border-r border-border flex-col">
        <SidebarContent />
      </aside>
    </>
  )
}