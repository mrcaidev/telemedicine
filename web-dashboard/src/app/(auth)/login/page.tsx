"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import GoogleSignInButton from "@/components/auth/google-signin-button";
import RoleBasedRedirect from "@/components/auth/role-based-redirect";
import { signIn } from "next-auth/react";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
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
      callbackUrl: "/login", 
    });

    if (res?.ok) {
    } else {
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

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loading}
          >
            {loading ? "Login..." : "Login"}
          </Button>
        </form>

        <div className="relative text-center my-6">
          <div className="absolute left-0 right-0 top-1/2 border-t border-gray-300"></div>
          <span className="bg-white px-4 text-sm text-gray-500 relative z-10">
            or continue with
          </span>
        </div>

        <GoogleSignInButton />

        {/* 注册跳转按钮 */}
        <p className="text-center text-sm text-gray-500">
          Not Registered yet?
          <Link href="/register" className="text-blue-500 hover:underline ml-1">
            Register
          </Link>
        </p>
      </div>
    </>
  );
}
