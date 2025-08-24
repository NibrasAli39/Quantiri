import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignInSchema } from "@/lib/validations";
import { createAndSendVerificationEmail } from "@/lib/verification";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = SignInSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new Error("Invalid input format");
        }

        const { email, password } = parsed.data;
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("No account found with this email");
        }
        if (!user.hashedPassword) {
          throw new Error("Invalid account setup");
        }
        if (!user.emailVerified) {
          await createAndSendVerificationEmail(email);
          throw new Error("Please verify your email. We’ve sent you a link.");
        }

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) {
          throw new Error("Incorrect password");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
};
