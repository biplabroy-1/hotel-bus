"use client"

import React, { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Chat = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }])

    // Add dummy bot reply after short delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "This is a dummy response 🤖" },
      ])
    }, 500)

    setInput("")
  }

  return (
    <div className="flex flex-col max-w-md mx-auto border rounded-lg shadow-md h-[80vh]">
      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Bar */}
      <div className="p-3 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}

export default Chat
