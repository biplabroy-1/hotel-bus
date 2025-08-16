"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"

type Message = {
  id: number
  sender: "user" | "bot"
  text: string
}

export default function KYCChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "bot", text: "Hello! I’m your KYC assistant. Tell me about yourself." },
  ])
  const [input, setInput] = useState("")
  const [understood, setUnderstood] = useState<string[]>([])

  const handleSend = () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    }

    setMessages([...messages, newMessage])

    // fake bot reply + "understood" extraction
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: prev.length + 1, sender: "bot", text: `Got it: "${input}". Tell me more!` },
      ])

      // naive extraction: just append what user said
      setUnderstood(prev => [...prev, input])
    }, 800)

    setInput("")
  }

  return (
    <div className="flex-1 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Chat Section */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Know Your Customer
          </h1>

          <Card className="flex flex-col h-[70vh]">
            <CardHeader>
              <CardTitle className="text-lg">KYC Assistant</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="mt-4 flex gap-2">
                <Input
                  placeholder="Type your response..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: What Chatbot Understood */}
        <div>
          <h3 className="text-lg font-semibold mb-2">
            What Chatbot Understood
          </h3>
          <Card className="h-[70vh] flex flex-col">
            <CardContent className="flex-1 overflow-auto p-4 space-y-2">
              {understood.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing captured yet...
                </p>
              ) : (
                understood.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-muted p-2 rounded text-sm"
                  >
                    {item}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
