"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// Sample best dishes data
const bestDishes = [
  {
    id: 1,
    name: "Signature Pasta",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
  },
  {
    id: 2,
    name: "Wagyu Steak",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02",
  },
  {
    id: 3,
    name: "Truffle Risotto",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172789a",
  },
  {
    id: 4,
    name: "Seafood Platter",
    image: "https://images.unsplash.com/photo-1559742811-822873691df8",
  },
];

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function TablePage() {
  const params = useParams();
  const { hotelid, tableid } = params;

  // GitHub repo data fetch
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("https://api.github.com/repos/TanStack/query").then((res) =>
        res.json()
      ),
  });

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      const parsed = JSON.parse(storedMessages);
      if (Array.isArray(parsed)) setMessages(parsed);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0)
      localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => emblaApi.scrollNext(), 3000);
      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputMessage }),
      });
      const data = await response.json();

      const aiMessage: Message = {
        text: data.reply,
        isUser: false,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + (error as Error).message;

  return (
    <main className="min-h-screen bg-background flex flex-col p-4">
      {/* Hotel & Table Info */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Hotel & Table Info</h1>
        <p>
          <strong>Hotel ID:</strong> {hotelid}
        </p>
        <p>
          <strong>Table ID:</strong> {tableid}
        </p>
        <h2 className="text-xl font-semibold mt-2">{data.name}</h2>
        <p>{data.description}</p>
        <div className="flex gap-4 mt-1">
          <strong>👀 {data.subscribers_count}</strong>
          <strong>✨ {data.stargazers_count}</strong>
          <strong>🍴 {data.forks_count}</strong>
        </div>
      </section>

      {/* Best Dishes Carousel */}
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Best Dishes</h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {bestDishes.map((dish) => (
              <div
                key={dish.id}
                className="flex-[0_0_100%] min-w-0 pl-4 first:pl-0"
              >
                <Card className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold">{dish.name}</h3>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section className="flex-1 flex flex-col max-h-[60vh]">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-primary">
            Confused? Ask our digital waiter!
          </h2>
        </div>

        <ScrollArea className="flex-1 p-4 rounded-lg border overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("chatMessages");
              setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
            }}
          >
            Clear Chat
          </Button>

          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />

          <Button onClick={handleSendMessage} disabled={isLoading} className="px-4">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
