"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function Login() {
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError("");
        try {
            // This automatically sets the HttpOnly cookie in the browser
            await api.post("/auth/login", data);
            router.push("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-stone-200">
                <h1 className="text-3xl font-serif font-bold text-center mb-2">Admin Access</h1>
                <p className="text-stone-500 text-center mb-8">Login to manage your restaurant</p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            {...register("email", { required: true })}
                            type="email"
                            className="w-full border border-stone-300 rounded px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            {...register("password", { required: true })}
                            type="password"
                            className="w-full border border-stone-300 rounded px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-stone-900 text-white py-3 rounded hover:bg-stone-800 transition disabled:opacity-70"
                    >
                        {isLoading ? "Authenticating..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}