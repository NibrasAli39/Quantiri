import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "./signout-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-3">
        <h1 className="text-3xl font-bold">
          Welcome, {session.user?.name || session.user?.email}
        </h1>
        <p className="text-muted-foreground">
          Your analytics and AI insights will appear here.
        </p>
        <SignOutButton />
      </div>
    </main>
  );
}
