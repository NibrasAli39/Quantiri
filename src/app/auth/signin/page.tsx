"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";

import MotionCard from "@/components/ui/motion-card";
import FormField from "@/components/ui/form-field";
import SubmitButton from "@/components/ui/submit-button";
import { SignInSchema } from "@/lib/validations";

type FormState = z.infer<typeof SignInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handle URL params for toasts (signup, email verification)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let shownToast = false;

    if (params.get("signup") === "success") {
      toast.success("Account created! Please sign in.");
      params.delete("signup");
      shownToast = true;
    }

    if (params.get("verified") === "success") {
      toast.success("Email verified successfully! You can now sign in.");
      params.delete("verified");
      shownToast = true;
    }

    if (params.get("verified") === "invalid") {
      toast.error("Invalid or expired verification link.");
      params.delete("verified");
      shownToast = true;
    }

    if (shownToast) {
      router.replace(`/auth/signin?${params.toString()}`);
    }
  }, [searchParams, router]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors({});
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const parsed = SignInSchema.safeParse(form);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      setFieldErrors(flat.fieldErrors as Record<string, string[]>);
      toast.error(flat.formErrors?.[0] ?? "Please check your inputs.");
      return;
    }

    setLoading(true);
    const res = await signIn("credentials", {
      ...parsed.data,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Signed in successfully");
    router.push("/dashboard");
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-6 bg-slate-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 80,
        }}
        className="w-full max-w-md"
      >
        <MotionCard className="bg-white rounded-2xl shadow-md p-6">
          <motion.h2
            className="text-2xl font-semibold mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Sign in to your account
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Continue to your Quantiri dashboard
          </motion.p>

          <motion.form
            onSubmit={submit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              error={fieldErrors.email?.[0] ?? null}
              required
            />
            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              error={fieldErrors.password?.[0] ?? null}
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <SubmitButton loading={loading}>Sign in</SubmitButton>

            <p className="text-sm text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <a className="underline" href="/auth/signup">
                Sign up
              </a>
            </p>
          </motion.form>
        </MotionCard>
      </motion.div>
    </motion.div>
  );
}
