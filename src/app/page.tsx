"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Users, BarChart3 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const handleGetStarted = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
          Quantiri
        </h1>
        <p className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground">
          AI-powered SaaS analytics dashboard. Upload your data, chat with it,
          and get insights instantly.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={handleGetStarted} asChild>
            <a href="/dashboard">Get Started</a>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/NibrasAli39/Quantiri" target="_blank">
              View on GitHub
            </a>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Brain className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold">AI Chat with Data</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload CSVs or connect your DB — ask questions in plain English
                and get instant answers.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold">Real-time Dashboards</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Collaborative widgets update live with your team. Stay in sync,
                always.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <BarChart3 className="h-10 w-10 mb-4 text-primary" />
              <h3 className="text-xl font-semibold">Smart Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Detect trends, anomalies, and opportunities — before they
                happen.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Quantiri. Built with Next.js, Tailwind,
        and shadcn.
      </footer>
    </div>
  );
}
