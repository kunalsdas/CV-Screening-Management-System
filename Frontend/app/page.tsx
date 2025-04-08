"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaPaperPlane, FaMicrophone } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const webhookUrl = "https://primary-production-1e6c.up.railway.app/webhook/data-dashboard";

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);
    setInput("");

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: JSON.stringify({ message: input }),
        headers: { "Content-Type": "application/json" },
      });
      const textResponse = await response.text();
      setMessages((prev) => [...prev, { role: "bot", text: textResponse }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠️ Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = () => {
    setRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
    });
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
<main className="flex flex-col items-center justify-center w-full h-screen bg-background text-foreground">
  {/* HireGenius Title */}
  <div className="absolute top-4 left-4 text-3xl font-extrabold text-primary tracking-wide">
  HireGenius
  </div>

  {/* Chat Container */}
  <div className="w-full max-w-2xl h-full flex flex-col">
    <ScrollArea className="flex-1 p-4 space-y-3 overflow-y-auto scrollbar-hide">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`p-2 text-sm rounded-md max-w-[65%] mb-3 ${
              msg.role === "user"
                ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100" // User message styling
                : "bg-muted text-foreground" // Bot message styling
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {loading && <ImSpinner8 className="animate-spin text-muted-foreground text-2xl self-center" />}
    </ScrollArea>

    {/* Input & Button Section */}
    <div className="flex items-center gap-3 p-4 border-t bg-background">
      <Button variant="ghost" className="p-2" onClick={recording ? stopRecording : startRecording}>
        <FaMicrophone size={20} className={recording ? "text-red-500 animate-pulse" : "text-primary"} />
      </Button>

      <Input
        className="flex-grow bg-muted rounded-lg px-3 py-2 max-h-40 overflow-y-auto text-sm"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
      />

      <Button onClick={sendMessage} className="p-2">
        <FaPaperPlane size={18} />
      </Button>
    </div>
  </div>
</main>


  );
}
