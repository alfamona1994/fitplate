"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
const WELCOME = "Hi! Ask me about your workouts, meals, calories or general fitness. I can't give medical advice.";
const START = ["What is my workout plan?", "What should I eat today?", "How many calories do I need?", "Why this plan?"];

interface Message { role: "user" | "assistant"; content: string; }

export default function Assistant() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const loaded = useRef(false);
  const bottom = useRef<HTMLDivElement>(null);
  const auth = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!open || loaded.current || !token) return;
    loaded.current = true;
    fetch(`${API}/chat/history`, { headers: auth })
      .then((r) => (r.ok ? r.json() : []))
      .then((h: Message[]) => setMessages(h.length ? h : [{ role: "assistant", content: WELCOME }]))
      .catch(() => setMessages([{ role: "assistant", content: WELCOME }]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, token]);

  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || loading) return;
    setError("");
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch(`${API}/chat`, { method: "POST", headers: { "Content-Type": "application/json", ...auth }, body: JSON.stringify({ message }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Something went wrong.");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cannot reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const clear = async () => {
    await fetch(`${API}/chat/history`, { method: "DELETE", headers: auth }).catch(() => {});
    setMessages([{ role: "assistant", content: WELCOME }]);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" role="dialog" aria-label="FitPlate Assistant">
          <Card className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden">
            <div className="flex items-center justify-between bg-[#10261C] px-6 py-4 text-white">
              <div>
                <p className="font-medium">FitPlate Assistant</p>
                <p className="text-xs text-[#B9D4C3]">General wellness help, not medical advice</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={clear} className="text-xs underline">Clear chat</button>
                <button onClick={() => setOpen(false)} aria-label="Close" className="text-xl">✕</button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-6 text-sm" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
                  <p className={`max-w-[85%] whitespace-pre-line rounded-2xl p-3 ${m.role === "user" ? "bg-[#1F6F4A] text-white" : "bg-[#E8F1EA] text-[#10261C]"}`}>{m.content}</p>
                </div>
              ))}
              {loading && <p className="text-[#5F7A6B]">Typing...</p>}
              {error && <p role="alert" className="rounded-lg bg-[#FDECEA] px-3 py-2 text-[#9B1C1C]">{error}</p>}
              <div ref={bottom} />
            </div>

            <div className="border-t border-[#10261C]/10 p-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {START.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-[#1F6F4A]/40 px-3 py-1 text-xs text-[#1F6F4A] hover:bg-[#E8F1EA]">{s}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  maxLength={500}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Type your question"
                  aria-label="Message"
                  className="w-full rounded-full border border-[#10261C]/25 px-5 py-3 text-sm focus:border-[#1F6F4A] focus:outline-none focus:ring-2 focus:ring-[#1F6F4A]/30"
                />
                <button onClick={() => send(input)} disabled={loading || !input.trim()} className="rounded-full bg-[#1F6F4A] px-5 text-sm font-medium text-white hover:bg-[#175a3b] disabled:opacity-60">Send</button>
              </div>
            </div>
          </Card>
        </div>
      )}
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 rounded-full bg-[#1F6F4A] px-5 py-3 font-medium text-white shadow-lg hover:bg-[#175a3b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3D] focus-visible:ring-offset-2">
        Ask FitPlate
      </button>
    </>
  );
}