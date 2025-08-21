"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MotionCard from "@/components/ui/motion-card";
import FormField from "@/components/ui/form-field";
import SubmitButton from "@/components/ui/submit-button";
import { SignUpSchema } from "@/lib/validations";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";

type FormState = z.infer<typeof SignUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors({});
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setError(null);

    const parsed = SignUpSchema.safeParse(form);
    if (!parsed.success) {
      const flat = parsed.error.flatten();
      setFieldErrors(flat.fieldErrors as Record<string, string[]>);
      toast.error(flat.formErrors?.[0] ?? "Please check your inputs.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    setLoading(false);

    if (res.ok) {
      toast.success("Account created. Please sign in.");
      router.push("/auth/check-email");
    } else {
      const data = await res.json().catch(() => ({}));
      if (data?.details?.fieldErrors) setFieldErrors(data.details.fieldErrors);
      toast.error(data?.error ?? "Failed to sign up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 18,
        }}
        className="w-full max-w-md"
      >
        <MotionCard className="w-full bg-white rounded-2xl shadow-md p-6">
          <motion.h2
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-2xl font-semibold mb-2"
          >
            Create your account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-sm text-muted-foreground mb-4"
          >
            Start your Quantiri free trial
          </motion.p>

          <motion.form
            onSubmit={submit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <FormField
              label="Name"
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              error={fieldErrors.name?.[0] ?? null}
            />
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
            <FormField
              label="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              error={fieldErrors.confirmPassword?.[0] ?? null}
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <SubmitButton loading={loading}>Create account</SubmitButton>

            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <a className="underline" href="/auth/signin">
                Sign in
              </a>
            </p>
          </motion.form>
        </MotionCard>
      </motion.div>
    </div>
  );
}
