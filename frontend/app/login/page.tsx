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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token);
        router.push("/onboarding");
      } else {
        setError(data.message || "Login failed. Check your email and password.");
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
          <h1 className="font-poppins text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-[#3D5A4B]">Sign in to see your exercise and meal plan.</p>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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

            {error && (
              <p role="alert" className="rounded-lg bg-[#FDECEA] px-3 py-2 text-sm text-[#9B1C1C]">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[#3D5A4B]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-[#1F6F4A] hover:underline">
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}