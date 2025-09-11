import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Plus, Search, Library, Settings } from "lucide-react";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.text || "No response from AI",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error fetching response." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-gray-100">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 bg-zinc-950 flex flex-col">
        <div className="p-4 border-b border-gray-800 font-bold text-lg">
          ChatGPT
        </div>

        <div className="p-2 space-y-2 flex-1 overflow-y-auto">
          <button className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-zinc-800">
            <Plus size={18} /> New chat
          </button>
          <button className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-zinc-800">
            <Search size={18} /> Search chats
          </button>
          <button className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-zinc-800">
            <Library size={18} /> Library
          </button>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-2 p-2 w-full rounded-lg hover:bg-zinc-800">
            <Settings size={18} /> Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {messages.length === 0 ? (
          <motion.h1
            className="text-2xl font-semibold mb-6 text-center text-gray-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            What's on your mind today?
          </motion.h1>
        ) : (
          <div className="flex-1 w-full max-w-3xl overflow-y-auto p-4 space-y-3 border border-gray-800 rounded-lg bg-zinc-900 shadow-sm">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg max-w-[80%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-zinc-800 text-gray-200"
                }`}
              >
                {msg.content}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="bg-black text-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-3 rounded-full border border-gray-700 bg-zinc-900 text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ask anything..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`p-3 rounded-full ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white shadow`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
