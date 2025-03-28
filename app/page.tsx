"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

//  Google AI API Anahtarını Buraya Gir (Güvenli sakla!)
const genAI = new GoogleGenerativeAI("AIzaSyCR9eFxuIvdtgtUPeN1LhjoXGMRI8IPAQU");

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(input);
      const responseText = result.response.text();

      setMessages([...newMessages, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-lg p-4 bg-white rounded shadow">
        <h1 className="text-xl font-bold mb-4">Yusuf'un botu</h1>
        <div className="h-80 overflow-y-auto border p-2 mb-2">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 my-1 rounded ${msg.role === "user" ? "bg-blue-200 text-right" : "bg-gray-200"}`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 p-2 border rounded-l"
            placeholder="Mesajınızı yazınnn..."
          />
          <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded-r">
            {loading ? "..." : "Gönder"}
          </button>
        </div>
      </div>
    </div>
  );
}
