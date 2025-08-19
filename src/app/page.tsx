import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, BarChart, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center shadow-sm">
        <Link href="#" className="flex items-center justify-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <span className="ml-2">Warehouse Sentinel</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login" className="text-sm font-medium">
              Login
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
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
                    Smart Monitoring for Your Warehouse
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Warehouse Sentinel provides real-time data, AI-powered insights, and predictive alerts to keep your inventory safe and sound.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">
                      Sign Up for Free
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
                data-ai-hint="warehouse interior"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Know, Instantly</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From real-time sensor data to predictive AI, Warehouse Sentinel has you covered.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-2 text-center">
                <div className="flex justify-center">
                  <BarChart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-time Dashboard</h3>
                <p className="text-muted-foreground">
                  Visualize temperature, humidity, and dust levels with beautiful, intuitive graphs.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex justify-center">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Chat Assistant</h3>
                <p className="text-muted-foreground">
                  Ask questions in natural language and get instant insights about your warehouse conditions.
                </p>
              </div>
              <div className="grid gap-2 text-center">
                <div className="flex justify-center">
                  <ShieldAlert className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Predictive Alerting</h3>
                <p className="text-muted-foreground">
                  Get notified before conditions go out of range with our AI-powered predictive alerts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Warehouse Sentinel. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
