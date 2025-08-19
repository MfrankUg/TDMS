"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  
  const userInitial = user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
        <span className="hidden md:inline-block">TDMS</span>
      </Link>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Languages className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Select Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Language</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
              <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sw">Swahili</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="lg">Luganda</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="ru">Rutooro</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p>My Account</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
              </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Settings</DropdownMenuItem>
            <DropdownMenuItem disabled>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
