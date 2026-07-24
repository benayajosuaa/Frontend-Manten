"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan Password wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://api-manten.kamar320.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || data.message || "Login gagal");
        return;
      }

      // Simpan JWT
      localStorage.setItem("token", data.token);

      // Redirect
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`${montserrat.className} min-h-screen flex items-center justify-center bg-white`}
    >
      <div className="flex items-center gap-14">

        {/* Logo */}
        <Image
          src="/logo/manten.png"
          alt="Logo"
          width={200}
          height={60}
          priority
        />

        {/* Divider */}
        <div className="h-72 border-l border-gray-300" />

        {/* Form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-10"
        >
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              placeholder="admin@manten.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-105
                border-b
                border-gray-500
                py-2
                outline-none
                focus:border-[#394322]
                transition
              "
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-105
                border-b
                border-gray-500
                py-2
                outline-none
                focus:border-[#394322]
                transition
              "
            />
          </div>

          {/* Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="
                bg-[#394322]
                text-white
                px-8
                py-3
                rounded-md
                transition-all
                hover:bg-[#2f371b]
                active:scale-95
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}