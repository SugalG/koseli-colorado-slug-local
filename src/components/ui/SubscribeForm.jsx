"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "✅ Thanks for subscribing!");
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setMessage("Error: unable to subscribe right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-brand-primary font-semibold px-6 py-2 rounded-md hover:bg-gray-100 transition disabled:opacity-70"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && (
        <p className="text-sm text-white/80 mt-2 text-center w-full">{message}</p>
      )}
    </form>
  );
}
