"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { Logo } from "../../components/ui/Logo";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const post = (path: string) =>
    fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword) return setError("Passwords don't match.");
    if (!agreed) return setError("Please accept the terms to continue.");

    setIsLoading(true);
    try {
      const signup = await post("/auth/signup");
      const signupData = await signup.json();
      if (!signup.ok) {
        setError(signupData.message || "Signup failed.");
        return;
      }

      const signin = await post("/auth/signin");
      const signinData = await signin.json();
      if (signin.ok) {
        login(signinData.token);
        router.push("/onboarding");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Cannot reach the server. Make sure the backend is running on port 5000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F2F6F1] font-inter text-[#10261C]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-10">
        <Link href="/landing" className="mb-6 text-sm font-medium text-[#3D5A4B] hover:text-[#1F6F4A]">
          &larr; Back to home
        </Link>

        <Card className="p-8">
          <Logo size="lg" className="mb-6" />
          <h1 className="font-poppins text-3xl font-semibold">Create your account</h1>
          <p className="mt-2 text-[#3D5A4B]">It takes a minute. Then we ask a few questions to build your plan.</p>

          <form onSubmit={handleSignup} className="mt-8 space-y-5">
            <Input
              type="text"
              label="Full name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
            <Input
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm font-medium text-[#1F6F4A] hover:underline"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              }
            />
            <Input
              type={showPassword ? "text" : "password"}
              label="Confirm password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            <label className="flex cursor-pointer items-start gap-3 text-sm text-[#3D5A4B]">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#1F6F4A]"
              />
              <span>I consent to FitPlate using my health information to create my plan, and I understand it gives general wellness guidance, not medical advice.</span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#9B1C1C]">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[#3D5A4B]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1F6F4A] hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}