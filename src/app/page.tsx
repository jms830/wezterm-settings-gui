"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Terminal,
  Palette,
  Layout,
  Zap,
  Code,
  Keyboard,
  ArrowRight,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="p-1 bg-primary/10 rounded-md">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span>WezTerm Config</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/wez/wezterm"
              target="_blank"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              WezTerm Docs
            </Link>
            <Link href="https://github.com/jordan-wezterm-gui" target="_blank">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <GithubIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] opacity-30"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-muted-foreground">Now with live preview</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-100">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">visual editor</span> for your terminal configuration
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both delay-200">
              Craft the perfect WezTerm setup without writing Lua from scratch. 
              Explore themes, tweak typography, and configure keybindings with immediate visual feedback.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both delay-300">
              <Link href="/editor">
                <Button size="lg" className="w-full sm:w-auto text-base gap-2 shadow-lg shadow-primary/20">
                  Open Editor <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="https://github.com/wezterm-settings-gui" target="_blank">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base gap-2">
                  <GithubIcon className="w-4 h-4" /> Star on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/20 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Designed to make WezTerm configuration accessible, visual, and fun.
                Stop guessing color codes and start designing your ideal workspace.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard 
                icon={<Palette className="w-6 h-6 text-pink-500" />}
                title="700+ Color Schemes"
                description="Instantly switch between hundreds of community-loved themes or craft your own custom palette."
              />
              <FeatureCard 
                icon={<Layout className="w-6 h-6 text-blue-500" />}
                title="Visual Interface"
                description="Toggle settings, adjust sliders, and pick fonts without diving into complex documentation."
              />
              <FeatureCard 
                icon={<Terminal className="w-6 h-6 text-green-500" />}
                title="Live Preview"
                description="See exactly how your terminal will look as you make changes. No restart required."
              />
              <FeatureCard 
                icon={<Keyboard className="w-6 h-6 text-orange-500" />}
                title="Keybinding Editor"
                description="Map your favorite shortcuts with a visual key recorder that captures your input."
              />
              <FeatureCard 
                icon={<Code className="w-6 h-6 text-purple-500" />}
                title="Lua Export"
                description="Get clean, idiomatic Lua configuration code ready to drop into your config file."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6 text-yellow-500" />}
                title="Instant Start"
                description="No installation required. Runs entirely in your browser with local storage persistence."
              />
            </div>
          </div>
        </section>
        
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 text-center text-xs font-mono text-muted-foreground/70">
                  wezterm-settings-gui — preview
                </div>
              </div>
              <div className="aspect-video bg-[#1e1e2e] p-6 relative group cursor-default">
                <div className="font-mono text-sm md:text-base space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#f5c2e7]">➜</span>
                    <span className="text-[#89b4fa]">~</span>
                    <span className="text-[#a6e3a1]">wezterm start --always-new-process</span>
                  </div>
                  <div className="text-[#cba6f7]">
                    Welcome to WezTerm! 
                  </div>
                  <div className="text-[#cdd6f4] opacity-80">
                    This is what your terminal could look like.
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[#f5c2e7]">➜</span>
                    <span className="text-[#89b4fa]">~</span>
                    <span className="animate-pulse w-2 h-5 bg-[#cdd6f4] inline-block align-middle"></span>
                  </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href="/editor">
                    <Button size="lg" className="gap-2">
                      Try the Editor <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 mt-auto bg-muted/10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Built with Next.js, Tailwind, and Shadcn UI.
          </div>
          <div className="flex items-center gap-6">
            <Link href="https://wezfurlong.org/wezterm/" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              WezTerm
            </Link>
            <Link href="https://github.com/wezterm-settings-gui" target="_blank" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card hover:border-border transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="mb-2 p-2 w-fit rounded-lg bg-background border border-border">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
