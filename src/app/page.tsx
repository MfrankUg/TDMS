"use client";

import Link from 'next/link';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, BarChart, ShieldAlert, Mail, Phone, Twitter, Linkedin, Facebook, Languages } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/use-translation';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


export default function HomeComponent() {
  const { t } = useTranslation();
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  const carouselImages = [
    { src: "https://i.ibb.co/0ySs51QD/tdms-in-warehouse.png", alt: "TDMS in warehouse", hint: "warehouse monitoring" },
    { src: "https://placehold.co/600x400.png", alt: "Coffee beans in a sack", hint: "coffee beans" },
    { src: "https://placehold.co/600x400.png", alt: "Modern warehouse interior", hint: "warehouse interior" },
    { src: "https://placehold.co/600x400.png", alt: "Person checking coffee plants", hint: "coffee farm" },
    { src: "https://placehold.co/600x400.png", alt: "Close up of green coffee beans", hint: "green coffee" },
    { src: "https://placehold.co/600x400.png", alt: "Warehouse with stacked goods", hint: "warehouse logistics" },
  ];
  
  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="px-4 lg:px-6 h-20 flex items-center bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <Link href="#" className="flex items-center justify-center gap-2">
             <span className="text-2xl font-bold text-black">TDMS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          <Button variant="ghost" asChild>
            <Link href="/login" className="text-base font-medium text-foreground/70 hover:text-foreground">
              {t('login')}
            </Link>
          </Button>
          <Button asChild size="lg" className="rounded-full font-bold">
            <Link href="/signup">{t('getStarted')}</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full pt-32 pb-20 md:pt-48 md:pb-24 lg:pt-56 lg:pb-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight font-headline sm:text-5xl md:text-6xl lg:text-7xl">
                    <span className="block">{t('heroTitle').split(' ').slice(0, 3).join(' ')}</span>
                    <span className="block text-primary">{t('heroTitle').split(' ').slice(3).join(' ')}</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t('heroSubtitle')}
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="rounded-full text-base font-bold">
                    <Link href="/signup">
                      {t('signUpForFree')}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                 <Carousel
                    setApi={setApi}
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                      }),
                    ]}
                    className="w-full max-w-xl"
                  >
                    <CarouselContent>
                      {carouselImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                             <Image
                                src={image.src}
                                width="600"
                                height="400"
                                alt={image.alt}
                                data-ai-hint={image.hint}
                                className="mx-auto aspect-video overflow-hidden rounded-2xl object-cover"
                              />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {Array.from({ length: count }).map((_, i) => (
                        <Button
                          key={i}
                          variant="ghost"
                          size="icon"
                          className={`h-2 w-2 rounded-full p-0 ${ i === current ? 'bg-primary' : 'bg-primary/20'}`}
                          onClick={() => api?.scrollTo(i)}
                        />
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{t('keyFeatures')}</div>
                <h2 className="text-3xl font-bold tracking-tighter font-headline sm:text-4xl md:text-5xl">{t('featuresTitle')}</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t('featuresSubtitle')}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-2">
              <div className="grid gap-4 text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                <div className="flex justify-center items-center h-16 w-16 bg-primary/10 rounded-full mx-auto">
                  <BarChart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">{t('realtimeDashboardTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('realtimeDashboardSubtitle')}
                </p>
              </div>
              <div className="grid gap-4 text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="flex justify-center items-center h-16 w-16 bg-primary/10 rounded-full mx-auto">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">{t('aiChatAssistantTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('aiChatAssistantSubtitle')}
                </p>
              </div>
              <div className="grid gap-4 text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="flex justify-center items-center h-16 w-16 bg-primary/10 rounded-full mx-auto">
                  <ShieldAlert className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">{t('predictiveAlertingTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('predictiveAlertingSubtitle')}
                </p>
              </div>
               <div className="grid gap-4 text-center p-6 rounded-2xl transition-all duration-300 hover:bg-white hover:shadow-lg hover:-translate-y-2 hover:rotate-x-3 hover:rotate-y-2" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="flex justify-center items-center h-16 w-16 bg-primary/10 rounded-full mx-auto">
                  <Languages className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold font-headline">{t('multiLanguageVoiceAssistantTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('multiLanguageVoiceAssistantSubtitle')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-50/50 border-t">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-4 md:col-span-2">
              <Link href="#" className="flex items-center justify-start w-fit gap-2">
                 <span className="text-2xl font-bold text-black">TDMS</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-md">
                {t('heroSubtitle')}
              </p>
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg mb-4">{t('contactUs')}</h4>
              <div className="flex flex-col gap-3">
                <a href="mailto:tdms256@gmail.com" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                  <Mail className="h-4 w-4" />
                  <span>tdms256@gmail.com</span>
                </a>
                <a href="tel:+256750631973" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
                  <Phone className="h-4 w-4" />
                  <span>+256 750 631 973</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-headline font-bold text-lg mb-4">{t('followUs')}</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-6 w-6" /></Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 TDMS. {t('allRightsReserved')}</p>
            <nav className="flex gap-4 sm:gap-6 mt-4 sm:mt-0">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                {t('termsOfService')}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline">
                {t('privacy')}
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
