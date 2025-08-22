// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import CSVSection from "@/components/data-chat/csv-section";
import ChatSection from "@/components/data-chat/chat-section";

export default async function DashboardPage() {
  // ✅ Protect route with NextAuth
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* CSV Upload + Preview */}
        <CSVSection />

        {/* AI Chat */}
        <ChatSection />
      </div>
    </main>
  );
}
