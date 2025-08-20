
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
import { Languages, Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/hooks/use-translation";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";


export function DashboardHeader() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { notifications, isLoading } = useNotifications();
  
  const userInitial = user?.email?.[0].toUpperCase() || "U";
  const hasNotifications = notifications.length > 0;

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-10">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
        <span className="text-black dark:text-white">TDMS</span>
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
            <Button variant="outline" size="icon" className="relative">
              {hasNotifications && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">{t('toggleNotifications')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>{t('notifications')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoading ? (
               <DropdownMenuItem disabled>
                <p className="text-sm text-muted-foreground">{t('loadingNotifications')}</p>
              </DropdownMenuItem>
            ) : hasNotifications ? (
              notifications.map((notif, index) => (
                <DropdownMenuItem key={index} className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-1" />
                  <div className="flex flex-col">
                    <p className="font-semibold">{notif.title}</p>
                    <p className="text-sm text-muted-foreground whitespace-normal">{notif.description}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
               <DropdownMenuItem className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                   <div className="flex flex-col">
                    <p className="font-semibold">{t('noNewNotifications')}</p>
                    <p className="text-sm text-muted-foreground whitespace-normal">{t('allSystemsNormal')}</p>
                  </div>
              </DropdownMenuItem>
            )}
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
