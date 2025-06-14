"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import RoleBasedRedirect from "@/components/auth/role-based-redirect";
import PolicyDialog from "@/components/dialog/privacy-dialog";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl: "/login", // 登录后由 RoleBasedRedirect 跳转
    });

    if (!res?.ok) {
      console.log("Login failed", res);
      console.error("Login failed", res?.error);
      alert("Login failed");
    }

    setLoading(false);
  };

  return (
    <>
      <RoleBasedRedirect />
      <div className="max-w-md mx-auto mt-10 space-y-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <input type="checkbox" {...register("acceptPolicy")} />
            <label className="text-sm text-gray-600">
              I accept the{" "}
              <PolicyDialog label="Terms" title="Terms and Conditions">
                <p>These are the terms of use for the platform...</p>
              </PolicyDialog>{" "}
              and{" "}
              <PolicyDialog label="Privacy Policy" title="Privacy Policy">
                <p>
                  We respect your privacy and describe how we handle data...
                </p>
              </PolicyDialog>
              .
            </label>
          </div>
          {errors.acceptPolicy && (
            <p className="text-sm text-red-500">
              {errors.acceptPolicy.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            <a
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
