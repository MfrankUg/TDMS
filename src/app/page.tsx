"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, BarChart, ShieldAlert } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';

export default function HomeComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center shadow-sm">
        <Link href="#" className="flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span className="ml-2">TDMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login" className="text-sm font-medium">
              {t('login')}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">{t('getStarted')}</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {t('heroTitle')}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('heroSubtitle')}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      {t('signUpForFree')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Warehouse Dashboard"
                data-ai-hint="abstract art"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">{t('keyFeatures')}</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{t('featuresTitle')}</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('featuresSubtitle')}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-2 text-center">
                <div className="flex justify-center">
                  <BarChart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('realtimeDashboardTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('realtimeDashboardSubtitle')}
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex justify-center">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('aiChatAssistantTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('aiChatAssistantSubtitle')}
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex justify-center">
                  <ShieldAlert className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{t('predictiveAlertingTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('predictiveAlertingSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 TDMS. {t('allRightsReserved')}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            {t('termsOfService')}
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            {t('privacy')}
          </Link>
        </nav>
      </footer>
    </div>
  );
}
