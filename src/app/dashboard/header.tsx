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
import { useTranslation } from "@/hooks/use-translation";

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const userInitial = user?.email?.[0].toUpperCase() || "U";

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <svg
          className="h-10 w-auto"
          viewBox="0 0 170 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text x="10" y="28" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="24" fontWeight="bold" fill="black" className="dark:fill-white">TDMS</text>
          <path
            d="M125 20 C115 5, 145 5, 135 20 C145 35, 115 35, 125 20 Z"
            fill="hsl(var(--primary))"
          />
          <path
            d="M127 10 C132 15, 132 25, 127 30"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </Link>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Languages className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t('selectLanguage')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as any)}>
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
              <span className="sr-only">{t('toggleUserMenu')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <p>{t('myAccount')}</p>
              <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
              </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>{t('settings')}</DropdownMenuItem>
            <DropdownMenuItem disabled>{t('support')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>{t('logout')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
